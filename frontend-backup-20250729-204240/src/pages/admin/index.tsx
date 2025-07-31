import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import StatCard from '@/components/admin/dashboard/StatCard';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityLog from '@/components/admin/dashboard/ActivityLog';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminActivity } from '@/types/admin';

type StatCardIconType = 'users' | 'project' | 'document' | 'mail' | 'chart' | 'chat' | 'microphone' | 'photo' | 'template';

interface StatData {
  title: string;
  value: string;
  changePercentage: number;
  isIncrease: boolean;
  icon: StatCardIconType;
}

// Dummy data for demo purposes
const statsData: StatData[] = [
  { title: 'Toplam Kullanıcı', value: '1,432', changePercentage: 12, isIncrease: true, icon: 'users' },
  { title: 'Blog Yazıları', value: '34', changePercentage: 8, isIncrease: true, icon: 'document' },
  { title: 'Medya Dosyaları', value: '129', changePercentage: 23, isIncrease: true, icon: 'photo' },
  { title: 'Sayfalar', value: '15', changePercentage: 0, isIncrease: false, icon: 'template' },
];

const activityData: AdminActivity[] = [
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
    action: 'Medya dosyası yükledi',
    targetType: 'content',
    targetId: '456',
    targetName: 'climate-protest.jpg',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    userId: '3',
    userDisplayName: 'Editor',
    action: 'Sayfa güncelledi',
    targetType: 'content',
    targetId: '789',
    targetName: 'Anasayfa',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '4',
    userId: '1',
    userDisplayName: 'Admin User',
    action: 'Kullanıcı ekledi',
    targetType: 'user',
    targetId: '4',
    targetName: 'Yeni Editör',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAdminAuth();

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard | Beyond2C Admin</title>
      </Head>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Hoş geldin, {user?.displayName || 'Admin'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString('tr-TR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              changePercentage={stat.changePercentage}
              isIncrease={stat.isIncrease}
              icon={stat.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Log */}
          <div className="lg:col-span-2">
            <ActivityLog activities={activityData} />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
