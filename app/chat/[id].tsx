import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Clay } from '@/constants/theme';
import { conversations, Message } from '@/constants/mock-data';

export default function ChatScreen() {
  const { id, role } = useLocalSearchParams<{ id: string; role: 'professor' | 'aluno' }>();
  const router = useRouter();

  const conv = conversations.find((c) => c.id === id);
  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const [text, setText] = useState('');

  function sendMessage() {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      from: role ?? 'aluno',
      text: text.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
  }

  const myRole = role ?? 'aluno';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <View style={styles.blobTop} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerAvatar}>{conv?.avatar}</Text>
          <Text style={styles.headerName}>{conv?.name}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isMe = item.from === myRole;
          return (
            <View style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                  {item.text}
                </Text>
                <Text style={styles.bubbleTime}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={Colors.text.muted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          activeOpacity={0.85}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
  },
  blobTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.purple.dark,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.purple.mid + '30',
  },
  backText: {
    fontSize: 26,
    color: Colors.text.secondary,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: { fontSize: 28 },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  messageList: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '75%',
    borderRadius: Clay.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Clay.shadowSm,
    gap: 4,
  },
  bubbleMe: {
    backgroundColor: Colors.purple.mid,
    borderWidth: 1,
    borderColor: Colors.purple.light + '60',
    borderBottomRightRadius: 6,
  },
  bubbleThem: {
    backgroundColor: Colors.surface.card,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '50',
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMe: { color: Colors.text.primary },
  bubbleTextThem: { color: Colors.text.secondary },
  bubbleTime: {
    fontSize: 10,
    color: Colors.text.muted,
    alignSelf: 'flex-end',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.purple.mid + '30',
    backgroundColor: Colors.surface.overlay,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '50',
    maxHeight: 100,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.purple.mid,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.light,
    ...Clay.shadowSm,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: {
    color: Colors.text.primary,
    fontSize: 18,
  },
});
