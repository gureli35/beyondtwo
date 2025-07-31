import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminLayout from '../../components/admin/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardStats {
  totalPosts: number;
  totalStories: number;
  totalUsers: number;
  totalComments: number;
  monthlyViews: number;
  lastMonthPosts: number;
  lastMonthStories: number;
  lastMonthUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'post' | 'story' | 'user' | 'comment';
  title: string;
  author?: string;
  date: string;
  status?: 'published' | 'pending' | 'approved';
}

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, loading, user } = useAdminAuth();
  const { t } = useLanguage();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 24,
    totalStories: 156,
    totalUsers: 1247,
    totalComments: 89,
    monthlyViews: 12453,
    lastMonthPosts: 8,
    lastMonthStories: 23,
    lastMonthUsers: 187,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'post',
      title: 'İklim Değişikliğinin Türkiye\'ye Etkileri',
      author: 'Dr. Ahmet Yılmaz',
      date: '2024-06-10',
      status: 'published'
    },
    {
      id: '2',
      type: 'story',
      title: 'Okul Projemizle Enerji Tasarrufu Sağladık',
      author: 'Zeynep Kaya',
      date: '2024-06-09',
      status: 'pending'
    },
    {
      id: '3',
      type: 'user',
      title: 'Yeni Kullanıcı Kaydı',
      author: 'Mehmet Demir',
      date: '2024-06-08',
      status: 'approved'
    }
  ]);
  
  // Yükleme durumunda gösterilecek
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  // Giriş yapılmamışsa login göster
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <>
      <Head>
        <title>Beyond2C Admin Panel</title>
        <meta name="description" content="Beyond2C Yönetici Paneli" />
      </Head>
      
      <AdminLayout title="Yönetici Paneli">
        <div className="space-y-6">
          {/* İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="admin-stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Blog Yazısı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +{stats.lastMonthPosts} son ay
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kullanıcı Hikayeleri</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStories}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +{stats.lastMonthStories} son ay
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-2xl">🗣️</span>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +{stats.lastMonthUsers} son ay
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aylık Görüntüleme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.monthlyViews.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +12% son ay
                  </p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı Aksiyonlar */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/blog/create"
                className="admin-btn-primary flex items-center justify-center p-4 rounded-lg"
              >
                <span className="mr-2">📝</span>
                Yeni Blog Yazısı
              </a>
              <a
                href="/admin/stories/pending"
                className="admin-btn-secondary flex items-center justify-center p-4 rounded-lg"
              >
                <span className="mr-2">👀</span>
                Bekleyen Hikayeler
              </a>
              <a
                href="/admin/users"
                className="admin-btn-secondary flex items-center justify-center p-4 rounded-lg"
              >
                <span className="mr-2">👥</span>
                Kullanıcı Yönetimi
              </a>
              <a
                href="/admin/analytics"
                className="admin-btn-secondary flex items-center justify-center p-4 rounded-lg"
              >
                <span className="mr-2">📈</span>
                Analitik Raporu
              </a>
            </div>
          </div>

          {/* Son Aktiviteler ve Platform Durumu */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="admin-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'post' && <span className="text-xl">📝</span>}
                        {activity.type === 'story' && <span className="text-xl">🗣️</span>}
                        {activity.type === 'user' && <span className="text-xl">👤</span>}
                        {activity.type === 'comment' && <span className="text-xl">💬</span>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className={`admin-badge ${
                          activity.status === 'published' || activity.status === 'approved' 
                            ? 'success' 
                            : 'warning'
                        }`}
                      >
                        {activity.status === 'published' && 'Yayınlandı'}
                        {activity.status === 'pending' && 'Beklemede'}
                        {activity.status === 'approved' && 'Onaylandı'}
                      </span>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <a href="/admin/activity" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Tüm aktiviteleri görüntüle →
                </a>
              </div>
            </div>

            {/* Platform Sağlığı */}
            <div className="admin-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Durumu</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Website Performansı</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">92%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SEO Skoru</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">88%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Güvenlik</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">100%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Yedekleme Durumu</span>
                  <span className="admin-badge success">Güncel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bekleyen İşlemler */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Onay Bekleyen İçerikler</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-800">Bekleyen Hikayeler</h4>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">12</span>
                </div>
                <p className="text-sm text-yellow-700 mb-3">Yeni gönderilen kullanıcı hikayeleri incelemeyi bekliyor.</p>
                <a href="/admin/stories/pending" className="text-yellow-800 text-sm font-medium hover:underline">
                  İncele →
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-800">Taslak Yazılar</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">5</span>
                </div>
                <p className="text-sm text-blue-700 mb-3">Tamamlanmayı bekleyen blog yazıları.</p>
                <a href="/admin/blog/drafts" className="text-blue-800 text-sm font-medium hover:underline">
                  Düzenle →
                </a>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-800">Yeni Üyelikler</h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">28</span>
                </div>
                <p className="text-sm text-green-700 mb-3">Bu hafta katılan yeni kullanıcılar.</p>
                <a href="/admin/users?filter=new" className="text-green-800 text-sm font-medium hover:underline">
                  Görüntüle →
                </a>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
