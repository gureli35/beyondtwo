import CryptoJS from 'crypto-js';

// Ana şifreleme anahtarı - bu değer production'da environment variable olmalı
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'beyond2c-default-encryption-key-2025';

/**
 * Metni şifreler
 * @param text Şifrelenecek metin
 * @returns Şifrelenmiş metin
 */
export function encrypt(text: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Şifreleme hatası');
  }
}

/**
 * Şifrelenmiş metni çözer
 * @param encryptedText Şifrelenmiş metin
 * @returns Çözümlenmiş metin
 */
export function decrypt(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Çözümleme başarısız');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Çözümleme hatası');
  }
}

/**
 * Environment variable'ı güvenli bir şekilde alır
 * @param key Environment variable anahtarı
 * @param isEncrypted Değer şifrelenmiş mi?
 * @returns Çözümlenmiş değer
 */
export function getSecureEnvVar(key: string, isEncrypted: boolean = true): string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(`Environment variable ${key} bulunamadı`);
  }
  
  if (isEncrypted) {
    return decrypt(value);
  }
  
  return value;
}
