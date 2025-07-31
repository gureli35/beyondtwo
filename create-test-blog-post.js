const mongoose = require('mongoose');

// Post schema (simplified)
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: String,
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  category: { type: String, default: 'genel' },
  featured: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

async function createTestBlogPost() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beyond2c');
    console.log('Connected to MongoDB');

    // Create a test blog post
    const testPost = new Post({
      title: 'İklim Değişikliği ve Gençlik: Geleceğimiz İçin Harekete Geçme Zamanı',
      slug: 'iklim-degisikligi-ve-genclik-gelecegimiz-icin-harekete-gecme-zamani',
      content: `
# İklim Değişikliği ve Gençlik: Geleceğimiz İçin Harekete Geçme Zamanı

İklim değişikliği, günümüzün en acil sorunlarından biri haline geldi. Özellikle genç nesil olarak, bu küresel krize karşı sesimizi yükseltmeli ve harekete geçmeliyiz.

## Gençlerin İklim Hareketindeki Rolü

Greta Thunberg'den başlayarak, dünya çapında milyonlarca genç iklim adaleti için mücadele ediyor. Bu hareket sadece çevre koruma değil, aynı zamanda sosyal adalet ve gelecek nesillerin hakları için de önemlidir.

## Neler Yapabiliriz?

1. **Bireysel Eylemler**: Günlük yaşamımızda sürdürülebilir tercihler yapabiliriz
2. **Toplumsal Farkındalık**: Sosyal medya ve çevremizde farkındalık yaratabiliriiz
3. **Politik Katılım**: Yerel ve ulusal politikalarda sesimizi duyurabiliriz
4. **Eğitim ve Araştırma**: İklim bilimi hakkında kendimizi eğitebiliriz

## Sonuç

İklim krizi sadece gelecek nesillerin sorunu değil, bugünün gerçekliğidir. Harekete geçme zamanı şimdi!
      `,
      excerpt: 'İklim değişikliği karşısında gençlerin rolü ve alabileceği önlemler üzerine kapsamlı bir inceleme.',
      status: 'published',
      category: 'iklim-politikasi',
      featured: true,
      tags: ['iklim', 'gençlik', 'aktivizm', 'sürdürülebilirlik'],
      publishedAt: new Date(),
      userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Dummy user ID
    });

    await testPost.save();
    console.log('✅ Test blog post created successfully!');
    console.log(`📝 Title: ${testPost.title}`);
    console.log(`🔗 Slug: ${testPost.slug}`);
    console.log(`📊 Status: ${testPost.status}`);
    console.log(`🏷️ Tags: ${testPost.tags.join(', ')}`);

  } catch (error) {
    if (error.code === 11000) {
      console.log('ℹ️ Test blog post already exists, skipping creation...');
    } else {
      console.error('❌ Error creating test blog post:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestBlogPost();
