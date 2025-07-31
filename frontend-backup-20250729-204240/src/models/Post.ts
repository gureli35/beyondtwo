import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      default: '',
      maxlength: 300
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    featuredImage: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'uncategorized',
      enum: [
        'İklim Değişikliği',
        'Sürdürülebilirlik', 
        'Çevre Teknolojileri',
        'Yenilenebilir Enerji',
        'Çevre Koruma',
        'Aktivizm',
        'Eğitim',
        'Araştırma',
        'Politika',
        'İnovasyon',
        'uncategorized'
      ]
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    featured: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },
    // SEO alanları
    metaTitle: {
      type: String,
      maxlength: 60,
      default: ''
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      default: ''
    },
    metaKeywords: {
      type: [String],
      default: []
    },
    // İstatistikler
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number,
      default: 0 // dakika cinsinden
    },
    // Yorum ayarları
    allowComments: {
      type: Boolean,
      default: true
    },
    // İçerik türü
    contentType: {
      type: String,
      enum: ['article', 'news', 'case-study', 'tutorial', 'opinion'],
      default: 'article'
    },
    // Dil
    language: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    },
    // SEO ve sosyal medya
    ogImage: {
      type: String,
      default: ''
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image'
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields
postSchema.virtual('author', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  count: true
});

// Index'ler
postSchema.index({ slug: 1 });
postSchema.index({ status: 1 });
postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ featured: 1 });
postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });

// Text search index
postSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  tags: 'text'
});

// Pre-save middleware
postSchema.pre('save', function(next) {
  // Auto-generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    // HTML taglerini temizle ve ilk 150 karakteri al
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150).trim() + '...';
  }
  
  // Reading time hesapla (ortalama 200 kelime/dakika)
  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }
  
  // Published date set et
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
