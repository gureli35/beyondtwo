import React from 'react';
import { AdminUser, AdminActivity } from '@/types/admin';

interface UserDetailsProps {
  user: AdminUser;
  activities?: AdminActivity[];
}

export function UserDetails({ user, activities = [] }: UserDetailsProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Kullanıcı Bilgileri
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Kişisel detaylar ve uygulama izinleri
            </p>
          </div>
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                className="h-16 w-16 rounded-full"
                src={user.avatar}
                alt={user.displayName || user.email}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xl font-medium text-indigo-600">
                  {(user.displayName || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Ad Soyad</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.displayName || '-'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">E-posta adresi</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.email}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Rol</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'super_admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : user.role === 'admin'
                  ? 'bg-blue-100 text-blue-800'
                  : user.role === 'content_manager'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.role === 'super_admin' 
                  ? 'Super Admin' 
                  : user.role === 'admin'
                  ? 'Admin'
                  : user.role === 'content_manager'
                  ? 'İçerik Yöneticisi'
                  : 'Analiz Görüntüleyici'}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Durum</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive !== false ? 'Aktif' : 'Pasif'}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Oluşturulma tarihi</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Son giriş</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(user.lastLogin).toLocaleDateString('tr-TR', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">İzinler</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        </dl>
      </div>

      {activities.length > 0 && (
        <div className="mt-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Kullanıcı Aktiviteleri
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Son aktiviteler
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.action}
                      {activity.targetName && (
                        <span className="ml-1 font-normal text-gray-500">
                          - {activity.targetName}
                        </span>
                      )}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {new Date(activity.timestamp).toLocaleDateString('tr-TR', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
