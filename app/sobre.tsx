import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { Colors, Clay } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function SobreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.heroCard}>
          <Text style={styles.emoji}>🌊</Text>
          <Text style={styles.heroTitle}>LearnWave</Text>
          <Text style={styles.heroSub}>Versão 1.0.0</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nossa Missão</Text>
          <Text style={styles.cardText}>
            O LearnWave é uma plataforma de comunicação educacional que conecta professores e alunos
            de forma simples, rápida e eficiente. Acreditamos que a comunicação é a base do
            aprendizado.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como funciona</Text>
          {[
            { icon: '👨🏫', text: 'Professores enviam mensagens e materiais para seus alunos' },
            { icon: '🎓', text: 'Alunos recebem e respondem diretamente aos professores' },
            { icon: '💬', text: 'Chat em tempo real para uma comunicação fluida' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{item.icon}</Text>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desenvolvido por</Text>
          <Text style={styles.cardText}>Turma INF3BM — 2025</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.overlay,
  },
  blobTop: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.blue.dark,
    opacity: 0.5,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.purple.dark,
    opacity: 0.45,
  },
  scroll: {
    padding: 24,
    paddingTop: 60,
    gap: 16,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },
  heroCard: {
    width: width * 0.9,
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.xl,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.purple.mid + '50',
    ...Clay.shadow,
    gap: 8,
  },
  emoji: { fontSize: 56 },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  heroSub: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  card: {
    width: width * 0.9,
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '40',
    ...Clay.shadowSm,
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.accent,
  },
  cardText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureEmoji: { fontSize: 20 },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
