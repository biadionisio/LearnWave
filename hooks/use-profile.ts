import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '@/hooks/use-session';

function keyName(userId: number) { return `@profile_name_${userId}`; }
function keyPhoto(userId: number) { return `@profile_photo_${userId}`; }

export function useProfile() {
  const session = useSession();
  const [nome, setNome] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    AsyncStorage.multiGet([keyName(session.id), keyPhoto(session.id)]).then((pairs) => {
      // fallback: se ainda não tem nome salvo, usa o nome da conta
      setNome(pairs[0][1] ?? session.nome);
      if (pairs[1][1]) setPhoto(pairs[1][1]);
    });
  }, [session?.id]);

  const saveProfile = useCallback(async (newNome: string, newPhoto: string | null) => {
    if (!session) return;
    const pairs: [string, string][] = [[keyName(session.id), newNome]];
    if (newPhoto) pairs.push([keyPhoto(session.id), newPhoto]);
    else await AsyncStorage.removeItem(keyPhoto(session.id));
    await AsyncStorage.multiSet(pairs);
    setNome(newNome);
    setPhoto(newPhoto);
  }, [session?.id]);

  return { nome, setNome, photo, setPhoto, saveProfile };
}
