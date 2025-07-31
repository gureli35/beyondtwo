# 📝 Beyond2C - Notion Contact Form Entegrasyonu

## 🎯 Amaç
Contact formundan gelen mesajları otomatik olarak Notion veritabanına kaydeder. Bu sayede admin paneli kullanmadan mesajları Notion'da takip edebilirsiniz.

## 🚀 Kurulum Adımları

### 1. Notion Integration Oluşturma

1. [Notion Developers](https://developers.notion.com/) sitesine gidin
2. "New integration" butonuna tıklayın
3. Integration bilgilerini doldurun:
   - **Name**: Beyond2C Contact Form
   - **Logo**: 2Clogo.png'yi yükleyin
   - **Associated workspace**: Workspace'inizi seçin
   - **Type**: Internal integration

4. "Submit" tıklayın
5. **Integration Token'ı kopyalayın** (secret_ ile başlar)

### 2. Notion Database Oluşturma

1. Notion'da yeni bir sayfa oluşturun: "Beyond2C - Contact Messages"
2. `/table` yazarak veritabanı oluşturun
3. Aşağıdaki kolonları ekleyin:

| Kolon Adı | Tip | Açıklama |
|-----------|-----|----------|
| İsim | Title | Gönderenin adı soyadı |
| Email | Email | Email adresi |
| Konu | Select | Mesaj konusu |
| Mesaj | Text | Mesaj içeriği |
| Telefon | Phone | Telefon numarası (opsiyonel) |
| Organizasyon | Text | Organizasyon/Şirket (opsiyonel) |
| Tarih | Date | Mesajın gönderilme tarihi |
| Durum | Select | Mesaj durumu |

### 3. Select Değerlerini Ayarlama

**Konu seçenekleri:**
- İş Birliği
- Proje Önerisi
- Medya & Basın
- Gönüllülük
- Geri Bildirim
- Diğer

**Durum seçenekleri:**
- 🆕 Yeni
- 👀 Okundu
- 📝 Yanıtlandı
- ✅ Tamamlandı
- ❌ Spam

### 4. Database ID'yi Alma

1. Notion veritabanınızı açın
2. URL'den Database ID'yi kopyalayın:
   ```
   https://notion.so/DATABASE_ID?v=...
   ```
3. Database ID'yi not edin (32 karakter uzunluğunda)

### 5. Integration Permission Verme

1. Veritabanı sayfasında sağ üst köşedeki "..." menüsüne tıklayın
2. "Add connections" seçin
3. "Beyond2C Contact Form" integration'ını seçin
4. "Confirm" tıklayın

### 6. Environment Variables Ayarlama

`.env.local` dosyasına ekleyin:
```bash
# Notion Integration
NOTION_API_KEY=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Production'da (Cloudflare Pages) da aynı değerleri ekleyin:**
- Settings > Environment Variables
- Production ve Preview environment'lara ekleyin

## 🧪 Test Etme

### Local Test:
1. `npm run dev` ile siteyi başlatın
2. Contact formunu doldurup gönderin
3. Notion veritabanını kontrol edin

### API Test:
```bash
curl -X POST http://localhost:3000/api/contact-notion \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@example.com", 
  "subject": "Geri Bildirim",
  "message": "Bu bir test mesajıdır."
}'
```

## 🔧 Notion Template

Hazır template kullanmak isterseniz: [Beyond2C Contact Template](notion-template-link)

## 📊 Notion Dashboard Önerileri

### 1. Mesaj Takip Dashboard'u:
- **Yeni Mesajlar**: Durum = "Yeni" olan kayıtlar
- **Bu Hafta**: Tarih son 7 gün içinde
- **Konu Bazında**: Konu türüne göre gruplama
- **Yanıt Bekleyenler**: Durum = "Okundu" olan eski mesajlar

### 2. Otomatik Filtreler:
```
Yeni Mesajlar: Durum = "🆕 Yeni"
Acil: Konu = "Medya & Basın" OR "İş Birliği"
Bu Ay: Tarih >= Bu ayın ilk günü
```

### 3. Görünümler:
- **Tablo**: Tüm detaylarla
- **Kanban**: Duruma göre kartlar
- **Takvim**: Tarihe göre görünüm
- **Liste**: Özet görünüm

## 🚨 Troubleshooting

### "database_id not found" hatası:
- Database ID'nin doğru olduğunu kontrol edin
- Integration'ın veritabanına erişim iznini kontrol edin

### "unauthorized" hatası:
- NOTION_API_KEY'in doğru olduğunu kontrol edin
- Integration token'ın geçerli olduğunu kontrol edin

### Mesaj gelmiyorsa:
- Network konsolu hatalarını kontrol edin
- API endpoint'inin çalıştığını test edin
- Environment variables'ların doğru set edildiğini kontrol edin

## 📈 Analytics ve Monitoring

### Notion Formula Örnekleri:

**Yanıt Süresi Hesaplama:**
```
dateBetween(prop("Yanıtlandı"), prop("Tarih"), "days")
```

**Aylık Mesaj Sayısı:**
```
if(formatDate(prop("Tarih"), "MM/YYYY") == formatDate(now(), "MM/YYYY"), 1, 0)
```

**Yanıt Oranı:**
```
if(prop("Durum") == "✅ Tamamlandı", "✅", "⏳")
```

## 🔄 Workflow Önerileri

### 1. Günlük Rutinler:
- ☀️ Sabah: Yeni mesajları kontrol et
- 📧 Öğle: Acil mesajları yanıtla
- 📊 Akşam: Haftalık istatistikleri incele

### 2. Otomatik Notification:
- Notion'da reminder'lar kurun
- Slack/Discord entegrasyonu ekleyin
- Email notification'ları aktif edin

### 3. Response Templates:
- Teşekkür mesajı template'i
- FAQ yönlendirme template'i
- İş birliği teklifi template'i

## 🎉 Sonuç

Bu entegrasyonla:
✅ Mesajlar otomatik Notion'a kaydolur
✅ Admin panel gereksiz hale gelir
✅ Takım arkadaşlarıyla kolay paylaşım
✅ İstatistik ve analiz imkanı
✅ Mobil Notion app ile her yerden erişim

**🚀 Artık Cloudflare'e deploy etmeye hazırsınız!**
