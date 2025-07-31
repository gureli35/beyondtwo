import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import slugify from 'slugify';
import readingTime from 'reading-time';
import DOMPurify from 'dompurify';
import { MediaSelector } from './MediaSelector';
import { useToast } from '../ui/ToastProvider';

const blogSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
  slug: z.string().min(3, 'Slug en az 3 karakter olmalıdır').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug geçerli bir format olmalıdır'),
  content: z.string().min(50, 'İçerik en az 50 karakter olmalıdır'),
  excerpt: z.string().max(250, 'Özet en fazla 250 karakter olabilir').optional(),
  category: z.string().min(1, 'Kategori seçilmelidir'),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().optional(),
  // SEO fields
  metaTitle: z.string().max(60, 'Meta başlık 60 karakteri geçmemelidir').optional(),
  metaDescription: z.string().max(160, 'Meta açıklama 160 karakteri geçmemelidir').optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().url('Geçerli bir URL olmalıdır').optional().or(z.literal('')),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  post?: {
    id?: string;
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
    keywords?: string;
    canonicalUrl?: string;
  };
  onSubmit: (data: BlogFormData) => void;
}

export function BlogEditor({ post, onSubmit }: BlogEditorProps) {
  const isEditing = !!post?.id;
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  const { showToast } = useToast();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      excerpt: post?.excerpt || '',
      category: post?.category || '',
      tags: post?.tags || '',
      featuredImage: post?.featuredImage || '',
      status: post?.status || 'draft',
      publishedAt: post?.publishedAt || '',
      metaTitle: post?.metaTitle || '',
      metaDescription: post?.metaDescription || '',
      keywords: post?.keywords || '',
      canonicalUrl: post?.canonicalUrl || '',
    },
  });

  // Watch fields for auto-generation
  const title = watch('title');
  const content = watch('content');
  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');

  // Calculate reading time
  const readingStats = useMemo(() => {
    if (!content) return { text: '0 dk okuma', minutes: 0, words: 0 };
    const stats = readingTime(content);
    return {
      text: `${Math.ceil(stats.minutes)} dk okuma`,
      minutes: Math.ceil(stats.minutes),
      words: stats.words
    };
  }, [content]);

  // Auto-generate slug from title
  const generateSlug = () => {
    if (!title) {
      showToast('warning', 'Slug oluşturmak için başlık girmeniz gerekiyor');
      return;
    }
    
    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'tr'
    });
    
    setValue('slug', slug);
    showToast('success', 'Slug başarıyla oluşturuldu');
  };

  // Auto-generate SEO fields
  const generateSeoFields = () => {
    if (!title || !content) {
      showToast('warning', 'SEO alanları oluşturmak için başlık ve içerik girmeniz gerekiyor');
      return;
    }

    // Generate meta title if empty
    if (!metaTitle) {
      setValue('metaTitle', title.length > 60 ? title.substring(0, 57) + '...' : title);
    }

    // Generate meta description if empty
    if (!metaDescription) {
      const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
      const description = cleanContent.length > 160 
        ? cleanContent.substring(0, 157) + '...' 
        : cleanContent;
      setValue('metaDescription', description);
    }

    showToast('success', 'SEO alanları başarıyla oluşturuldu');
  };

  // Auto-generate excerpt from content
  const generateExcerpt = () => {
    if (!content) {
      showToast('warning', 'Özet oluşturmak için içerik girmeniz gerekiyor');
      return;
    }

    const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    const excerpt = cleanContent.length > 250 
      ? cleanContent.substring(0, 247) + '...' 
      : cleanContent;
    
    setValue('excerpt', excerpt);
    showToast('success', 'Özet başarıyla oluşturuldu');
  };
  
  const categoryOptions = [
    { value: 'iklim', label: 'İklim' },
    { value: 'enerji', label: 'Enerji' },
    { value: 'aktivizm', label: 'Aktivizm' },
    { value: 'yasam', label: 'Yaşam' },
    { value: 'politika', label: 'Politika' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Main Content Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Başlık
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="title"
                {...register('title')}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                /blog/
              </span>
              <input
                type="text"
                id="slug"
                {...register('slug')}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-900"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Oluştur
              </button>
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik
            </label>
            <div className="border border-gray-300 rounded-md">
              <textarea
                {...register('content')}
                rows={20}
                className="w-full px-3 py-2 border-0 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                placeholder="Markdown formatında içerik yazın..."
              />
            </div>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>{readingStats.text} • {readingStats.words} kelime</span>
              <span>Son güncelleme: {new Date().toLocaleString('tr-TR')}</span>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Özet
              </label>
              <button
                type="button"
                onClick={generateExcerpt}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Otomatik Oluştur
              </button>
            </div>
            <div className="mt-1">
              <textarea
                id="excerpt"
                rows={3}
                {...register('excerpt')}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                placeholder="Kısa bir özet yazın veya otomatik oluşturun..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Bu metin, blog listeleme sayfalarında görünecektir.
            </p>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Kategori
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  {...register('category')}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                >
                  <option value="">Kategori Seçin</option>
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Etiketler
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="tags"
                  {...register('tags')}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  placeholder="iklim, enerji, aktivizm"
                />
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Etiketleri virgülle ayırın.
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <MediaSelector 
              label="Öne Çıkan Görsel"
              value={watch('featuredImage')}
              onChange={(url) => setValue('featuredImage', url)}
            />
          </div>

          {/* Status and Publish Date */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Durum
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  {...register('status')}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayınla</option>
                  <option value="archived">Arşivle</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
                Yayın Tarihi
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  id="publishedAt"
                  {...register('publishedAt')}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                />
                {errors.publishedAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.publishedAt.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Panel */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              SEO Ayarları
            </h3>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={generateSeoFields}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Otomatik Oluştur
              </button>
              <button
                type="button"
                onClick={() => setShowSeoPanel(!showSeoPanel)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showSeoPanel ? 'Gizle' : 'Göster'}
              </button>
            </div>
          </div>

          {showSeoPanel && (
            <div className="space-y-6">
              {/* Meta Title */}
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                  Meta Başlık
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="metaTitle"
                    {...register('metaTitle')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                    placeholder="SEO için optimize edilmiş başlık"
                  />
                  {errors.metaTitle && (
                    <p className="mt-1 text-sm text-red-600">{errors.metaTitle.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {metaTitle?.length || 0}/60 karakter
                  </p>
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                  Meta Açıklama
                </label>
                <div className="mt-1">
                  <textarea
                    id="metaDescription"
                    rows={3}
                    {...register('metaDescription')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                    placeholder="Arama sonuçlarında görünecek açıklama"
                  />
                  {errors.metaDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.metaDescription.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {metaDescription?.length || 0}/160 karakter
                  </p>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Anahtar Kelimeler
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="keywords"
                    {...register('keywords')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                    placeholder="anahtar, kelime, listesi"
                  />
                  {errors.keywords && (
                    <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Anahtar kelimeleri virgülle ayırın.
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700">
                  Canonical URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="canonicalUrl"
                    {...register('canonicalUrl')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                    placeholder="https://example.com/canonical-url"
                  />
                  {errors.canonicalUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.canonicalUrl.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  İçeriğin orijinal URL'si (opsiyonel).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {isEditing ? 'Düzenleniyor' : 'Yeni yazı oluşturuluyor'}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Önizle
            </button>
            <button
              type="button"
              onClick={() => setValue('status', 'draft')}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Taslak Kaydet
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Yayınla')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
