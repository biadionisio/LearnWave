import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_NAME = '@profile_name';
const KEY_PHOTO = '@profile_photo';

export function useProfile() {
  const [nome, setNome] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.multiGet([KEY_NAME, KEY_PHOTO]).then((pairs) => {
      if (pairs[0][1]) setNome(pairs[0][1]);
      if (pairs[1][1]) setPhoto(pairs[1][1]);
    });
  }, []);

  const saveProfile = useCallback(async (newNome: string, newPhoto: string | null) => {
    const pairs: [string, string][] = [[KEY_NAME, newNome]];
    if (newPhoto) pairs.push([KEY_PHOTO, newPhoto]);
    else await AsyncStorage.removeItem(KEY_PHOTO);
    await AsyncStorage.multiSet(pairs);
    setNome(newNome);
    setPhoto(newPhoto);
  }, []);

  return { nome, setNome, photo, setPhoto, saveProfile };
}
