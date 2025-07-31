# Beyond2C - cPanel Hosting Kurulum Kılavuzu

## 📦 Paket İçeriği
Bu `beyond2c-resend-nodejs.zip` dosyası, Resend API ile email gönderimi ve RSS news feed'i destekleyen tam işlevsel Beyond2C web sitesini içerir.

## 🚀 cPanel Kurulum Adımları

### 1. Node.js Hosting Gereksinimi
Bu site **Node.js hosting** gerektirir çünkü:
- ✅ Contact form Resend API kullanıyor
- ✅ News sayfası RSS feed'lerini server-side fetch ediyor
- ✅ Dynamic API routes çalışıyor

### 2. cPanel'de Kurulum

#### A. Dosya Yükleme
1. cPanel File Manager'a giriş yapın
2. `public_html` klasörüne gidin
3. `beyond2c-resend-nodejs.zip` dosyasını yükleyin
4. Zip dosyasını extract edin

#### B. Node.js Kurulumu (cPanel'de)
1. cPanel'de "Node.js" bölümüne gidin
2. "Create Application" tıklayın
3. Ayarlar:
   - **Node.js version**: 18.x veya üzeri
   - **Application mode**: Production
   - **Application root**: `/public_html` (veya sitenizin ana dizini)
   - **Application URL**: Ana domain adresiniz
   - **Application startup file**: `server.js` (otomatik oluşturulacak)

#### C. Package Kurulumu
1. Node.js application terminal'ini açın
2. Şu komutu çalıştırın:
```bash
npm install
```

### 3. Environment Variables (.env.local)
Paket ile birlikte gelen `.env.local` dosyası şu bilgileri içerir:
- ✅ Resend API Key (şifrelenmiş)
- ✅ Email recipient (beyond2c@europe.com)
- ✅ Encryption keys
- ✅ Site URL settings

**Önemli**: Production'da `NEXT_PUBLIC_SITE_URL` değerini kendi domain'inizle güncelleyin.

### 4. Başlatma
Node.js application kurulumu tamamlandıktan sonra:
1. "Restart" butonuna tıklayın
2. Site otomatik olarak çalışmaya başlayacak

## 🔧 Test Edilmesi Gerekenler

### Contact Form
- ✅ Form submission çalışıyor
- ✅ Resend API ile beyond2c@europe.com'a email gönderimi
- ✅ Form validation aktif
- ✅ Success/error mesajları

### News Sayfası
- ✅ Multiple RSS feed sources
- ✅ Real-time news fetching
- ✅ Pagination çalışıyor
- ✅ Category filtering

### Diğer Özellikler
- ✅ Responsive design
- ✅ Multi-language support (TR/EN)
- ✅ SEO optimized
- ✅ Fast loading

## 🛠️ Sorun Giderme

### Contact Form Çalışmıyorsa
1. Node.js application'ın çalıştığından emin olun
2. Browser console'da error kontrol edin
3. `/api/contact-notion` endpoint'ine direct erişim test edin

### News Sayfası Yüklemiyorsa
1. Server'ın external API'lere erişimi olduğundan emin olun
2. `/api/news` endpoint'ini test edin
3. RSS feed URL'lerinin erişilebilir olduğunu kontrol edin

### Performance
- First load: ~118KB (optimized)
- API routes: Server-side cached
- Images: Optimized ve lazy loaded

## 📞 Destek
Herhangi bir sorun yaşarsanız:
- Console error'ları kontrol edin
- cPanel error logs'ları inceleyin
- Node.js application status'unu kontrol edin

## 🎉 Başarılı Kurulum
Site başarıyla çalıştığında:
- Ana sayfa yüklenecek
- Contact form email gönderecek
- News sayfası güncel haberleri gösterecek
- Tüm sayfalar responsive olacak

---
**Beyond2C Team - 2025**
