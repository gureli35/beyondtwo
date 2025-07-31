import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';

const AnalyticsPage: React.FC = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Analitik | Beyond2C Admin</title>
      </Head>
      
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analitik</h1>
          <p className="mt-1 text-sm text-gray-500">
            Platform analitik verilerini görüntüleyin
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Analitik Dashboard</h2>
          <p>Analitik verileri burada gösterilecek.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
