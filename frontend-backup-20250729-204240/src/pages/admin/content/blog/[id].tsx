import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdvancedBlogEditor from '@/components/admin/content/AdvancedBlogEditor';
import { useToast } from '@/context/ToastContext';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  featured?: boolean;
  readingTime?: number;
}

const EditBlogPostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToast } = useToast();
  const [post, setPost] = useState<BlogFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blog yazısını getir
  useEffect(() => {
    const fetchPost = async () => {
      if (!id || typeof id !== 'string') return;

      setLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`/api/admin/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (data.success) {
          // API'den gelen veriyi BlogFormData formatına dönüştür
          const blogData: BlogFormData = {
            title: data.data.title || '',
            slug: data.data.slug || '',
            content: data.data.content || '',
            excerpt: data.data.excerpt || '',
            category: data.data.category || 'genel',
            tags: Array.isArray(data.data.tags) ? data.data.tags.join(', ') : (data.data.tags || ''),
            status: data.data.status || 'draft',
            publishedAt: data.data.publishedAt || '',
            featuredImage: data.data.featuredImage || '',
            metaTitle: data.data.metaTitle || data.data.title || '',
            metaDescription: data.data.metaDescription || data.data.excerpt || '',
            metaKeywords: Array.isArray(data.data.metaKeywords) ? data.data.metaKeywords : [],
            readingTime: data.data.readingTime || 0,
            featured: data.data.featured || false
          };
          setPost(blogData);
        } else {
          setError(data.error || 'Blog yazısı bulunamadı');
        }
      } catch (error) {
        console.error('Blog yazısı yüklenirken hata:', error);
        setError('Blog yazısı yüklenirken hata oluştu');
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  // Blog yazısını güncelle
  const handleSubmit = async (data: BlogFormData) => {
    if (!id || typeof id !== 'string') return;

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      // Tags'i array'e dönüştür
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
      
      // Veriyi temizle ve doğrula
      const payload = {
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        category: data.category || 'genel',
        tags: tagsArray,
        status: data.status || 'draft',
        publishedAt: data.status === 'published' && !data.publishedAt 
          ? new Date().toISOString() 
          : data.publishedAt,
        updatedAt: new Date().toISOString(),
        featuredImage: data.featuredImage || '',
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: Array.isArray(data.metaKeywords) ? data.metaKeywords : [],
        readingTime: data.readingTime || 0,
        featured: Boolean(data.featured)
      };

      console.log('Payload being sent:', payload);
      
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.success) {
        addToast({
          type: 'success',
          title: 'Başarılı',
          message: 'Blog yazısı başarıyla güncellendi!'
        });
        router.push('/admin/blog-management');
      } else {
        addToast({
          type: 'error',
          title: 'Hata',
          message: result.error || 'Blog yazısı güncellenirken hata oluştu'
        });
      }
    } catch (error: any) {
      console.error('Blog yazısı güncellenirken hata:', error);
      
      let errorMessage = 'Blog yazısı güncellenirken hata oluştu';
      if (error.message && error.message.includes('string did not match')) {
        errorMessage = 'Veri formatında hata var. Lütfen tüm alanları kontrol edin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addToast({
        type: 'error',
        title: 'Hata',
        message: errorMessage
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-indigo-600">Blog yazısı yükleniyor...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !post) {
    return (
      <AdminLayout>
        <Head>
          <title>Hata | Beyond2C Admin</title>
        </Head>
        
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Blog yazısı yüklenemedi
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error || 'Blog yazısı bulunamadı veya erişim izni yok'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => router.push('/admin/blog-management')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Blog Yazılarına Dön
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Blog Yazısı Düzenle | Beyond2C Admin</title>
      </Head>
      
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Blog Yazısı Düzenle</h1>
              <p className="mt-1 text-sm text-gray-500">
                {post.title || 'Başlıksız yazı'}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/blog-management')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Geri
              </button>
            </div>
          </div>

          <AdvancedBlogEditor 
            initialData={post}
            onSave={handleSubmit}
            saving={saving}
            mode="edit"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBlogPostPage;