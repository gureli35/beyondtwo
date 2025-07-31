import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ActivityLog from './ActivityLog';
import { AdminActivity } from '@/types/admin';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  lastMonthUsers: number;
  lastMonthPosts: number;
  lastMonthComments: number;
  lastMonthViews: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    tension?: number;
  }[];
}

export const DashboardComp: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
    lastMonthUsers: 0,
    lastMonthPosts: 0,
    lastMonthComments: 0,
    lastMonthViews: 0,
  });

  const [recentActivity, setRecentActivity] = useState<AdminActivity[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    // Mock data - In real app, this would come from API
    setStats({
      totalUsers: 1432,
      totalPosts: 89,
      totalComments: 324,
      totalViews: 15678,
      lastMonthUsers: 156,
      lastMonthPosts: 12,
      lastMonthComments: 87,
      lastMonthViews: 2341,
    });

    setRecentActivity([
      {
        id: '1',
        userId: '1',
        userDisplayName: 'Admin User',
        action: 'Blog yazısı oluşturdu',
        targetType: 'content',
        targetId: '123',
        targetName: 'İklim Değişikliği ve Etkileri',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: '2',
        userId: '2',
        userDisplayName: 'Content Manager',
        action: 'Sayfayı güncelledi',
        targetType: 'content',
        targetId: '456',
        targetName: 'Hakkımızda',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        userId: '1',
        userDisplayName: 'Admin User',
        action: 'Yeni kullanıcı ekledi',
        targetType: 'user',
        targetId: '789',
        targetName: 'John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ]);

    setTopPosts([
      { id: 1, title: 'İklim Değişikliği ve Etkileri', views: 1234, comments: 45 },
      { id: 2, title: 'Yenilenebilir Enerji Kaynakları', views: 987, comments: 32 },
      { id: 3, title: 'Sürdürülebilir Yaşam İpuçları', views: 756, comments: 28 },
      { id: 4, title: 'Çevre Aktivizmi Rehberi', views: 654, comments: 21 },
      { id: 5, title: 'Karbon Ayak İzi Azaltma', views: 543, comments: 19 },
    ]);

    // Chart data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('tr-TR', { weekday: 'short' });
    });

    setChartData({
      labels: last7Days,
      datasets: [
        {
          label: 'Günlük Görüntüleme',
          data: [120, 190, 300, 500, 200, 300, 450],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Yeni Kullanıcılar',
          data: [12, 19, 30, 25, 20, 30, 25],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    });
  }, []);

  const statsCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.totalUsers.toLocaleString(),
      change: `+${stats.lastMonthUsers}`,
      isPositive: true,
      icon: 'users' as const,
    },
    {
      title: 'Blog Yazıları',
      value: stats.totalPosts.toLocaleString(),
      change: `+${stats.lastMonthPosts}`,
      isPositive: true,
      icon: 'document' as const,
    },
    {
      title: 'Toplam Yorum',
      value: stats.totalComments.toLocaleString(),
      change: `+${stats.lastMonthComments}`,
      isPositive: true,
      icon: 'chat' as const,
    },
    {
      title: 'Toplam Görüntüleme',
      value: stats.totalViews.toLocaleString(),
      change: `+${stats.lastMonthViews}`,
      isPositive: true,
      icon: 'chart' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Beyond2C Admin Panel'e hoş geldiniz
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Site Trafiği
              </h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Son 7 gün</option>
                <option>Son 30 gün</option>
                <option>Son 90 gün</option>
              </select>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl text-gray-400 mb-2">📊</div>
                <p className="text-gray-500">Grafik burada görünecek</p>
                <p className="text-sm text-gray-400 mt-1">
                  Chart.js entegrasyonu için
                </p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center mt-4 space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Günlük Görüntüleme</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Yeni Kullanıcılar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <ActivityLog activities={recentActivity} />
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Popüler Blog Yazıları
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {topPosts.map((post, index) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-400 mr-4">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{post.views} görüntüleme</span>
                    <span className="mx-2">•</span>
                    <span>{post.comments} yorum</span>
                  </div>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                Düzenle
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Hızlı İşlemler
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-indigo-600">📝</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Yeni Yazı</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-emerald-600">👥</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Kullanıcılar</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-amber-600">💬</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Yorumlar</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-purple-600">⚙️</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Ayarlar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
