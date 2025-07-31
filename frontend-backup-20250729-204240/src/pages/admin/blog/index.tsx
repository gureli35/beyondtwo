import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/context/ToastContext';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  views: number;
}

const BlogManagementPage: React.FC = () => {
  const router = useRouter();
  const { hasPermission } = useAdminAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  useEffect(() => {
    if (!hasPermission('blog.view')) {
      router.push('/admin');
      return;
    }
    fetchPosts();
  }, [hasPermission, router]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        // Test verisi kullan
        setPosts([
          {
            _id: '1',
            title: 'İklim Değişikliğinin Gençlere Etkisi',
            slug: 'iklim-degisikliginin-genclere-etkisi',
            excerpt: 'İklim değişikliği gençlerin geleceğini nasıl etkiliyor?',
            content: 'Blog içeriği...',
            author: 'Admin',
            status: 'published',
            publishDate: '2024-01-15',
            updatedAt: '2024-01-15',
            tags: ['iklim', 'gençlik'],
            readTime: 5,
            views: 1250
          },
          {
            _id: '2',
            title: 'Sürdürülebilir Yaşam Rehberi',
            slug: 'surdurulebilir-yasam-rehberi',
            excerpt: 'Günlük hayatta sürdürülebilirlik nasıl sağlanır?',
            content: 'Blog içeriği...',
            author: 'Admin',
            status: 'draft',
            publishDate: '',
            updatedAt: '2024-01-14',
            tags: ['sürdürülebilirlik', 'yaşam'],
            readTime: 8,
            views: 0
          }
        ]);
      }
    } catch (error) {
      console.error('Blog posts fetch error:', error);
      showToast('Blog yazıları yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post._id === postId ? { ...post, status: newStatus as any } : post
        ));
        showToast('Blog yazısı durumu güncellendi', 'success');
      } else {
        showToast('Durum güncellenirken hata oluştu', 'error');
      }
    } catch (error) {
      console.error('Status update error:', error);
      showToast('Durum güncellenirken hata oluştu', 'error');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(post => post._id !== postId));
        showToast('Blog yazısı silindi', 'success');
      } else {
        showToast('Blog yazısı silinirken hata oluştu', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Blog yazısı silinirken hata oluştu', 'error');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    const statusTexts = {
      published: 'Yayında',
      draft: 'Taslak',
      archived: 'Arşivlendi'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600">Blog yazılarını yönetin ve düzenleyin</p>
          </div>
          {hasPermission('blog.create') && (
            <button
              onClick={() => router.push('/admin/blog/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Yeni Blog Yazısı
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          {(['all', 'published', 'draft', 'archived'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption === 'all' ? 'Tümü' : 
               filterOption === 'published' ? 'Yayında' :
               filterOption === 'draft' ? 'Taslak' : 'Arşivlendi'} 
              ({posts.filter(p => filterOption === 'all' || p.status === filterOption).length})
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Yazı</p>
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yayında</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taslak</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Görüntüleme</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.reduce((total, post) => total + post.views, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görüntüleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.publishDate || 'Yayınlanmadı'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hasPermission('blog.edit') && (
                        <button
                          onClick={() => router.push(`/admin/blog/${post._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Düzenle
                        </button>
                      )}
                      {hasPermission('blog.publish') && post.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(post._id, 'published')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Yayınla
                        </button>
                      )}
                      {hasPermission('blog.delete') && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Blog yazısı bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter !== 'all' 
                  ? `${filter} durumunda blog yazısı bulunmuyor.`
                  : 'Henüz blog yazısı eklenmemiş.'
                }
              </p>
              {hasPermission('blog.create') && filter === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/admin/blog/create')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    İlk Blog Yazınızı Oluşturun
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogManagementPage;
