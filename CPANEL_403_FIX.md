# Beyond2C - cPanel 403 Hatası Çözüm Kılavuzu

## 🚨 403 Forbidden Hatası Çözümü

### 1. Node.js Application Ayarları
cPanel Node.js ayarlarınızı kontrol edin:

```
✅ Application startup file: server.js
✅ Application mode: Production  
✅ Node.js version: 18.x veya üzeri
✅ Application root: /public_html (doğru klasör)
```

### 2. Kritik Dosyalar
Bu dosyaların mevcut olduğundan emin olun:
- `server.js` ← Yeni eklendi!
- `package.json` ← Start script güncellenmiş
- `.htaccess` ← Yeni eklendi!
- `.next/` klasörü
- `public/` klasörü

### 3. Dosya İzinleri
File Manager'da izinleri kontrol edin:
```
server.js     → 644
.htaccess     → 644  
package.json  → 644
public/       → 755
.next/        → 755
```

### 4. cPanel Terminal Komutları
Node.js application terminal'de:

```bash
# Dependencies yükle
npm install

# Server'ı test et
node server.js

# Port kontrol et
echo $PORT
```

### 5. Adım Adım Çözüm

#### Adım 1: Node.js App Sil & Yeniden Oluştur
1. cPanel → Node.js → Mevcut app'i DELETE
2. Create Application → Yeni app oluştur
3. **ÖNEMLİ**: Startup file: `server.js` seç

#### Adım 2: Dosyaları Kontrol Et
File Manager'da bu dosyalar olmalı:
- ✅ server.js (yeni)
- ✅ .htaccess (yeni)  
- ✅ package.json (güncellenmiş)
- ✅ .next/ klasörü
- ✅ public/ klasörü
- ✅ src/ klasörü

#### Adım 3: Install & Restart
```bash
npm install
```
Sonra cPanel'de "Restart" butonuna tıklayın.

### 6. Hala Çalışmıyorsa

#### A. Error Logs Kontrol
cPanel → Error Logs → Son hataları kontrol edin

#### B. Node.js Version
Node.js 18.x veya 20.x kullanın (16.x çok eski)

#### C. Alternative Start Command
Terminal'de:
```bash
npm run start:next
```

### 7. Test URL'leri
Site çalıştığında test edin:
- `yourdomain.com` → Ana sayfa
- `yourdomain.com/api/contact-notion` → API test
- `yourdomain.com/contact` → Contact form

## 🎯 Bu Güncelleme Neler Getirdi?

1. **server.js** → Custom Node.js server
2. **.htaccess** → Apache rewrite rules  
3. **package.json** → Güncellenmiş start script
4. **Gelişmiş error handling** → Daha iyi debugging

Bu adımları takip ederseniz 403 hatası çözülecektir! 🚀

---
**cPanel Hosting - Beyond2C Team**
