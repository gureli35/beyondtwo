import mongoose from 'mongoose';

const voiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Geçici olarak optional yapıyoruz
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
    featuredImage: {
      type: String,
      default: ''
    },
    // Voice/Story specific fields
    author: {
      name: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        min: 13,
        max: 35
      },
      location: {
        city: String,
        region: String,
        country: {
          type: String,
          default: 'Turkey'
        }
      },
      bio: String,
      image: String
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Youth',
        'Energy',
        'Transportation',
        'Education',
        'Technology',
        'Agriculture',
        'Community',
        'Policy',
        'Innovation',
        'Conservation',
        'Activism',
        'Research',
        'Other'
      ]
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed', 'published', 'rejected', 'archived'],
      default: 'submitted'
    },
    featured: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date,
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    // Story specific metadata
    storyType: {
      type: String,
      enum: ['personal', 'community', 'project', 'campaign', 'research'],
      default: 'personal'
    },
    impact: {
      description: String,
      metrics: [{
        name: String,
        value: String,
        unit: String
      }],
      beneficiaries: Number,
      timeframe: String
    },
    callToAction: {
      type: String,
      maxlength: 200
    },
    // Media attachments
    media: [{
      type: {
        type: String,
        enum: ['image', 'video', 'document'],
        default: 'image'
      },
      url: String,
      caption: String,
      alt: String
    }],
    // Contact and social
    contact: {
      email: String,
      phone: String,
      website: String,
      social: {
        instagram: String,
        twitter: String,
        linkedin: String,
        youtube: String
      }
    },
    // SEO fields
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
    // Statistics
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number,
      default: 0 // in minutes
    },
    // Review process
    reviewNotes: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    },
    // Language
    language: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    },
    // Settings
    allowComments: {
      type: Boolean,
      default: true
    },
    allowSharing: {
      type: Boolean,
      default: true
    },
    showAuthorContact: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual fields
voiceSchema.virtual('authorData', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

voiceSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'voiceId',
  count: true
});

// Indexes
voiceSchema.index({ slug: 1 });
voiceSchema.index({ status: 1 });
voiceSchema.index({ category: 1 });
voiceSchema.index({ tags: 1 });
voiceSchema.index({ publishedAt: -1 });
voiceSchema.index({ featured: 1 });
voiceSchema.index({ userId: 1 });
voiceSchema.index({ createdAt: -1 });
voiceSchema.index({ submittedAt: -1 });
voiceSchema.index({ 'author.location.city': 1 });

// Text search index
voiceSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  tags: 'text',
  'author.name': 'text',
  'author.location.city': 'text'
});

// Pre-save middleware
voiceSchema.pre('save', function(next) {
  // Auto-generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 150).trim() + '...';
  }
  
  // Calculate reading time (average 200 words/minute)
  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }
  
  // Set published date when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Auto-generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  
  next();
});

const Voice = mongoose.models.Voice || mongoose.model('Voice', voiceSchema);

export default Voice;
