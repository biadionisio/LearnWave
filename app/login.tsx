import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet, Text, TextInput, TouchableOpacity,
  View, Dimensions, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Clay } from '@/constants/theme';

const { width } = Dimensions.get('window');

type Role = 'professor' | 'aluno' | null;

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    if (!role || !email || !senha) return;
    if (role === 'professor') {
      router.replace('/professor/chat');
    } else {
      router.replace('/aluno/chat');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Escolha seu perfil para continuar</Text>

          {/* Role selector */}
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'professor' && styles.roleBtnActive]}
              onPress={() => setRole('professor')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="school-outline"
                size={26}
                color={role === 'professor' ? Colors.accent : Colors.text.secondary}
              />
              <Text style={[styles.roleText, role === 'professor' && styles.roleTextActive]}>
                Professor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'aluno' && styles.roleBtnActive]}
              onPress={() => setRole('aluno')}
              activeOpacity={0.85}
            >
              <Ionicons
                name="person-outline"
                size={26}
                color={role === 'aluno' ? Colors.accent : Colors.text.secondary}
              />
              <Text style={[styles.roleText, role === 'aluno' && styles.roleTextActive]}>
                Aluno
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={Colors.text.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.text.muted}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, (!role || !email || !senha) && styles.loginBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.purple.dark,
    opacity: 0.5,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.blue.dark,
    opacity: 0.45,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  card: {
    width: width * 0.9,
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.xl,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.purple.mid + '50',
    ...Clay.shadow,
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: -12,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Clay.shadowSm,
    gap: 6,
  },
  roleBtnActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.purple.dark,
  },
  roleText: {
    color: Colors.text.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  roleTextActive: {
    color: Colors.accent,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface.input,
    borderRadius: Clay.radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text.primary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '60',
  },
  loginBtn: {
    backgroundColor: Colors.purple.mid,
    borderRadius: Clay.radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.light,
    marginTop: 4,
    ...Clay.shadow,
  },
  loginBtnDisabled: {
    opacity: 0.4,
  },
  loginBtnText: {
    color: Colors.text.primary,
    fontSize: 17,
    fontWeight: '700',
  },
});
