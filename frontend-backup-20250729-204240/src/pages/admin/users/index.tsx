import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { UserList } from '@/components/admin/users/UserList';
import { UserForm } from '@/components/admin/users/UserForm';
import { Modal } from '@/components/admin/ui/Modal';
import { AdminUser } from '@/types/admin';

const UsersPage: React.FC = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | undefined>(undefined);

  const handleAddUser = () => {
    setEditingUser(undefined);
    setFormModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // In a real app, this would make an API call
    console.log('Form submitted:', data);
    console.log('Editing user:', editingUser?.id);
    
    // Close modal and reset state
    setFormModalOpen(false);
    setEditingUser(undefined);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kullanıcı Yönetimi | Beyond2C Admin</title>
      </Head>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <UserList 
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
        />
      </div>

      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
        />
      </Modal>
    </AdminLayout>
  );
};

export default UsersPage;
