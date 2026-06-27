import { Clay, Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>LW</Text>
          </View>
          <Text style={styles.heroTitle}>LearnWave</Text>
          <Text style={styles.heroSub}>Assistente de Estudos de Português </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nossa Missão</Text>
          <Text style={styles.cardText}>
            O LearnWave é uma plataforma educacional que conecta professores e alunos
            de forma simples e eficiente. Acreditamos que a comunicação é a base do aprendizado.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como funciona</Text>
          {[
            { text: 'Professores enviam mensagens e materiais para seus alunos' },
            { text: 'Alunos recebem e respondem diretamente aos professores' },
            { text: 'Chat em tempo real para uma comunicação fluida' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desenvolvido por</Text>
          <Text style={styles.cardText}>LearnWave-2026</Text>
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
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.purple.mid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBadgeText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
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
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 7,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
