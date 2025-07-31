import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { AuthenticatedRequest, requireAuth, requireAdminAuth } from '@/utils/auth';
import { APIResponse, PaginatedResponse, IPost, CreatePostData, UpdatePostData, PostFilters } from '@/types/database';

// Slug oluştur
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default async function handler(
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
        userId,
        tags,
        search,
        dateFrom,
        dateTo
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Filter oluştur
      const filter: any = {};

      if (status) filter.status = status;
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.featured = true;
      if (userId) filter.userId = userId;
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        filter.tags = { $in: tagArray };
      }

      // Tarih filtresi
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
      }

      // Arama
      if (search) {
        filter.$text = { $search: search as string };
      }

      // Admin değilse sadece published postları göster
      if (!req.user?.isAdmin) {
        filter.status = 'published';
      }

      const posts = await Post.find(filter)
        .populate('author', 'username profilePicture firstName lastName')
        .sort({ createdAt: -1 })
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
      console.error('Posts GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

  } else if (req.method === 'POST') {
    // Yeni post oluştur - Auth gerekli
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const postData: CreatePostData = req.body;

        if (!postData.title || !postData.content) {
          return res.status(400).json({
            success: false,
            error: 'Başlık ve içerik gerekli'
          });
        }

        // Slug oluştur
        let slug = postData.slug || createSlug(postData.title);
        
        // Slug benzersizliğini kontrol et
        const existingPost = await Post.findOne({ slug });
        if (existingPost) {
          slug = `${slug}-${Date.now()}`;
        }

        const newPost = new Post({
          ...postData,
          slug,
          userId: req.user!.userId,
          tags: postData.tags || []
        });

        await newPost.save();
        
        const populatedPost = await Post.findById(newPost._id)
          .populate('author', 'username profilePicture firstName lastName');

        return res.status(201).json({
          success: true,
          data: populatedPost,
          message: 'Post başarıyla oluşturuldu'
        });

      } catch (error: any) {
        console.error('Post create error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'PUT') {
    // Post güncelle - Auth gerekli
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const updateData: UpdatePostData = req.body;

        if (!updateData._id) {
          return res.status(400).json({
            success: false,
            error: 'Post ID gerekli'
          });
        }

        const existingPost = await Post.findById(updateData._id);
        if (!existingPost) {
          return res.status(404).json({
            success: false,
            error: 'Post bulunamadı'
          });
        }

        // Yetki kontrolü - sadece post sahibi veya admin güncelleyebilir
        if (existingPost.userId.toString() !== req.user!.userId && !req.user!.isAdmin) {
          return res.status(403).json({
            success: false,
            error: 'Bu işlem için yetkiniz yok'
          });
        }

        // Slug güncellemesi
        if (updateData.title && updateData.title !== existingPost.title) {
          let newSlug = updateData.slug || createSlug(updateData.title);
          const slugExists = await Post.findOne({ 
            slug: newSlug, 
            _id: { $ne: updateData._id } 
          });
          if (slugExists) {
            newSlug = `${newSlug}-${Date.now()}`;
          }
          updateData.slug = newSlug;
        }

        const updatedPost = await Post.findByIdAndUpdate(
          updateData._id,
          updateData,
          { new: true }
        ).populate('author', 'username profilePicture firstName lastName');

        return res.status(200).json({
          success: true,
          data: updatedPost,
          message: 'Post başarıyla güncellendi'
        });

      } catch (error: any) {
        console.error('Post update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'DELETE') {
    // Post sil - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Post ID gerekli'
          });
        }

        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
          return res.status(404).json({
            success: false,
            error: 'Post bulunamadı'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Post başarıyla silindi'
        });

      } catch (error: any) {
        console.error('Post delete error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
