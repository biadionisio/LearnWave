import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Colors, Clay } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <View style={styles.content}>
        {/* Logo card */}
        <View style={styles.logoCard}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>LW</Text>
          </View>
          <Text style={styles.logoTitle}>LearnWave</Text>
          <Text style={styles.logoSubtitle}>Conectando professores e alunos</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/sobre')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Sobre Nós</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.purple.dark,
    opacity: 0.6,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -100,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.blue.dark,
    opacity: 0.5,
  },
  content: {
    width: width * 0.85,
    alignItems: 'center',
    gap: 32,
  },
  logoCard: {
    width: '100%',
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.xl,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.purple.mid + '60',
    ...Clay.shadow,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.purple.mid,
    borderWidth: 2,
    borderColor: Colors.purple.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Clay.shadow,
  },
  logoBadgeText: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  btnPrimary: {
    backgroundColor: Colors.purple.mid,
    borderRadius: Clay.radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.light,
    ...Clay.shadow,
  },
  btnPrimaryText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.blue.mid + '80',
    ...Clay.shadowSm,
  },
  btnSecondaryText: {
    color: Colors.text.secondary,
    fontSize: 18,
    fontWeight: '600',
  },
});
