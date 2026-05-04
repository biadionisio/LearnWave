import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';
import { Colors, Clay } from '@/constants/theme';
import { conversations } from '@/constants/mock-data';

const { width } = Dimensions.get('window');
const alunos = conversations.filter((c) => c.role === 'aluno');

export default function ProfessorChatScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.blobTop} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Alunos</Text>
          <Text style={styles.headerSub}>{alunos.length} conversas</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/chat/${item.id}?role=professor`)}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{item.avatar}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
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
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.purple.dark,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.purple.mid + '60',
  },
  logoutText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.blue.mid + '40',
    ...Clay.shadowSm,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface.input,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.purple.mid + '60',
  },
  avatarEmoji: { fontSize: 26 },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  lastMsg: {
    fontSize: 13,
    color: Colors.text.muted,
    marginTop: 3,
  },
  arrow: {
    fontSize: 24,
    color: Colors.text.muted,
  },
});
