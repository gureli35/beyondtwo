import React, { useState } from 'react';
import { DataTable } from '@/components/admin/ui/Table';
import { Modal } from '@/components/admin/ui/Modal';
import { AdminUser } from '@/types/admin';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';

// Demo data
const demoUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@beyond2c.org',
    displayName: 'Admin User',
    role: 'admin',
    permissions: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.delete'],
    lastLogin: new Date().toISOString(),
    isActive: true,
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: '2',
    email: 'editor@beyond2c.org',
    displayName: 'Editor User',
    role: 'editor',
    permissions: ['dashboard.view', 'blog.view', 'blog.create', 'blog.edit'],
    lastLogin: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
    createdAt: '2023-02-15T14:30:00Z',
  },
  {
    id: '3',
    email: 'moderator@beyond2c.org',
    displayName: 'Moderator User',
    role: 'moderator',
    permissions: ['dashboard.view', 'blog.view', 'blog.create', 'blog.edit', 'voices.view', 'voices.edit'],
    lastLogin: new Date(Date.now() - 604800000).toISOString(),
    isActive: true,
    createdAt: '2023-03-20T09:15:00Z',
  },
];

interface UserListProps {
  onAddUser?: () => void;
  onEditUser?: (user: AdminUser) => void;
}

export function UserList({ onAddUser, onEditUser }: UserListProps) {
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  const columnHelper = createColumnHelper<AdminUser>();

  const columns = [
    columnHelper.accessor('displayName', {
      header: 'Kullanıcı Adı',
      cell: info => (
        <div className="flex items-center">
          {info.row.original.avatar ? (
            <img
              src={info.row.original.avatar}
              alt={info.getValue() || 'User'}
              className="h-8 w-8 rounded-full mr-2"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-gray-500">
                {(info.getValue() || info.row.original.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{info.getValue() || 'İsimsiz Kullanıcı'}</div>
            <div className="text-xs text-gray-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Rol',
      cell: info => {
        const roleDisplay = {
          editor: { label: 'Editor', color: 'bg-green-100 text-green-800' },
          moderator: { label: 'Moderatör', color: 'bg-blue-100 text-blue-800' },
          admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800' },
          super_admin: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
          // Legacy role mappings for backward compatibility
          content_manager: { label: 'İçerik Yöneticisi', color: 'bg-green-100 text-green-800' },
          analytics_viewer: { label: 'Analiz Görüntüleyici', color: 'bg-yellow-100 text-yellow-800' },
        } as const;
        
        const role = info.getValue();
        const display = roleDisplay[role] || { label: role, color: 'bg-gray-100 text-gray-800' };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${display.color}`}>
            {display.label}
          </span>
        );
      }
    }),
    columnHelper.accessor('lastLogin', {
      header: 'Son Giriş',
      cell: info => {
        const date = new Date(info.getValue());
        return new Intl.DateTimeFormat('tr-TR', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(date);
      }
    }),
    columnHelper.accessor('isActive', {
      header: 'Durum',
      cell: info => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {info.getValue() ? 'Aktif' : 'Pasif'}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'İşlemler',
      cell: info => (
        <div className="flex items-center space-x-2">
          <Link 
            href={`/admin/users/${info.row.original.id}`}
            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
          >
            Görüntüle
          </Link>
          <button
            onClick={() => onEditUser?.(info.row.original)}
            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
          >
            Düzenle
          </button>
          <button
            onClick={() => {
              setUserToDelete(info.row.original);
              setDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-900 font-medium text-sm"
          >
            Sil
          </button>
        </div>
      )
    })
  ];

  const handleDeleteUser = () => {
    // In a real app, this would make an API call
    console.log('Deleting user:', userToDelete);
    // Close modal and reset state
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Kullanıcı Yönetimi</h2>
        <div className="flex space-x-2">
          {selectedUsers.length > 0 && (
            <button
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                // Batch delete logic would go here
                console.log('Batch delete:', selectedUsers);
              }}
            >
              {selectedUsers.length} Kullanıcıyı Sil
            </button>
          )}
          <button
            className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onAddUser}
          >
            Yeni Kullanıcı Ekle
          </button>
        </div>
      </div>

      <DataTable
        data={demoUsers}
        columns={columns}
        enableSelection={true}
        onRowSelect={setSelectedUsers}
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Kullanıcıyı Sil"
        size="sm"
        footer={
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sil
            </button>
          </div>
        }
      >
        <div className="py-2">
          <p className="text-gray-700">
            <span className="font-medium">{userToDelete?.displayName || userToDelete?.email}</span> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
      </Modal>
    </div>
  );
}
