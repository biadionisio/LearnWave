import CryptoJS from 'crypto-js';

// Chave derivada do par de IDs — simétrica, determinística
function chatKey(idA: string | number, idB: string | number): string {
  const pair = [String(idA), String(idB)].sort().join(':');
  return CryptoJS.SHA256(pair).toString();
}

export function encrypt(text: string, idA: string | number, idB: string | number): string {
  return CryptoJS.AES.encrypt(text, chatKey(idA, idB)).toString();
}

export function decrypt(cipher: string, idA: string | number, idB: string | number): string {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, chatKey(idA, idB));
    return bytes.toString(CryptoJS.enc.Utf8) || cipher;
  } catch {
    return cipher; // fallback: retorna o texto como está (mensagens antigas não criptografadas)
  }
}
