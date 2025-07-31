import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdvancedVoiceEditor from '@/components/admin/content/AdvancedVoiceEditor';
import { useToast } from '@/context/ToastContext';

interface VoiceFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  featuredImage?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published' | 'rejected' | 'archived';
  storyType: 'personal' | 'community' | 'project' | 'campaign' | 'research';
  author: {
    name: string;
    age?: number;
    location: {
      city?: string;
      region?: string;
      country?: string;
    };
    bio?: string;
    image?: string;
  };
  impact?: {
    description?: string;
    metrics?: Array<{
      name: string;
      value: string;
      unit: string;
    }>;
    beneficiaries?: number;
    timeframe?: string;
  };
  callToAction?: string;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    social?: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
  };
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  allowComments?: boolean;
  allowSharing?: boolean;
  showAuthorContact?: boolean;
  featured?: boolean;
  publishedAt?: string;
  language?: 'tr' | 'en';
  readingTime?: number;
}

const AdminVoiceEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();
  
  const [voice, setVoice] = useState<VoiceFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch voice data
  useEffect(() => {
    if (!id) return;

    const fetchVoice = async () => {
      try {
        setLoading(true);
        console.log('Fetching voice with ID:', id);
        
        const response = await fetch(`/api/admin/voices/${id}`);
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (data.success) {
          // Transform the data to match form structure
          const voiceData = data.data;
          setVoice({
            title: voiceData.title || '',
            slug: voiceData.slug || '',
            content: voiceData.content || '',
            excerpt: voiceData.excerpt || '',
            category: voiceData.category || 'Youth',
            tags: Array.isArray(voiceData.tags) ? voiceData.tags.join(', ') : voiceData.tags || '',
            featuredImage: voiceData.featuredImage || '',
            status: voiceData.status || 'submitted',
            storyType: voiceData.storyType || 'personal',
            author: {
              name: voiceData.author?.name || '',
              age: voiceData.author?.age,
              location: {
                city: voiceData.author?.location?.city || '',
                region: voiceData.author?.location?.region || '',
                country: voiceData.author?.location?.country || 'Turkey'
              },
              bio: voiceData.author?.bio || '',
              image: voiceData.author?.image || ''
            },
            impact: {
              description: voiceData.impact?.description || '',
              metrics: voiceData.impact?.metrics || [],
              beneficiaries: voiceData.impact?.beneficiaries,
              timeframe: voiceData.impact?.timeframe || ''
            },
            callToAction: voiceData.callToAction || '',
            contact: {
              email: voiceData.contact?.email || '',
              phone: voiceData.contact?.phone || '',
              website: voiceData.contact?.website || '',
              social: {
                instagram: voiceData.contact?.social?.instagram || '',
                twitter: voiceData.contact?.social?.twitter || '',
                linkedin: voiceData.contact?.social?.linkedin || '',
                youtube: voiceData.contact?.social?.youtube || ''
              }
            },
            metaTitle: voiceData.metaTitle || '',
            metaDescription: voiceData.metaDescription || '',
            metaKeywords: voiceData.metaKeywords || [],
            allowComments: voiceData.allowComments !== false,
            allowSharing: voiceData.allowSharing !== false,
            showAuthorContact: voiceData.showAuthorContact || false,
            featured: voiceData.featured || false,
            publishedAt: voiceData.publishedAt || '',
            language: voiceData.language || 'tr',
            readingTime: voiceData.readingTime || 0
          });
        } else {
          showToast(data.message || 'Error loading voice/story', 'error');
          router.push('/admin/voices');
        }
      } catch (error) {
        console.error('Error fetching voice:', error);
        showToast('Error loading voice/story', 'error');
        router.push('/admin/voices');
      } finally {
        setLoading(false);
      }
    };

    fetchVoice();
  }, [id, router, showToast]);

  const handleSave = async (data: VoiceFormData) => {
    try {
      setSaving(true);

      const response = await fetch(`/api/admin/voices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        showToast('Voice/Story updated successfully!', 'success');
        // Update local state with new data
        setVoice(data);
      } else {
        showToast(result.message || 'Error updating voice/story', 'error');
      }
    } catch (error) {
      console.error('Error updating voice:', error);
      showToast('Error updating voice/story', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/voices');
  };

  const handleDelete = async () => {
    if (!confirm('Bu hikayeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/voices/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        showToast('Voice/Story deleted successfully!', 'success');
        router.push('/admin/voices');
      } else {
        showToast(result.message || 'Error deleting voice/story', 'error');
      }
    } catch (error) {
      console.error('Error deleting voice:', error);
      showToast('Error deleting voice/story', 'error');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Hikaye yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!voice) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hikaye Bulunamadı</h1>
          <p className="text-gray-600 mb-6">İstediğiniz hikaye mevcut değil.</p>
          <button
            onClick={() => router.push('/admin/voices')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Hikayeler Listesine Dön
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Voice | Beyond2C Admin</title>
      </Head>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hikaye Düzenle</h1>
            <p className="text-gray-600">{voice.title}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            >
              🗑️ Sil
            </button>
            
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              ← Geri Dön
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Hızlı İşlemler:</span>
              
              {voice.status !== 'published' && (
                <button
                  onClick={() => handleSave({ ...voice, status: 'published' })}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  📢 Yayınla
                </button>
              )}
              
              {voice.status === 'submitted' && (
                <button
                  onClick={() => handleSave({ ...voice, status: 'reviewed' })}
                  className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                >
                  ✅ İncelendi İşaretle
                </button>
              )}
              
              <button
                onClick={() => handleSave({ ...voice, featured: !voice.featured })}
                className={`px-3 py-1 rounded-md transition-colors text-sm ${
                  voice.featured 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {voice.featured ? '⭐ Öne Çıkarılmış' : '☆ Öne Çıkar'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Durum:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                voice.status === 'published' ? 'bg-green-100 text-green-800' :
                voice.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                voice.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                voice.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {voice.status === 'published' ? 'Yayınlandı' :
                 voice.status === 'reviewed' ? 'İncelendi' :
                 voice.status === 'submitted' ? 'Gönderildi' :
                 voice.status === 'rejected' ? 'Reddedildi' :
                 voice.status === 'archived' ? 'Arşivlendi' : 'Taslak'}
              </span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <AdvancedVoiceEditor
          mode="edit"
          initialData={voice}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminVoiceEditPage;
