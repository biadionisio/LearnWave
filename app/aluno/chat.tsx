import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet, Text, TouchableOpacity, View, FlatList,
  Platform, Image, TextInput, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Clay } from '@/constants/theme';
import { useProfile } from '@/hooks/use-profile';
import { useSession } from '@/hooks/use-session';

const API = 'https://learnwaveback2.onrender.com/api';

type Usuario = { id: number; nome: string; fotoPerfil?: string };

function initials(nome: string) {
  return nome.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function AlunoChatScreen() {
  const router = useRouter();
  const session = useSession();
  const { nome, photo } = useProfile();
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Guard: redireciona se não for aluno
  useEffect(() => {
    if (!session) return;
    const tipo = session.tipo.toLowerCase();
    if (tipo === 'professor') router.replace('/professor/chat');
    else if (tipo !== 'aluno') router.replace('/');
  }, [session?.tipo]);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`${API}/usuarios`);
      const todos: any[] = await res.json();
      setProfessores(
        todos.filter(u => u.tipo === 'PROFESSOR' && u.status === 'ativo')
             .map(u => ({ id: u.id, nome: u.nome, fotoPerfil: u.fotoPerfil }))
      );
    } catch { /* sem conexão */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const lista = busca.trim()
    ? professores.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    : professores;

  return (
    <View style={styles.container}>
      <View style={styles.blobTop} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Professores</Text>
          <Text style={styles.headerSub}>{lista.length} encontrados</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={Colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar professor..."
          placeholderTextColor={Colors.text.muted}
          value={busca}
          onChangeText={setBusca}
          autoCapitalize="none"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={18} color={Colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum professor encontrado.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/chat/${item.id}?role=aluno&nomeOutro=${encodeURIComponent(item.nome)}`)}
              activeOpacity={0.85}
            >
              <View style={styles.avatar}>
                {item.fotoPerfil ? (
                  <Image source={{ uri: item.fotoPerfil }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>{initials(item.nome)}</Text>
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nome}</Text>
                <Text style={styles.sub}>Professor</Text>
              </View>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.text.muted} />
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
          <Ionicons name="chatbubbles" size={22} color={Colors.accent} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/perfil?role=aluno')}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.tabAvatar} />
          ) : (
            <Ionicons name="person-outline" size={22} color={Colors.text.muted} />
          )}
          <Text style={styles.tabLabel}>{nome.trim() ? nome.split(' ')[0] : 'Perfil'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface.overlay },
  blobTop: {
    position: 'absolute', top: -60, left: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: Colors.blue.dark, opacity: 0.5,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: Colors.text.primary },
  headerSub: { fontSize: 13, color: Colors.text.muted, marginTop: 2 },
  logoutBtn: {
    backgroundColor: Colors.surface.card, borderRadius: Clay.radius.sm,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.blue.mid + '60',
  },
  logoutText: { color: Colors.text.secondary, fontSize: 14, fontWeight: '600' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 12,
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.md,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.blue.mid + '40',
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1, color: Colors.text.primary, fontSize: 14,
  },
  list: { paddingHorizontal: 24, gap: 12, paddingBottom: 16 },
  emptyText: { color: Colors.text.muted, textAlign: 'center', marginTop: 32, fontSize: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg, padding: 16,
    borderWidth: 1, borderColor: Colors.purple.mid + '40',
    ...Clay.shadowSm, gap: 14,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surface.input,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.blue.mid + '60',
    overflow: 'hidden',
  },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  avatarText: { fontSize: 15, fontWeight: '700', color: Colors.text.primary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text.primary },
  sub: { fontSize: 12, color: Colors.text.muted, marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: Colors.purple.mid + '30',
    backgroundColor: Colors.surface.overlay,
    paddingHorizontal: 12, paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18, gap: 10,
  },
  tabItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 7, backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md, paddingVertical: 11,
    borderWidth: 1, borderColor: Colors.blue.mid + '50',
  },
  tabItemActive: { backgroundColor: Colors.purple.dark, borderColor: Colors.accent + '80' },
  tabLabel: { fontSize: 13, color: Colors.text.muted, fontWeight: '600' },
  tabLabelActive: { color: Colors.accent, fontWeight: '700' },
  tabAvatar: { width: 22, height: 22, borderRadius: 11 },
});
