import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { AuthenticatedRequest, requireAdminAuth } from '@/utils/auth';
import { APIResponse } from '@/types/database';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any>>
) {
  // Sadece admin yetkisi olan kullanıcılar erişebilir
  return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await connectDB();

    if (req.method === 'GET') {
      try {
        // İstatistikler
        const totalPosts = await Post.countDocuments();
        const publishedPosts = await Post.countDocuments({ status: 'published' });
        const draftPosts = await Post.countDocuments({ status: 'draft' });
        const archivedPosts = await Post.countDocuments({ status: 'archived' });
        const featuredPosts = await Post.countDocuments({ featured: true });
        
        // Toplam görüntülenme
        const viewsData = await Post.aggregate([
          { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);
        const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;
        
        // Kategori istatistikleri
        const categoriesData = await Post.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);
        
        // Son 7 günde yazılan postlar
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        const recentPostsCount = await Post.countDocuments({ 
          createdAt: { $gte: lastWeekDate } 
        });

        return res.status(200).json({
          success: true,
          data: {
            totalPosts,
            publishedPosts,
            draftPosts,
            archivedPosts,
            featuredPosts,
            totalViews,
            categoriesData,
            recentPostsCount
          }
        });

      } catch (error: any) {
        console.error('Blog stats error:', error);
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
  })(req, res);
}
