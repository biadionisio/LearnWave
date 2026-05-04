import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="sobre" />
        <Stack.Screen name="professor/chat" />
        <Stack.Screen name="aluno/chat" />
        <Stack.Screen name="chat/[id]" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
