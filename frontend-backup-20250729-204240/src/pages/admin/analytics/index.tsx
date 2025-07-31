import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs } from '@/components/admin/ui/Tabs';

const AnalyticsPage: React.FC = () => {
  // Mock data for analytics
  const visitorStats = {
    totalVisitors: 12478,
    uniqueVisitors: 8935,
    pageViews: 35642,
    averageTimeOnSite: '2:45',
    bounceRate: '42%',
    lastMonth: {
      visitors: 3450,
      change: 12, // percentage change from previous month
      isIncrease: true,
    },
    lastWeek: {
      visitors: 783,
      change: 5,
      isIncrease: true,
    },
  };

  const popularPages = [
    { path: '/', title: 'Ana Sayfa', views: 4532, avgTime: '1:23' },
    { path: '/blog/iklim-degisikligi-ve-etkileri', title: 'İklim Değişikliği ve Etkileri', views: 2187, avgTime: '3:45' },
    { path: '/impact-map', title: 'Etki Haritası', views: 1876, avgTime: '4:12' },
    { path: '/about', title: 'Hakkımızda', views: 1543, avgTime: '2:08' },
    { path: '/take-action', title: 'Harekete Geç', views: 1245, avgTime: '2:56' },
  ];

  const trafficSources = [
    { source: 'Google', visitors: 4235, percentage: 47 },
    { source: 'Doğrudan', visitors: 1865, percentage: 21 },
    { source: 'Sosyal Medya', visitors: 1543, percentage: 17 },
    { source: 'Yönlendirmeler', visitors: 895, percentage: 10 },
    { source: 'Diğer', visitors: 462, percentage: 5 },
  ];

  const deviceData = [
    { device: 'Mobil', visitors: 5463, percentage: 61 },
    { device: 'Masaüstü', visitors: 2785, percentage: 31 },
    { device: 'Tablet', visitors: 687, percentage: 8 },
  ];

  const tabItems = [
    {
      key: 'overview',
      label: 'Genel Bakış',
      content: (
        <div className="py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Summary Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Toplam Ziyaretçi</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{visitorStats.totalVisitors.toLocaleString('tr-TR')}</div>
                        <div className="flex items-baseline">
                          <span className={`text-sm ${visitorStats.lastMonth.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                            {visitorStats.lastMonth.isIncrease ? '+' : '-'}{visitorStats.lastMonth.change}%
                          </span>
                          <span className="text-xs text-gray-500 ml-1">son ayda</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Sayfa Görüntüleme</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{visitorStats.pageViews.toLocaleString('tr-TR')}</div>
                        <div className="text-xs text-gray-500">Ortalama oturum süresi: {visitorStats.averageTimeOnSite}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Hemen Çıkma Oranı</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{visitorStats.bounceRate}</div>
                        <div className="text-xs text-gray-500">Tek sayfa ziyareti oranı</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Popular Pages */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">En Popüler Sayfalar</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Son 30 gün içinde</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-3 sm:px-6">
                  <div className="flow-root">
                    <ul className="-my-2">
                      {popularPages.map((page, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-gray-900">{page.title}</p>
                            <p className="text-xs text-gray-500">{page.path}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-4">{page.views.toLocaleString('tr-TR')} görüntüleme</span>
                            <span className="text-xs text-gray-500">{page.avgTime} ort. süre</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Trafik Kaynakları</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Ziyaretçilerin geldiği kaynaklar</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-3 sm:px-6">
                  <div className="flow-root">
                    <ul className="-my-2">
                      {trafficSources.map((source, index) => (
                        <li key={index} className="py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{source.source}</p>
                            <p className="text-sm text-gray-500">{source.visitors.toLocaleString('tr-TR')} ziyaretçi</p>
                          </div>
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 text-right">{source.percentage}%</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'audience',
      label: 'Kullanıcılar',
      content: (
        <div className="py-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cihaz Dağılımı</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Ziyaretçilerin kullandığı cihaz türleri</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {deviceData.map((device, index) => (
                  <div key={index} className="bg-gray-50 overflow-hidden rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {device.device === 'Mobil' ? (
                          <svg className="h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        ) : device.device === 'Masaüstü' ? (
                          <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-5">
                        <h4 className="text-lg font-medium text-gray-900">{device.device}</h4>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">{device.percentage}%</p>
                          <p className="ml-2 text-sm text-gray-500">{device.visitors.toLocaleString('tr-TR')} ziyaretçi</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${
                        device.device === 'Mobil' ? 'bg-indigo-500' : device.device === 'Masaüstü' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} style={{ width: `${device.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">Demografik Veriler</h4>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Age Groups */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Yaş Grupları</h5>
                    <div className="space-y-3">
                      {[
                        { age: '18-24', percentage: 42 },
                        { age: '25-34', percentage: 28 },
                        { age: '35-44', percentage: 16 },
                        { age: '45-54', percentage: 9 },
                        { age: '55+', percentage: 5 },
                      ].map((group, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{group.age}</span>
                            <span className="text-xs font-medium text-gray-700">{group.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${group.percentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Cinsiyet Dağılımı</h5>
                    <div className="flex items-center justify-center h-44">
                      <div className="flex flex-col items-center">
                        <div className="relative w-40 h-40 rounded-full">
                          <div className="absolute inset-0 rounded-full bg-pink-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 50%)' }}></div>
                          <div className="absolute inset-0 rounded-full bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0, 50% 50%)' }}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white w-24 h-24 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-center mt-4 space-x-6">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                            <span className="ml-2 text-xs text-gray-700">Kadın (56%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="ml-2 text-xs text-gray-700">Erkek (44%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'content',
      label: 'İçerik Performansı',
      content: (
        <div className="py-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">İçerik Performansı</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Blog yazıları ve sayfaların performans analizi</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-base font-medium text-gray-900 mb-4">En Çok Okunan Blog Yazıları</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başlık
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Görüntüleme
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ortalama Okuma Süresi
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sosyal Paylaşım
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yorum Sayısı
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { title: 'İklim Değişikliği ve Etkileri', views: 2187, readTime: '3:45', shares: 142, comments: 28 },
                        { title: 'Sürdürülebilir Enerji Kaynakları', views: 1654, readTime: '4:12', shares: 98, comments: 15 },
                        { title: 'Z Kuşağı ve İklim Aktivizmi', views: 1432, readTime: '2:55', shares: 187, comments: 32 },
                        { title: 'Karbon Ayak İzini Azaltma Yöntemleri', views: 1245, readTime: '3:10', shares: 76, comments: 19 },
                        { title: 'Çevre Dostu Yaşam Pratikleri', views: 1078, readTime: '2:48', shares: 64, comments: 11 },
                      ].map((post, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {post.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.views.toLocaleString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.readTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.shares}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {post.comments}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 className="text-base font-medium text-gray-900 mt-8 mb-4">Kategori Performansı</h4>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { category: 'İklim', views: 4532, posts: 12 },
                    { category: 'Enerji', views: 3245, posts: 8 },
                    { category: 'Aktivizm', views: 2876, posts: 7 },
                    { category: 'Yaşam', views: 2143, posts: 6 },
                  ].map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-900">{category.category}</h5>
                      <p className="text-2xl font-semibold text-gray-900 mt-2">{category.views.toLocaleString('tr-TR')}</p>
                      <p className="text-xs text-gray-500">{category.posts} yazı</p>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${Math.round((category.views / 12796) * 100)}%` }}></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 text-right">{Math.round((category.views / 12796) * 100)}% toplam görüntüleme</p>
                    </div>
                  ))}
                </div>
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
        <title>Analitik | Beyond2C Admin</title>
      </Head>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Analitik</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sitenizin ziyaretçi istatistikleri ve içerik performansı
          </p>
        </div>

        <Tabs items={tabItems} />
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
