import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, FlatList, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Clay } from '@/constants/theme';
import { useSession } from '@/hooks/use-session';
import { encrypt, decrypt } from '@/utils/crypto';

const API = 'https://learnwaveback2.onrender.com/api';
const POLL_MS = 3000;

type Status = 'enviado' | 'entregue' | 'lido';
type Msg = { id: string; senderId: number; text: string; time: string; status: Status };

function storageKey(meId: number, outroId: string) {
  const pair = [String(meId), outroId].sort().join('_');
  return `@chat_${pair}`;
}

function readKey(leitorId: number, outroId: string) {
  const pair = [String(leitorId), outroId].sort().join('_');
  return `@read_${pair}_by_${leitorId}`;
}

async function loadMsgs(key: string, meId: number, outroId: string): Promise<Msg[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  const parsed: any[] = JSON.parse(raw);
  if (parsed.length && 'from' in parsed[0]) {
    await AsyncStorage.removeItem(key);
    return [];
  }
  const msgs = parsed.map(m => ({
    status: 'entregue' as Status,
    ...m,
    text: decrypt(m.text, meId, outroId),
  }));
  // Remove mensagens com IDs temporários (Date.now = 13 dígitos) — não são confiáveis
  return msgs.filter(m => m.id.length <= 10);
}

async function saveMsgs(key: string, msgs: Msg[], meId: number, outroId: string) {
  const toStore = msgs.map(m => ({ ...m, text: encrypt(m.text, meId, outroId) }));
  await AsyncStorage.setItem(key, JSON.stringify(toStore));
}

function initials(name: string) {
  return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function StatusTick({ status }: { status: Status }) {
  if (status === 'enviado')
    return <Ionicons name="checkmark" size={12} color={Colors.text.muted} />;
  if (status === 'entregue')
    return (
      <View style={tickStyles.row}>
        <Ionicons name="checkmark" size={12} color={Colors.text.muted} />
        <Ionicons name="checkmark" size={12} color={Colors.text.muted} style={tickStyles.second} />
      </View>
    );
  return (
    <View style={tickStyles.row}>
      <Ionicons name="checkmark" size={12} color={Colors.accent} />
      <Ionicons name="checkmark" size={12} color={Colors.accent} style={tickStyles.second} />
    </View>
  );
}

const tickStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  second: { marginLeft: -5 },
});

