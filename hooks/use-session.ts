import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@session_user';

export type SessionUser = {
  id: number;
  nome: string;
  tipo: 'professor' | 'aluno' | 'PROFESSOR' | 'ALUNO';
  email: string;
};

export async function saveSession(user: SessionUser) {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function clearSession() {
  await AsyncStorage.removeItem(KEY);
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setUser(JSON.parse(raw));
    });
  }, []);

  return user;
}
