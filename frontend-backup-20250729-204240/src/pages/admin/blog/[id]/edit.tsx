import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdvancedBlogEditor from '@/components/admin/content/AdvancedBlogEditor';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/context/ToastContext';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
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
  viewCount: number;
  featured: boolean;
}

const EditBlogPost: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAdminAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      
      // API'den blog yazısını getir
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/blogs/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
      } else {
        throw new Error(data.error || 'Blog yazısı bulunamadı');
      }
    } catch (error: any) {
      console.error('Blog yazısı yüklenirken hata:', error);
      addToast({
        type: 'error',
        title: 'Hata',
        message: error.message || 'Blog yazısı yüklenirken hata oluştu'
      });
      router.push('/admin/blog-management');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      
      // API'ye güncelleme isteği gönder
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _id: id,
          tags: Array.isArray(formData.tags) 
            ? formData.tags 
            : formData.tags?.split(',').map((tag: string) => tag.trim()) || []
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Blog yazısı güncellendi:', data.data);
        addToast({
          type: 'success',
          title: 'Başarılı',
          message: 'Blog yazısı başarıyla güncellendi'
        });
        
        // Güncellenen veriyi state'e kaydet
        setPost(data.data);
      } else {
        throw new Error(data.error || 'Blog güncellenirken bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Blog yazısı güncellenirken hata:', error);
      addToast({
        type: 'error',
        title: 'Hata',
        message: error.message || 'Blog yazısı güncellenirken hata oluştu'
      });
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
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500">Blog yazısı yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog yazısı bulunamadı</h2>
            <p className="text-gray-500 mb-6">Aradığınız blog yazısı mevcut değil.</p>
            <button
              onClick={() => router.push('/admin/blog-management')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Blog Yönetimine Dön
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Blog Yazısı Düzenle - {post.title} | Beyond2C Admin</title>
        <meta name="description" content="Beyond2C admin paneli - Blog yazısı düzenleme" />
      </Head>
      
      <AdminLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">✏️ Blog Yazısı Düzenle</h1>
            <p className="mt-2 text-gray-600 text-center">
              "{post.title}" yazısını gelişmiş editör ile düzenleyin
            </p>
          </div>

          <AdvancedBlogEditor
            initialData={{
              ...post,
              tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
            mode="edit"
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default EditBlogPost;
