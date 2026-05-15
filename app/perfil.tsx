import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, ScrollView, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Clay } from '@/constants/theme';

export default function PerfilScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'professor' | 'aluno' }>();

  const [nome, setNome] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const backRoute = role === 'professor' ? '/professor/chat' : '/aluno/chat';
  const initials = nome.trim() ? nome.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.blobTop} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace(backRoute)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarPreview} onPress={pickImage} activeOpacity={0.8}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarInitials}>{initials}</Text>
          )}
          <View style={styles.cameraOverlay}>
            <Ionicons name="camera" size={16} color={Colors.text.primary} />
          </View>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Toque para alterar a foto</Text>

        {/* Nome */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Nome de exibicao</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome..."
            placeholderTextColor={Colors.text.muted}
            value={nome}
            onChangeText={setNome}
            maxLength={40}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name={saved ? 'checkmark' : 'save-outline'} size={18} color={Colors.text.primary} />
          <Text style={styles.saveBtnText}>{saved ? 'Salvo!' : 'Salvar alteracoes'}</Text>
        </TouchableOpacity>
      </ScrollView>

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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    marginBottom: 8,
    width: '100%',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface.card,
    borderWidth: 2,
    borderColor: Colors.purple.mid,
    justifyContent: 'center',
    alignItems: 'center',
    ...Clay.shadow,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.purple.mid,
    borderWidth: 2,
    borderColor: Colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: -8,
  },
  card: {
    width: '100%',
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
    width: '100%',
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
