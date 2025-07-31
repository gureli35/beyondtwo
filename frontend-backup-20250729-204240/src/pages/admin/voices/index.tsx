import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { useToast } from '@/context/ToastContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface Voice {
  _id: string;
  title: string;
  author: {
    name: string;
    location: {
      city?: string;
      region?: string;
    };
  };
  userId?: string;
  category: string;
  storyType: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published' | 'rejected' | 'archived';
  featured: boolean;
  views: number;
  likes: number;
  submittedAt: string;
  publishedAt?: string;
  updatedAt: string;
  excerpt?: string;
  isOwnedByCurrentUser?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Voice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

const AdminVoicesListPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, hasPermission } = useAdminAuth();
  
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoices, setSelectedVoices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [storyTypeFilter, setStoryTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'draft', label: 'Taslak' },
    { value: 'submitted', label: 'Gönderildi' },
    { value: 'reviewed', label: 'İncelendi' },
    { value: 'published', label: 'Yayınlandı' },
    { value: 'rejected', label: 'Reddedildi' },
    { value: 'archived', label: 'Arşivlendi' }
  ];

  const categoryOptions = [
    { value: '', label: 'Tüm Kategoriler' },
    { value: 'Youth', label: 'Youth' },
    { value: 'Energy', label: 'Energy' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Education', label: 'Education' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Community', label: 'Community' },
    { value: 'Policy', label: 'Policy' },
    { value: 'Innovation', label: 'Innovation' },
    { value: 'Conservation', label: 'Conservation' },
    { value: 'Activism', label: 'Activism' },
    { value: 'Research', label: 'Research' },
    { value: 'Other', label: 'Other' }
  ];

  const storyTypeOptions = [
    { value: '', label: 'Tüm Türler' },
    { value: 'personal', label: 'Kişisel Hikaye' },
    { value: 'community', label: 'Topluluk Projesi' },
    { value: 'project', label: 'Proje Deneyimi' },
    { value: 'campaign', label: 'Kampanya' },
    { value: 'research', label: 'Araştırma' }
  ];

  // Fetch voices
  const fetchVoices = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sort: sortBy,
        order: sortOrder
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (storyTypeFilter) params.append('storyType', storyTypeFilter);

      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/voices?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: ApiResponse = await response.json();

      if (response.status === 401) {
        // Token geçersiz, logout yap
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin');
        return;
      }

      if (data.success) {
        // Set ownership flag for each voice
        const voicesWithOwnership = (data.data || []).map((voice: Voice) => ({
          ...voice,
          isOwnedByCurrentUser: user?.id === voice.userId
        }));
        
        setVoices(voicesWithOwnership);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        showToast('Error loading voices', 'error');
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
      showToast('Error loading voices', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Yetki kontrolü
  useEffect(() => {
    if (!hasPermission('voices.view')) {
      router.push('/admin');
      return;
    }
  }, [hasPermission, router]);

  // Verileri çek
  useEffect(() => {
    if (hasPermission('voices.view')) {
      fetchVoices();
    }
  }, [currentPage, searchQuery, statusFilter, categoryFilter, storyTypeFilter, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVoices();
  };

  // Delete voice
  const handleDelete = async (id: string) => {
    if (!confirm('Bu hikayeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/voices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        showToast('Voice deleted successfully', 'success');
        fetchVoices();
      } else {
        showToast(data.message || 'Error deleting voice', 'error');
      }
    } catch (error) {
      console.error('Error deleting voice:', error);
      showToast('Error deleting voice', 'error');
    }
  };

  // Bulk operations
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedVoices.length === 0) {
      showToast('Please select voices first', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const promises = selectedVoices.map(id => 
        fetch(`/api/admin/voices/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        })
      );

      await Promise.all(promises);
      showToast(`${selectedVoices.length} voices updated successfully`, 'success');
      setSelectedVoices([]);
      fetchVoices();
    } catch (error) {
      console.error('Error updating voices:', error);
      showToast('Error updating voices', 'error');
    }
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedVoices.length === voices.length) {
      setSelectedVoices([]);
    } else {
      setSelectedVoices(voices.map(v => v._id));
    }
  };

  const handleSelectVoice = (id: string) => {
    setSelectedVoices(prev => 
      prev.includes(id) 
        ? prev.filter(voiceId => voiceId !== id)
        : [...prev, id]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      archived: 'bg-purple-100 text-purple-800'
    };

    const labels = {
      draft: 'Taslak',
      submitted: 'Gönderildi',
      reviewed: 'İncelendi',
      published: 'Yayınlandı',
      rejected: 'Reddedildi',
      archived: 'Arşivlendi'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AdminLayout>
      <Head>
        <title>Voices Management | Beyond2C Admin</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sesler & Hikayeler</h1>
            <p className="text-gray-600">Gençlerin iklim hikayelerini yönetin</p>
          </div>
          
          <button
            onClick={() => router.push('/admin/voices/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Yeni Hikaye Ekle
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ara
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Başlık, yazar, içerik..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hikaye Türü
                </label>
                <select
                  value={storyTypeFilter}
                  onChange={(e) => setStoryTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {storyTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Filtrele
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setCategoryFilter('');
                  setStoryTypeFilter('');
                  setCurrentPage(1);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Temizle
              </button>
            </div>
          </form>
        </div>

        {/* Bulk Actions */}
        {selectedVoices.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedVoices.length} hikaye seçildi
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusChange('published')}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  Yayınla
                </button>
                <button
                  onClick={() => handleBulkStatusChange('reviewed')}
                  className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors text-sm"
                >
                  İncelendi İşaretle
                </button>
                <button
                  onClick={() => handleBulkStatusChange('rejected')}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Reddet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voices Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Hikayeler ({total})
              </h2>
              
              <div className="flex items-center gap-2">
                <select
                  value={`${sortBy}_${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('_');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt_desc">En Yeni</option>
                  <option value="createdAt_asc">En Eski</option>
                  <option value="title_asc">Başlık A-Z</option>
                  <option value="title_desc">Başlık Z-A</option>
                  <option value="views_desc">En Çok Görüntülenen</option>
                  <option value="likes_desc">En Çok Beğenilen</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Hikayeler yükleniyor...</p>
            </div>
          ) : voices.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Henüz hikaye bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedVoices.length === voices.length && voices.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hikaye
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yazar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İstatistikler
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voices.map((voice) => (
                    <tr key={voice._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedVoices.includes(voice._id)}
                          onChange={() => handleSelectVoice(voice._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">
                                {voice.title}
                              </div>
                              {voice.isOwnedByCurrentUser && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Sizin
                                </span>
                              )}
                              {voice.featured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  ⭐ Öne Çıkan
                                </span>
                              )}
                            </div>
                            {voice.excerpt && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {voice.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{voice.author.name}</div>
                        {voice.author.location.city && (
                          <div className="text-sm text-gray-500">
                            {voice.author.location.city}
                            {voice.author.location.region && `, ${voice.author.location.region}`}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{voice.category}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {storyTypeOptions.find(t => t.value === voice.storyType)?.label || voice.storyType}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(voice.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          👁️ {voice.views} • ❤️ {voice.likes}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(voice.submittedAt)}
                        </div>
                        {voice.publishedAt && (
                          <div className="text-sm text-gray-500">
                            Yayın: {formatDate(voice.publishedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/voices/${voice._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Görüntüle"
                          >
                            👁️
                          </button>
                          {(voice.isOwnedByCurrentUser || user?.role === 'admin') && (
                            <button
                              onClick={() => router.push(`/admin/voices/edit/${voice._id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Düzenle"
                            >
                              ✏️
                            </button>
                          )}
                          {(voice.isOwnedByCurrentUser || user?.role === 'admin') && (
                            <button
                              onClick={() => handleDelete(voice._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Sayfa {currentPage} / {totalPages} ({total} hikaye)
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVoicesListPage;
