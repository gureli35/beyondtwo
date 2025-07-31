import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { AuthenticatedRequest, requireBlogAuth } from '@/utils/auth';
import { APIResponse, PaginatedResponse, IPost, CreatePostData, UpdatePostData } from '@/types/database';
import { updateSitemapAfterContentChange } from '@/utils/sitemap';

// Slug oluştur
const createSlug = (title: string): string => {
  return title
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
};

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any> | PaginatedResponse<IPost>>
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        featured,
        search,
        sort = 'createdAt',
        order = 'desc'
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Filter oluştur
      const filter: any = {};

      // Rol bazında filtreleme - Admin haricindekiler sadece kendi yazılarını görebilir
      if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
        filter.userId = req.user.userId;
      }

      if (status) filter.status = status;
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.featured = true;

      // Arama
      if (search) {
        filter.$text = { $search: search as string };
      }

      // Sıralama
      const sortOption: any = {};
      sortOption[sort as string] = order === 'desc' ? -1 : 1;

      const posts = await Post.find(filter)
        .populate('userId', 'username profilePicture firstName lastName')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await Post.countDocuments(filter);
      const pages = Math.ceil(total / limitNum);

      return res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
          hasNext: pageNum < pages,
          hasPrev: pageNum > 1
        }
      });

    } catch (error: any) {
      console.error('Admin Posts GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }
  } else if (req.method === 'POST') {
    // Yeni post oluştur - Admin yetkisi gerekli
    try {
      const postData: CreatePostData = req.body;

      console.log('Received post data:', postData);

      if (!postData.title || !postData.content) {
        return res.status(400).json({
          success: false,
          error: 'Başlık ve içerik gerekli'
        });
      }

      // Veriyi temizle
      const cleanData = {
        title: String(postData.title || '').trim(),
        content: String(postData.content || '').trim(),
        excerpt: String(postData.excerpt || '').trim(),
        category: String(postData.category || 'genel').trim(),
        status: ['draft', 'published', 'archived'].includes(postData.status || '') ? postData.status : 'draft',
        featured: Boolean(postData.featured),
        featuredImage: String(postData.featuredImage || '').trim(),
        metaTitle: String(postData.metaTitle || '').trim(),
        metaDescription: String(postData.metaDescription || '').trim(),
        tags: postData.tags || []
      };

      // Slug oluştur
      let slug = createSlug(cleanData.title);
      
      // Slug'ın benzersiz olduğundan emin ol
      let slugExists = await Post.findOne({ slug });
      let counter = 1;
      while (slugExists) {
        slug = `${createSlug(cleanData.title)}-${counter}`;
        slugExists = await Post.findOne({ slug });
        counter++;
      }

      // Tags'i işle
      let tags: string[] = [];
      if (cleanData.tags) {
        if (Array.isArray(cleanData.tags)) {
          tags = cleanData.tags.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
        } else if (typeof cleanData.tags === 'string') {
          tags = cleanData.tags.split(',').map((tag: string) => tag.trim()).filter(tag => tag.length > 0);
        }
      }

      // Yeni post oluştur
      const newPost = new Post({
        title: cleanData.title,
        slug,
        content: cleanData.content,
        excerpt: cleanData.excerpt || cleanData.content.substring(0, 200) + '...',
        userId: req.user?.userId, // author yerine userId kullan
        category: cleanData.category,
        tags,
        status: cleanData.status,
        featured: cleanData.featured,
        featuredImage: cleanData.featuredImage,
        metaTitle: cleanData.metaTitle,
        metaDescription: cleanData.metaDescription,
        publishedAt: cleanData.status === 'published' ? new Date() : null
      });

      const savedPost = await newPost.save();

      // Author bilgilerini populate et
      const populatedPost = await Post.findById(savedPost._id)
        .populate('userId', 'username firstName lastName profilePicture')
        .lean();

      // Sitemap'i güncelle (published durumundaysa)
      if (cleanData.status === 'published') {
        updateSitemapAfterContentChange({
          action: 'create',
          type: 'blog',
          slug: savedPost.slug
        }).catch(err => console.error('Sitemap update failed:', err));
      }

      return res.status(201).json({
        success: true,
        data: populatedPost,
        message: 'Blog yazısı başarıyla oluşturuldu'
      });

    } catch (error: any) {
      console.error('Admin Post create error details:', {
        message: error.message,
        stack: error.stack,
        postData: req.body
      });
      
      // JSON syntax hatası kontrol et
      if (error.message && error.message.includes('string did not match')) {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz veri formatı. Lütfen tüm alanları kontrol edin.'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası: ' + error.message
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default requireBlogAuth(handler);
