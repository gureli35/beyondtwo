import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { AuthenticatedRequest, requireAuth, requireAdminAuth } from '@/utils/auth';
import { APIResponse, PaginatedResponse, IComment, CreateCommentData, UpdateCommentData } from '@/types/database';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any> | PaginatedResponse<IComment>>
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const {
        page = 1,
        limit = 10,
        postId,
        userId,
        status,
        reported,
        search,
        dateFrom,
        dateTo
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Filter oluştur
      const filter: any = {};

      if (postId) filter.postId = postId;
      if (userId) filter.userId = userId;
      if (status) filter.status = status;
      if (reported === 'true') filter.reportCount = { $gt: 0 };

      // Tarih filtresi
      if (dateFrom || dateTo) {
        filter.createdAt = {};
        if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
        if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
      }

      // Arama
      if (search) {
        filter.content = { $regex: search, $options: 'i' };
      }

      // Admin değilse sadece approved yorumları göster
      if (!req.user?.isAdmin) {
        filter.status = 'approved';
      }

      const comments = await Comment.find(filter)
        .populate('author', 'username profilePicture firstName lastName')
        .populate('post', 'title slug')
        .populate('replies')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await Comment.countDocuments(filter);
      const pages = Math.ceil(total / limitNum);

      return res.status(200).json({
        success: true,
        data: comments,
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
      console.error('Comments GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

  } else if (req.method === 'POST') {
    // Yeni yorum oluştur - Auth gerekli
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const commentData: CreateCommentData = req.body;

        if (!commentData.content || !commentData.postId) {
          return res.status(400).json({
            success: false,
            error: 'İçerik ve post ID gerekli'
          });
        }

        // Post varlığını kontrol et
        const post = await Post.findById(commentData.postId);
        if (!post) {
          return res.status(404).json({
            success: false,
            error: 'Post bulunamadı'
          });
        }

        if (!post.allowComments) {
          return res.status(403).json({
            success: false,
            error: 'Bu post için yorumlar kapatılmış'
          });
        }

        // Parent yorum kontrolü
        if (commentData.parentId) {
          const parentComment = await Comment.findById(commentData.parentId);
          if (!parentComment || parentComment.postId.toString() !== commentData.postId) {
            return res.status(400).json({
              success: false,
              error: 'Geçersiz parent yorum'
            });
          }
        }

        const newComment = new Comment({
          ...commentData,
          userId: req.user!.userId,
          ipAddress: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '',
          userAgent: req.headers['user-agent'] || ''
        });

        await newComment.save();
        
        const populatedComment = await Comment.findById(newComment._id)
          .populate('author', 'username profilePicture firstName lastName')
          .populate('post', 'title slug');

        return res.status(201).json({
          success: true,
          data: populatedComment,
          message: 'Yorum başarıyla oluşturuldu'
        });

      } catch (error: any) {
        console.error('Comment create error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'PUT') {
    // Yorum güncelle - Auth gerekli
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const updateData: UpdateCommentData = req.body;

        if (!updateData._id) {
          return res.status(400).json({
            success: false,
            error: 'Yorum ID gerekli'
          });
        }

        const existingComment = await Comment.findById(updateData._id);
        if (!existingComment) {
          return res.status(404).json({
            success: false,
            error: 'Yorum bulunamadı'
          });
        }

        // Yetki kontrolü
        const canEdit = existingComment.userId.toString() === req.user!.userId || req.user!.isAdmin;
        
        if (!canEdit) {
          return res.status(403).json({
            success: false,
            error: 'Bu işlem için yetkiniz yok'
          });
        }

        // Admin işlemleri
        if (req.user!.isAdmin && (updateData.status || updateData.moderationNote)) {
          updateData.moderatedBy = req.user!.userId;
          updateData.moderatedAt = new Date();
        }

        // İçerik güncellemesi
        if (updateData.content && existingComment.userId.toString() === req.user!.userId) {
          updateData.edited = true;
          updateData.editedAt = new Date();
        }

        const updatedComment = await Comment.findByIdAndUpdate(
          updateData._id,
          updateData,
          { new: true }
        ).populate('author', 'username profilePicture firstName lastName')
         .populate('post', 'title slug');

        return res.status(200).json({
          success: true,
          data: updatedComment,
          message: 'Yorum başarıyla güncellendi'
        });

      } catch (error: any) {
        console.error('Comment update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'DELETE') {
    // Yorum sil - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Yorum ID gerekli'
          });
        }

        // Alt yorumları da sil
        await Comment.deleteMany({ parentId: id });
        
        const deletedComment = await Comment.findByIdAndDelete(id);
        if (!deletedComment) {
          return res.status(404).json({
            success: false,
            error: 'Yorum bulunamadı'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Yorum başarıyla silindi'
        });

      } catch (error: any) {
        console.error('Comment delete error:', error);
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
