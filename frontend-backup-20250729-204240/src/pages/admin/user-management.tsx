import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import UserManagement from '@/components/admin/dashboard/UserManagement';

const UserManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <Head>
        <title>User Management | Beyond2C Admin</title>
      </Head>
      
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        <UserManagement />
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
