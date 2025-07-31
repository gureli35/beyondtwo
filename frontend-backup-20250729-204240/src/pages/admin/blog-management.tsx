import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import BlogManagement from '@/components/admin/dashboard/BlogManagement';

const BlogManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Blog Management | Beyond2C Admin</title>
      </Head>
      
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all blog posts, create new content, and track performance
          </p>
        </div>
        
        <BlogManagement />
      </div>
    </AdminLayout>
  );
};

export default BlogManagementPage;
