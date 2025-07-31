# 🚀 Beyond2C RSS News Deployment Guide

Bu paket ile Real RSS News Feed'li Beyond2C platformunu cPanel'a deploy edebilirsiniz.

## 📦 Paket İçeriği

✅ **Real RSS News API** - 8 farklı climate RSS feed'den gerçek haberler
✅ **Contact Form** - Notion API entegrasyonu
✅ **Node.js Server** - API route'ları aktif
✅ **cPanel Uyumlu** - Düzgün server.js yapılandırması

## 🔧 Deployment Adımları

### 1. cPanel Node.js App Oluşturma

1. cPanel → **Node.js Selector**
2. **Create Application** tıklayın
3. Ayarları yapın:
   - **Node.js Version**: 18.x veya daha üstü
   - **Application Mode**: Production
   - **Application Root**: `beyond2c-platform`
   - **Application URL**: istediğiniz subdomain/path
   - **Application Startup File**: `server.js`

### 2. Dosyaları Upload

1. ZIP dosyasını domain root'a upload edin
2. cPanel File Manager'da extract edin
3. Dosyaları `beyond2c-platform` klasörüne taşıyın

### 3. Dependencies Install

```bash
cd beyond2c-platform
npm install
```

### 4. Environment Variables

cPanel Node.js App'te şu variables ekleyin:

```bash
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

### 5. Application Start

cPanel Node.js App panelinde **Start** butonuna basın.

## 🌍 RSS News Sources

Platform şu RSS feed'lerden gerçek haberler çeker:

1. **Yale Climate Connections** - Climate science news
2. **Climate Generation** - Climate education 
3. **Greenpeace Australia** - Environmental activism
4. **Climate Change Dispatch** - Policy updates
5. **Climate Policy Initiative** - Research & analysis
6. **ICE Blog** - Arctic & climate data
7. **Hothouse** - Climate journalism
8. **Columbia Climate Law** - Legal developments

## 🧪 Test

Deployment sonrası test edin:

1. Ana sayfa: `https://yourdomain.com/`
2. News sayfası: `https://yourdomain.com/news/`
3. RSS API: `https://yourdomain.com/api/news?limit=3`
4. Contact form: `https://yourdomain.com/contact/`

## 🔍 Debug

### Log Kontrol

```bash
tail -f logs/beyond2c-platform_error.log
tail -f logs/beyond2c-platform_out.log
```

### Common Issues

**RSS Feed Timeout:**
- Normal, bazı feed'ler yavaş olabilir
- Fallback mock data otomatik devreye girer

**403 Forbidden Error:**
- `.htaccess` dosyası dahil edildi
- File permissions 644 olmalı

**Module Not Found:**
- `npm install` komutunu çalıştırın
- Node.js version uyumluluğunu kontrol edin

## ✨ Yeni Özellikler

### ✅ Real RSS News
- Mock data kaldırıldı
- 100+ gerçek climate haberi
- Otomatik sayfalama
- Kategori filtreleme

### ✅ API Route'lar Aktif
- `/api/news` - RSS feed endpoint
- `/api/contact-notion` - Contact form
- Tüm API'lar çalışır durumda

### ✅ cPanel Optimized
- `server.js` düzgün yapılandırıldı
- `.htaccess` Apache config
- Production build optimized

## 📞 Support

Sorun yaşarsanız:
1. Error log'ları kontrol edin
2. API endpoint'leri test edin  
3. DNS ayarlarını doğrulayın

**Success! 🎉 Real RSS news artık Beyond2C'de aktif!**
