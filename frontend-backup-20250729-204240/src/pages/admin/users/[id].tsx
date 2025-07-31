import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { UserDetails } from '@/components/admin/users/UserDetails';
import { UserForm } from '@/components/admin/users/UserForm';
import { Modal } from '@/components/admin/ui/Modal';
import { Tabs } from '@/components/admin/ui/Tabs';
import { AdminUser, AdminActivity } from '@/types/admin';

// Demo data
const demoUsers: Record<string, AdminUser> = {
  '1': {
    id: '1',
    email: 'admin@beyond2c.org',
    displayName: 'Admin User',
    role: 'super_admin',
    permissions: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.delete'],
    lastLogin: new Date().toISOString(),
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  '2': {
    id: '2',
    email: 'editor@beyond2c.org',
    displayName: 'Editor User',
    role: 'content_manager',
    permissions: ['dashboard.view', 'content.view', 'content.create', 'content.edit'],
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
    createdAt: '2023-02-15T14:30:00Z',
  },
  '3': {
    id: '3',
    email: 'analyst@beyond2c.org',
    displayName: 'Analyst User',
    role: 'analytics_viewer',
    permissions: ['dashboard.view', 'analytics.view'],
    lastLogin: new Date(Date.now() - 604800000).toISOString(),
    isActive: false,
    createdAt: '2023-03-20T09:15:00Z',
  },
};

// Demo activities
const demoActivities: Record<string, AdminActivity[]> = {
  '1': [
    {
      id: '101',
      userId: '1',
      userDisplayName: 'Admin User',
      action: 'Blog yazısı oluşturdu',
      targetType: 'content',
      targetId: '123',
      targetName: 'İklim Değişikliği ve Etkileri',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: '102',
      userId: '1',
      userDisplayName: 'Admin User',
      action: 'Kullanıcı ekledi',
      targetType: 'user',
      targetId: '4',
      targetName: 'Yeni Editör',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: '103',
      userId: '1',
      userDisplayName: 'Admin User',
      action: 'Ayarları güncelledi',
      targetType: 'setting',
      targetId: 'site-settings',
      targetName: 'Site Ayarları',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
  ],
};

const UserDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formModalOpen, setFormModalOpen] = useState(false);

  // In a real app, this would fetch user data from an API
  const user = demoUsers[id as string];
  const activities = demoActivities[id as string] || [];

  // Handle if user not found
  if (!user && id) {
    return (
      <AdminLayout>
        <Head>
          <title>Kullanıcı Bulunamadı | Beyond2C Admin</title>
        </Head>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Kullanıcı Bulunamadı
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  İstediğiniz kullanıcı bilgisi bulunamadı. Kullanıcı silinmiş olabilir.
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => router.push('/admin/users')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Kullanıcı Listesine Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleEditUser = () => {
    setFormModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // In a real app, this would make an API call
    console.log('Form submitted:', data);
    
    // Close modal
    setFormModalOpen(false);
  };

  const tabItems = [
    {
      key: 'details',
      label: 'Kullanıcı Bilgileri',
      content: <UserDetails user={user} activities={activities} />,
    },
    {
      key: 'security',
      label: 'Güvenlik',
      content: (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik Ayarları</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Şifre Değiştir</h4>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Kullanıcının şifresini sıfırlayın veya değiştirin.</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Şifre Sıfırla
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Ekstra güvenlik için iki faktörlü doğrulamayı etkinleştirin.</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Etkinleştir
                </button>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Oturum Yönetimi</h4>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Kullanıcının tüm aktif oturumlarını sonlandırın.</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Tüm Oturumları Sonlandır
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>{user?.displayName || user?.email} | Beyond2C Admin</title>
      </Head>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Kullanıcı: {user?.displayName || user?.email}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kullanıcı bilgilerini görüntüleyin ve yönetin
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Geri
            </button>
            <button
              type="button"
              onClick={handleEditUser}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Düzenle
            </button>
          </div>
        </div>

        <Tabs items={tabItems} />
      </div>

      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title="Kullanıcı Düzenle"
        size="lg"
      >
        <UserForm
          user={user}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default UserDetailsPage;
