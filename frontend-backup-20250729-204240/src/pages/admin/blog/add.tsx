import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdvancedBlogEditor from '@/components/admin/content/AdvancedBlogEditor';
import { useToast } from '@/components/admin/ui/ToastProvider';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  readingTime: number;
  featured: boolean;
}

const AddBlogPost: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Template data for new blog post
  const templateData: Partial<BlogFormData> = {
    title: '',
    slug: '',
    content: `<h1>Blog yazınızın başlığı</h1>

<p>Giriş paragrafınızı buraya yazın. Bu paragraf okuyucuları konuya hazırlar.</p>

<h2>Ana Konu 1</h2>

<p>İçeriğinizin ilk ana bölümünü burada geliştirin:</p>

<ul>
<li>İlk önemli nokta</li>
<li>İkinci önemli nokta</li>
<li>Üçüncü önemli nokta</li>
</ul>

<h2>Ana Konu 2</h2>

<p>İçeriğinizin ikinci ana bölümünü burada geliştirin.</p>

<blockquote>
<p><strong>Pro İpucu:</strong> Okuyucularınız için değerli bilgiler paylaşmayı unutmayın.</p>
</blockquote>

<h2>Sonuç</h2>

<p>Yazınızı güçlü bir sonuçla bitirin ve okuyucularınızı eyleme geçmeye teşvik edin.</p>`,
    excerpt: 'Blog yazınızın kısa ve öz bir açıklamasını buraya yazın...',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    publishedAt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    featured: false,
    readingTime: 0
  };

  useEffect(() => {
    // Initialize editor
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      
      // Token'ı localStorage'dan al
      const token = localStorage.getItem('admin_token');
      if (!token) {
        showToast('error', '❌ Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/admin/login');
        return;
      }
      
      // API'ye istek at
      const response = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: formData.status || 'draft',
          tags: Array.isArray(formData.tags) 
            ? formData.tags 
            : formData.tags?.split(',').map((tag: string) => tag.trim()) || []
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Yeni blog yazısı oluşturuldu:', data.data);
        showToast('success', '🎉 Blog yazısı başarıyla oluşturuldu!');
        
        // Blog management sayfasına geri dön
        router.push('/admin/blog-management');
      } else {
        throw new Error(data.error || 'Blog oluşturulurken bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Blog oluşturma hatası:', error);
      showToast('error', `❌ ${error.message || 'Blog yazısı oluşturulurken bir hata oluştu.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog-management');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500">Blog editörü hazırlanıyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Yeni Blog Yazısı Oluştur | Beyond2C Admin</title>
        <meta name="description" content="Beyond2C admin paneli - Yeni blog yazısı oluştur" />
      </Head>
      
      <AdminLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">📝 Gelişmiş Blog Yazısı Oluştur</h1>
            <p className="mt-2 text-gray-600 text-center">
              Kapsamlı editör ile profesyonel blog yazıları oluşturun
            </p>
          </div>

          <AdvancedBlogEditor
            initialData={templateData}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
            mode="create"
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default AddBlogPost;
