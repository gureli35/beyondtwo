import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import Comment from '@/models/Comment';
import { AuthenticatedRequest, requireAdminAuth } from '@/utils/auth';
import { APIResponse, DashboardStats, TimeSeriesData, ChartData } from '@/types/database';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Admin gerekli
  return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      await connectDB();

      const { type = 'overview' } = req.query;

      if (type === 'overview') {
        // Genel istatistikler
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Posts istatistikleri
        const [
          totalPosts,
          publishedPosts,
          draftPosts,
          archivedPosts,
          thisMonthPosts
        ] = await Promise.all([
          Post.countDocuments(),
          Post.countDocuments({ status: 'published' }),
          Post.countDocuments({ status: 'draft' }),
          Post.countDocuments({ status: 'archived' }),
          Post.countDocuments({ createdAt: { $gte: thisMonth } })
        ]);

        // Users istatistikleri
        const [
          totalUsers,
          activeUsers,
          adminUsers,
          thisMonthUsers
        ] = await Promise.all([
          User.countDocuments(),
          User.countDocuments({ isActive: true }),
          User.countDocuments({ $or: [{ isAdmin: true }, { role: 'admin' }] }),
          User.countDocuments({ createdAt: { $gte: thisMonth } })
        ]);

        // Comments istatistikleri
        const [
          totalComments,
          pendingComments,
          approvedComments,
          rejectedComments,
          thisMonthComments
        ] = await Promise.all([
          Comment.countDocuments(),
          Comment.countDocuments({ status: 'pending' }),
          Comment.countDocuments({ status: 'approved' }),
          Comment.countDocuments({ status: 'rejected' }),
          Comment.countDocuments({ createdAt: { $gte: thisMonth } })
        ]);

        // Views istatistikleri
        const viewsResult = await Post.aggregate([
          { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const totalViews = viewsResult[0]?.totalViews || 0;

        const thisMonthViewsResult = await Post.aggregate([
          { $match: { createdAt: { $gte: thisMonth } } },
          { $group: { _id: null, monthViews: { $sum: '$views' } } }
        ]);
        const thisMonthViews = thisMonthViewsResult[0]?.monthViews || 0;

        const todayViewsResult = await Post.aggregate([
          { $match: { createdAt: { $gte: today } } },
          { $group: { _id: null, todayViews: { $sum: '$views' } } }
        ]);
        const todayViews = todayViewsResult[0]?.todayViews || 0;

        const stats: DashboardStats = {
          posts: {
            total: totalPosts,
            published: publishedPosts,
            draft: draftPosts,
            archived: archivedPosts,
            thisMonth: thisMonthPosts
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            admins: adminUsers,
            thisMonth: thisMonthUsers
          },
          comments: {
            total: totalComments,
            pending: pendingComments,
            approved: approvedComments,
            rejected: rejectedComments,
            thisMonth: thisMonthComments
          },
          views: {
            total: totalViews,
            thisMonth: thisMonthViews,
            today: todayViews
          }
        };

        return res.status(200).json({
          success: true,
          data: stats
        });

      } else if (type === 'charts') {
        // Grafik verileri
        const { period = '7d' } = req.query;
        
        let startDate: Date;
        const now = new Date();

        switch (period) {
          case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Günlük istatistikler
        const dailyStats = await Promise.all([
          // Posts
          Post.aggregate([
            {
              $match: { createdAt: { $gte: startDate } }
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ]),
          // Users
          User.aggregate([
            {
              $match: { createdAt: { $gte: startDate } }
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ]),
          // Comments
          Comment.aggregate([
            {
              $match: { createdAt: { $gte: startDate } }
            },
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
          ])
        ]);

        // Tarihleri düzenle ve birleştir
        const dateRange = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= now) {
          dateRange.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const timeSeriesData: TimeSeriesData[] = dateRange.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();

          const postsCount = dailyStats[0].find(item => 
            item._id.year === year && item._id.month === month && item._id.day === day
          )?.count || 0;

          const usersCount = dailyStats[1].find(item => 
            item._id.year === year && item._id.month === month && item._id.day === day
          )?.count || 0;

          const commentsCount = dailyStats[2].find(item => 
            item._id.year === year && item._id.month === month && item._id.day === day
          )?.count || 0;

          return {
            date: dateStr,
            posts: postsCount,
            users: usersCount,
            comments: commentsCount,
            views: 0 // Views için ayrı hesaplama gerekebilir
          };
        });

        // Chart.js formatında veri
        const chartData: ChartData = {
          labels: timeSeriesData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('tr-TR', { 
              month: 'short', 
              day: 'numeric' 
            });
          }),
          datasets: [
            {
              label: 'Yazılar',
              data: timeSeriesData.map(item => item.posts),
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: 'Kullanıcılar',
              data: timeSeriesData.map(item => item.users),
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            },
            {
              label: 'Yorumlar',
              data: timeSeriesData.map(item => item.comments),
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderColor: 'rgb(245, 158, 11)',
              borderWidth: 2
            }
          ]
        };

        return res.status(200).json({
          success: true,
          data: {
            timeSeries: timeSeriesData,
            chartData
          }
        });

      } else if (type === 'categories') {
        // Kategori istatistikleri
        const categoryStats = await Post.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              views: { $sum: '$views' }
            }
          },
          { $sort: { count: -1 } }
        ]);

        const chartData: ChartData = {
          labels: categoryStats.map(item => item._id || 'Kategorisiz'),
          datasets: [{
            label: 'Yazı Sayısı',
            data: categoryStats.map(item => item.count),
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ]
          }]
        };

        return res.status(200).json({
          success: true,
          data: {
            categories: categoryStats,
            chartData
          }
        });

      } else {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz istatistik türü'
        });
      }

    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }
  })(req, res);
}
