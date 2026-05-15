import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Clay } from '@/constants/theme';
import { conversations } from '@/constants/mock-data';

const professores = conversations.filter((c) => c.role === 'professor');

export default function AlunoChatScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.blobTop} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Meus Professores</Text>
          <Text style={styles.headerSub}>{professores.length} conversas</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={professores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/chat/${item.id}?role=aluno`)}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
          <Ionicons name="chatbubbles" size={22} color={Colors.accent} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/perfil?role=aluno')}
        >
          <Ionicons name="person-outline" size={22} color={Colors.text.muted} />
          <Text style={styles.tabLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
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
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.blue.dark,
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
    borderColor: Colors.blue.mid + '60',
  },
  logoutText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 24,
    gap: 12,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.card,
    borderRadius: Clay.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.purple.mid + '40',
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
    borderColor: Colors.blue.mid + '60',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
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
