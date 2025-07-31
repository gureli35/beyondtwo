#!/usr/bin/env node

const CryptoJS = require('crypto-js');

// Şifreleme anahtarı
const ENCRYPTION_KEY = 'beyond2c-default-encryption-key-2025';

/**
 * Metni şifreler
 */
function encrypt(text) {
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
 */
function decrypt(encryptedText) {
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

// CLI kullanımı
const args = process.argv.slice(2);
const command = args[0];
const text = args[1];

if (!command || !text) {
  console.log('Kullanım:');
  console.log('  node encrypt-tool.js encrypt "şifrelenecek metin"');
  console.log('  node encrypt-tool.js decrypt "şifrelenmiş metin"');
  process.exit(1);
}

try {
  if (command === 'encrypt') {
    const encrypted = encrypt(text);
    console.log('Şifrelenmiş metin:');
    console.log(encrypted);
  } else if (command === 'decrypt') {
    const decrypted = decrypt(text);
    console.log('Çözümlenmiş metin:');
    console.log(decrypted);
  } else {
    console.log('Geçersiz komut. "encrypt" veya "decrypt" kullanın.');
    process.exit(1);
  }
} catch (error) {
  console.error('Hata:', error.message);
  process.exit(1);
}
