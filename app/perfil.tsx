import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Clay } from '@/constants/theme';

const AVATARS = ['🧑', '👩', '👨', '🧒', '👧', '👦', '🧑‍💻', '👩‍🏫', '👨‍🏫', '🧑‍🎓', '👩‍🎓', '👨‍🎓'];

export default function PerfilScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'professor' | 'aluno' }>();

  const [nome, setNome] = useState('');
  const [avatar, setAvatar] = useState('🧑');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const backRoute = role === 'professor' ? '/professor/chat' : '/aluno/chat';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.blobTop} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace(backRoute)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Avatar preview */}
        <View style={styles.avatarPreview}>
          <Text style={styles.avatarPreviewEmoji}>{avatar}</Text>
        </View>

        {/* Avatar picker */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Escolha seu avatar</Text>
          <View style={styles.avatarGrid}>
            {AVATARS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.avatarOption, avatar === a && styles.avatarOptionActive]}
                onPress={() => setAvatar(a)}
                activeOpacity={0.8}
              >
                <Text style={styles.avatarOptionEmoji}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nome */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Nome de exibição</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome..."
            placeholderTextColor={Colors.text.muted}
            value={nome}
            onChangeText={setNome}
            maxLength={40}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons
            name={saved ? 'checkmark' : 'save-outline'}
            size={18}
            color={Colors.text.primary}
          />
          <Text style={styles.saveBtnText}>{saved ? 'Salvo!' : 'Salvar alterações'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.replace(backRoute)}>
          <Ionicons name="chatbubbles-outline" size={22} color={Colors.text.muted} />
          <Text style={styles.tabLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
          <Ionicons name="person" size={22} color={Colors.accent} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Perfil</Text>
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
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.purple.dark,
    opacity: 0.4,
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    marginBottom: 8,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  avatarPreview: {
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.surface.card,
    borderWidth: 2,
    borderColor: Colors.purple.mid,
    justifyContent: 'center',
    alignItems: 'center',
    ...Clay.shadow,
  },
  avatarPreviewEmoji: { fontSize: 48 },
  card: {
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.purple.mid + '40',
    ...Clay.shadowSm,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    letterSpacing: 0.4,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface.input,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  avatarOptionActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.purple.dark,
  },
  avatarOptionEmoji: { fontSize: 24 },
  input: {
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '60',
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.purple.mid,
    borderRadius: Clay.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.light,
    gap: 8,
    ...Clay.shadow,
  },
  saveBtnSuccess: {
    backgroundColor: '#2d6a4f',
    borderColor: '#52b788',
  },
  saveBtnText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.purple.mid + '30',
    backgroundColor: Colors.surface.overlay,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
    gap: 10,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '50',
  },
  tabItemActive: {
    backgroundColor: Colors.purple.dark,
    borderColor: Colors.accent + '80',
  },
  tabLabel: {
    fontSize: 13,
    color: Colors.text.muted,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
