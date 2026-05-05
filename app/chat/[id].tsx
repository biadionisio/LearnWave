import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.text.secondary} />
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
          placeholder="Mensagem..."
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
          <Ionicons name="send" size={16} color={Colors.text.primary} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 48,
    paddingBottom: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.purple.mid + '30',
  },
  backBtn: {
    padding: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAvatar: { fontSize: 22 },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  messageList: {
    padding: 12,
    gap: 6,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginVertical: 1,
  },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    borderRadius: Clay.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 7,
    ...Clay.shadowSm,
    gap: 2,
  },
  bubbleMe: {
    backgroundColor: Colors.purple.mid,
    borderWidth: 1,
    borderColor: Colors.purple.light + '60',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.surface.card,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '50',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 19,
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.purple.mid + '30',
    backgroundColor: Colors.surface.overlay,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: Colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '50',
    maxHeight: 90,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.purple.mid,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.light,
    ...Clay.shadowSm,
  },
  sendBtnDisabled: { opacity: 0.4 },
});
