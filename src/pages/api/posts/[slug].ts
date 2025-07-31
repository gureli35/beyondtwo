import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { AuthenticatedRequest } from '@/utils/auth';
import { APIResponse, IPost } from '@/types/database';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<IPost>>
) {
  await connectDB();

  const { slug: slugFromQuery } = req.query;
  const slug = Array.isArray(slugFromQuery) ? slugFromQuery[0] : slugFromQuery;


  if (!slug) {
    return res.status(400).json({
      success: false,
      error: 'Slug gerekli'
    });
  }

  if (req.method === 'GET') {
    try {
      const post = await Post.findOne({ slug: slug })
        .populate('author', 'username profilePicture firstName lastName')
        .lean();

      if (!post) {
        return res.status(404).json({
          success: false,
          error: 'Post bulunamadı'
        });
      }

      // Admin değilse sadece published postları göster
      if ((post as any).status !== 'published' && !req.user?.isAdmin) {
        return res.status(404).json({
          success: false,
          error: 'Post bulunamadı'
        });
      }

      // Görüntülenme sayısını artır
      await Post.findByIdAndUpdate((post as any)._id, { $inc: { views: 1 } });

      // Yorum sayısını al
      const commentCount = await Comment.countDocuments({ 
        postId: (post as any)._id, 
        status: 'approved' 
      });

      const postWithStats = {
        ...post,
        commentCount
      };

      return res.status(200).json({
        success: true,
        data: postWithStats as any
      });

    } catch (error: any) {
      console.error('Post GET error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
