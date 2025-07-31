# 🚀 Beyond2C Hosting Rehberi

## 📋 Gereksinimler
- GitHub hesabı
- MongoDB Atlas hesabı (ücretsiz)
- Hosting platformu hesabı (Vercel önerilen)

## 🌟 1. MongoDB Atlas Kurulumu

### Adım 1: Hesap Oluşturma
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) gidip ücretsiz hesap açın
2. Yeni cluster oluşturun (M0 - ücretsiz)
3. Database user oluşturun (username/password)
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'ler için)

### Adım 2: Connection String
```
mongodb+srv://username:password@cluster0.mongodb.net/beyond2c?retryWrites=true&w=majority
```

## 🚀 2. Vercel'e Deploy

### Adım 1: GitHub'a Push
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### Adım 2: Vercel Bağlantısı
1. [Vercel.com](https://vercel.com) hesap açın
2. "Import Git Repository" tıklayın
3. GitHub repo'nuzu seçin
4. Framework: Next.js
5. Build Command: `npm run build`
6. Output Directory: `.next`

### Adım 3: Environment Variables
Vercel dashboard'ta Settings > Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/beyond2c
NEXTAUTH_SECRET=super-gizli-anahtar-buraya-yazin
NEXTAUTH_URL=https://beyond2c.vercel.app
```

## 🔧 3. Production Build Test

### Local'de test:
```bash
npm run build
npm start
```

### Admin panel test:
- `https://siteniz.vercel.app/admin` adresine gidin
- İlk admin kullanıcısını oluşturun

## 🎯 4. Domain Bağlama (İsteğe Bağlı)

### Vercel'de:
1. Settings > Domains
2. Custom domain ekleyin: `beyond2c.org`
3. DNS ayarlarını güncelleyin

### Cloudflare (Önerilen):
1. Domain'i Cloudflare'e transfer edin
2. SSL/TLS ayarlarını yapın
3. Caching rules ekleyin

## 📊 5. Monitoring ve Analytics

### Google Analytics:
Environment variables'a ekleyin:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Google Search Console:
1. Site'inizi ekleyin
2. Sitemap URL: `https://siteniz.vercel.app/api/sitemap.xml`

## 🔒 6. Güvenlik

### Environment Variables:
```bash
# Güçlü şifreler kullanın
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
```

### Rate Limiting:
- Vercel otomatik edge functions rate limiting sağlar
- MongoDB Atlas'ta IP whitelist kullanın

## 🚨 7. Troubleshooting

### Build Hatası:
```bash
# Dependency sorunları
npm install
npm run build

# Type errors
npm run type-check
```

### Database Connection:
```bash
# MongoDB Atlas IP whitelist kontrolü
# Connection string format kontrolü
# Username/password kontrolü
```

### 404 Errors:
```bash
# Next.js routing
# Public folder dosyaları
# API routes
```

## 📞 8. Destek

### Vercel Issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### MongoDB Issues:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🎉 9. Go Live Checklist

- [ ] MongoDB Atlas cluster aktif
- [ ] Environment variables set
- [ ] Build successful
- [ ] Admin panel accessible
- [ ] All pages loading
- [ ] API endpoints working
- [ ] SSL certificate active
- [ ] Google Analytics tracking
- [ ] Search Console verified
- [ ] Sitemap accessible

## 💡 Pro Tips

1. **Staging Environment**: Ayrı bir Vercel project ile test ortamı oluşturun
2. **Backups**: MongoDB Atlas otomatik backup yapar
3. **Monitoring**: Vercel Analytics kullanın
4. **Performance**: Vercel Edge Functions kullanın
5. **CDN**: Cloudflare ile global CDN aktif edin

---

**Not**: Bu rehber Beyond2C projesini production'a almak için gerekli tüm adımları içerir. Herhangi bir sorun olursa dokümantasyonu takip edin.
