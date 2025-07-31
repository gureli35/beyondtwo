import React from 'react';
import { Tabs } from '@/components/admin/ui/Tabs';
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  MapIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function ContentManager() {
  const contentTypes = [
    {
      type: 'blog',
      title: 'Blog Yazıları',
      description: 'Blog yazılarınızı yönetin',
      count: 34,
      icon: <DocumentTextIcon className="w-6 h-6" />,
      route: '/admin/content/blog',
    },
    {
      type: 'youth-voices',
      title: 'Youth Voices',
      description: 'Gençlerin seslerini ve hikayelerini yönetin',
      count: 12,
      icon: <UserGroupIcon className="w-6 h-6" />,
      route: '/admin/content/youth-voices',
    },
    {
      type: 'data-hub',
      title: 'Data Hub',
      description: 'Veri setlerini ve görselleştirmeleri yönetin',
      count: 8,
      icon: <ChartBarIcon className="w-6 h-6" />,
      route: '/admin/content/data-hub',
    },
    {
      type: 'resources',
      title: 'Kaynaklar',
      description: 'Eğitim ve bilgi kaynaklarını yönetin',
      count: 25,
      icon: <BookOpenIcon className="w-6 h-6" />,
      route: '/admin/content/resources',
    },
    {
      type: 'impact-map',
      title: 'Etki Haritası',
      description: 'Etki haritası verilerini yönetin',
      count: 45,
      icon: <MapIcon className="w-6 h-6" />,
      route: '/admin/content/impact-map',
    },
    {
      type: 'pages',
      title: 'Sayfalar',
      description: 'Statik sayfalarınızı yönetin',
      count: 15,
      icon: <GlobeAltIcon className="w-6 h-6" />,
      route: '/admin/content/pages',
    },
    {
      type: 'media',
      title: 'Medya',
      description: 'Görsel ve dosyalarınızı yönetin',
      count: 129,
      icon: <PhotoIcon className="w-6 h-6" />,
      route: '/admin/content/media',
    },
  ];

  const tabItems = contentTypes.map(contentType => ({
    key: contentType.type,
    label: contentType.title,
    icon: contentType.icon,
    content: (
      <div className="py-4">
        <p className="text-gray-500 mb-6">
          {contentType.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                  {contentType.icon}
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{contentType.count}</h3>
                  <p className="text-sm text-gray-500">Toplam {contentType.title}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href={contentType.route}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Hepsini görüntüle →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Yeni Oluştur</h3>
                  <p className="text-sm text-gray-500">Yeni {contentType.title.slice(0, -1)} oluştur</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href={`${contentType.route}/new`}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Oluştur →
                </Link>
              </div>
            </div>
          </div>

          {contentType.type === 'blog' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Taslaklar</h3>
                    <p className="text-sm text-gray-500">5 taslak yazı</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?status=draft`}
                    className="font-medium text-yellow-600 hover:text-yellow-500"
                  >
                    Taslakları görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'youth-voices' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Hikayeler</h3>
                    <p className="text-sm text-gray-500">8 hikaye</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=stories`}
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Hikayeleri görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'data-hub' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-cyan-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Veri Setleri</h3>
                    <p className="text-sm text-gray-500">5 veri seti</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=datasets`}
                    className="font-medium text-cyan-600 hover:text-cyan-500"
                  >
                    Veri setlerini görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'resources' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Dökümanlar</h3>
                    <p className="text-sm text-gray-500">18 döküman</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=documents`}
                    className="font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Dökümanları görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'impact-map' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Noktalar</h3>
                    <p className="text-sm text-gray-500">45 harita noktası</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=points`}
                    className="font-medium text-amber-600 hover:text-amber-500"
                  >
                    Harita noktalarını görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'pages' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Ana Sayfalar</h3>
                    <p className="text-sm text-gray-500">5 ana sayfa</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=main`}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Ana sayfaları görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {contentType.type === 'media' && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-50 rounded-md p-3">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-900">Görseller</h3>
                    <p className="text-sm text-gray-500">97 görsel</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href={`${contentType.route}?type=image`}
                    className="font-medium text-red-600 hover:text-red-500"
                  >
                    Görselleri görüntüle →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          İçerik Yönetimi
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Blog yazıları, sayfalar ve medya dosyalarını yönetin
        </p>
      </div>

      <div className="overflow-x-auto">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