export default function ChatScreen() {
  const { id: outroId, role, nomeOutro } = useLocalSearchParams<{
    id: string;
    role: 'professor' | 'aluno';
    nomeOutro?: string;
  }>();
  const router = useRouter();
  const session = useSession();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [outroNome, setOutroNome] = useState(decodeURIComponent(nomeOutro ?? ''));
  const [outroFoto, setOutroFoto] = useState<string | null>(null);
  const flatRef = useRef<FlatList>(null);
  const latestIdRef = useRef<number>(0);
  const keyRef = useRef<string>('');
  const outroIdNum = parseInt(outroId, 10);

  // Carrega histórico local + dados do outro usuário
  useEffect(() => {
    if (!session) return;
    keyRef.current = storageKey(session.id, outroId);

    loadMsgs(keyRef.current, session.id, outroId).then((saved) => {
      // IDs temporários (Date.now, 13 dígitos) não são IDs reais do banco — ignora
      const realMsgs = saved.filter(m => m.id.length <= 10);
      setMessages(realMsgs);
      if (realMsgs.length) latestIdRef.current = Math.max(...realMsgs.map(m => parseInt(m.id, 10)));
    });

    fetch(`${API}/usuarios/${outroIdNum}`)
      .then(r => r.json())
      .then((u: any) => {
        if (!outroNome && u.nome) setOutroNome(u.nome);
        if (u.fotoPerfil) setOutroFoto(u.fotoPerfil);
      })
      .catch(() => {});
  }, [session?.id, outroId]);

  // Marca lido ao abrir
  useEffect(() => {
    if (!session) return;
    AsyncStorage.setItem(readKey(session.id, outroId), Date.now().toString());
  }, [session?.id, outroId]);

  // Rola para o fim
  useEffect(() => {
    if (messages.length)
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length]);

  // Polling: busca mensagens novas da API
  const pollMessages = useCallback(async () => {
    if (!session || !keyRef.current) return;

    // Atualiza status de leitura (lógica local)
    const rKey = readKey(outroIdNum, outroId);
    const readAtRaw = await AsyncStorage.getItem(rKey);
    const readAt = readAtRaw ? parseInt(readAtRaw, 10) : 0;

    setMessages(prev => {
      let changed = false;
      const updated = prev.map(m => {
        if (m.senderId !== session.id) return m;
        const msgTs = parseInt(m.id, 10);
        let newStatus: Status = m.status;
        if (readAt >= msgTs && m.status !== 'lido') { newStatus = 'lido'; changed = true; }
        else if (m.status === 'enviado') { newStatus = 'entregue'; changed = true; }
        return newStatus !== m.status ? { ...m, status: newStatus } : m;
      });
      if (changed) {
        saveMsgs(keyRef.current, updated, session.id, outroId);
        return updated;
      }
      return prev;
    });

    // Busca mensagens da API real — passa os dois IDs, o back retorna ambos os lados
    try {
      const res = await fetch(
        `${API}/chat/mensagens?remetenteId=${session.id}&destinatarioId=${outroId}`
      );
      if (!res.ok) return;

      const todas: { id: number; remetenteId: number; destinatarioId: number; texto: string; dataEnvio: string }[] =
        await res.json();

      // Filtra apenas as mais novas que já temos
      const novas = todas.filter(m => m.id > latestIdRef.current);
      if (!novas.length) return;

      const mapped: Msg[] = novas.map(m => ({
        id: String(m.id),
        senderId: m.remetenteId,
        text: m.texto,
        time: new Date(m.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: m.remetenteId === session.id ? 'entregue' : 'lido',
      }));

      setMessages(prev => {
        const existingIds = new Set(prev.filter(m => !m.id.startsWith('tmp_')).map(m => m.id));
        const filtradas = mapped.filter(m => !existingIds.has(m.id));
        if (!filtradas.length) return prev;
        // Remove temporários e adiciona os reais
        const semTmp = prev.filter(m => !m.id.startsWith('tmp_'));
        const result = [...semTmp, ...filtradas];
        saveMsgs(keyRef.current, result, session.id, outroId);
        latestIdRef.current = Math.max(...result.map(m => parseInt(m.id, 10)));
        return result;
      });
    } catch { /* sem conexão */ }
  }, [session, outroId, outroIdNum]);

  useEffect(() => {
    // Busca imediata ao abrir
    pollMessages();
    const interval = setInterval(pollMessages, POLL_MS);
    return () => clearInterval(interval);
  }, [pollMessages]);

  async function sendMessage() {
    if (!text.trim() || !session) return;
    const msgText = text.trim();
    setText('');

    try {
      const res = await fetch(`${API}/chat/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remetenteId: session.id,
          destinatarioId: outroIdNum,
          texto: msgText,
        }),
      });

      if (res.ok) {
        const saved: { id: number; remetenteId: number; destinatarioId: number; texto: string; dataEnvio: string } =
          await res.json();
        const newMsg: Msg = {
          id: String(saved.id),
          senderId: session.id,
          text: msgText,
          time: new Date(saved.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'enviado',
        };
        setMessages(prev => {
          const updated = [...prev, newMsg];
          saveMsgs(keyRef.current, updated, session.id, outroId);
          latestIdRef.current = saved.id;
          return updated;
        });
      } else {
        // API retornou erro — mostra na tela sem persistir (será re-sincronizado pelo poll)
        const newMsg: Msg = {
          id: `tmp_${Date.now()}`,
          senderId: session.id,
          text: msgText,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'enviado',
        };
        setMessages(prev => [...prev, newMsg]);
      }
    } catch {
      const newMsg: Msg = {
        id: `tmp_${Date.now()}`,
        senderId: session.id,
        text: msgText,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'enviado',
      };
      setMessages(prev => [...prev, newMsg]);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          {outroFoto ? (
            <Image source={{ uri: outroFoto }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{initials(outroNome || '?')}</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName} numberOfLines={1}>{outroNome || '...'}</Text>
          <Text style={styles.headerSub}>{role === 'aluno' ? 'Professor' : 'Aluno'}</Text>
        </View>
      </View>

      {/* Mensagens */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma mensagem ainda.{'\n'}Diga olá! 👋</Text>
        }
        renderItem={({ item }) => {
          const isMe = item.senderId === session?.id;
          return (
            <View style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                  {item.text}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.bubbleTime}>{item.time}</Text>
                  {isMe && <StatusTick status={item.status} />}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Mensagem..."
          placeholderTextColor={Colors.text.muted}
          value={text}
          onChangeText={setText}
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          activeOpacity={0.85}
        >
          <Ionicons name="send" size={16} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface.overlay },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingTop: 48, paddingBottom: 10,
    gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.purple.mid + '30',
  },
  backBtn: { padding: 4 },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.purple.mid,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38, borderRadius: 19 },
  avatarText: { fontSize: 13, fontWeight: '700', color: Colors.text.primary },
  headerName: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  headerSub: { fontSize: 11, color: Colors.text.muted },
  messageList: { padding: 12, gap: 6, flexGrow: 1, justifyContent: 'flex-end' },
  emptyText: {
    textAlign: 'center', color: Colors.text.muted,
    fontSize: 14, lineHeight: 22, marginTop: 60,
  },
  bubbleWrapper: { flexDirection: 'row', marginVertical: 1 },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%', borderRadius: Clay.radius.md,
    paddingHorizontal: 12, paddingVertical: 7,
    ...Clay.shadowSm, gap: 2,
  },
  bubbleMe: {
    backgroundColor: Colors.purple.mid,
    borderWidth: 1, borderColor: Colors.purple.light + '60',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.surface.card,
    borderWidth: 1, borderColor: Colors.blue.mid + '50',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 19 },
  bubbleTextMe: { color: Colors.text.primary },
  bubbleTextThem: { color: Colors.text.secondary },
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end', gap: 3, marginTop: 2,
  },
  bubbleTime: { fontSize: 10, color: Colors.text.muted },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.purple.mid + '30',
    backgroundColor: Colors.surface.overlay,
  },
  input: {
    flex: 1, backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md, paddingHorizontal: 14, paddingVertical: 9,
    color: Colors.text.primary, fontSize: 14,
    borderWidth: 1, borderColor: Colors.blue.mid + '50',
    maxHeight: 90,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.purple.mid,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.purple.light,
    ...Clay.shadowSm,
  },
  sendBtnDisabled: { opacity: 0.4 },
});
