import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

// ReactQuill'i dinamik olarak import et (SSR sorunlarını önlemek için)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 animate-pulse rounded-md" />
});

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

interface BlogEditorProps {
  initialData?: Partial<BlogFormData>;
  onSave: (data: BlogFormData) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
  mode?: 'create' | 'edit';
}

export default function AdvancedBlogEditor({ 
  initialData, 
  onSave, 
  onCancel, 
  saving = false, 
  mode = 'create' 
}: BlogEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      category: initialData?.category || '',
      tags: initialData?.tags || '',
      featuredImage: initialData?.featuredImage || '',
      status: initialData?.status || 'draft',
      publishedAt: initialData?.publishedAt || '',
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      metaKeywords: initialData?.metaKeywords || [],
      featured: initialData?.featured || false,
    },
  });

  const [content, setContent] = useState(initialData?.content || '');
  const [showSeoOptions, setShowSeoOptions] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialData?.metaKeywords || []);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch form values
  const watchTitle = watch('title');
  const watchMetaTitle = watch('metaTitle');
  const watchMetaDescription = watch('metaDescription');

  // Slug oluşturma fonksiyonu
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Okuma süresi hesaplama
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Title değiştiğinde otomatik slug oluştur
  useEffect(() => {
    if (watchTitle && !initialData?.slug) {
      const autoSlug = createSlug(watchTitle);
      setValue('slug', autoSlug);
    }
  }, [watchTitle, setValue, initialData?.slug]);

  // Keyword ekleme
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      setValue('metaKeywords', newKeywords);
      setKeywordInput('');
    }
  };

  // Keyword silme
  const removeKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    setValue('metaKeywords', newKeywords);
  };

  // Gerçek dosya yükleme işlevi
  const handleImageUpload = async () => {
    if (!imageFile) {
      setImageUploadError('Lütfen bir görsel seçin');
      return;
    }

    try {
      setImageUploadError(null);
      setImageUploadProgress(0);

      const formData = new FormData();
      formData.append('image', imageFile);

      // Upload API'sine XMLHttpRequest ile progress tracking
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setImageUploadProgress(percentComplete);
        }
      });

      // Upload completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setValue('featuredImage', response.url);
          setImageUploadProgress(null);
          setImageFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          throw new Error('Upload failed');
        }
      });

      // Error handling
      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      // Start upload
      xhr.open('POST', '/api/admin/upload/blog-cover');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setImageUploadError('Görsel yükleme başarısız');
      setImageUploadProgress(null);
    }
  };

  // Form submit
  const handleFormSubmit = async (data: BlogFormData) => {
    try {
      const readingTime = calculateReadingTime(content);
      
      // Clean content from HTML tags for meta description
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      
      const finalData = {
        ...data,
        content,
        readingTime,
        metaKeywords: keywords || [],
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || cleanContent.substring(0, 160),
        featuredImage: data.featuredImage || '',
        tags: typeof data.tags === 'string' ? data.tags : ''
      };

      console.log('Form data being submitted:', finalData);
      await onSave(finalData);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  const categories = [
    'İklim Değişikliği',
    'Sürdürülebilirlik',
    'Çevre Teknolojileri',
    'Yenilenebilir Enerji',
    'Çevre Koruma',
    'Aktivizm',
    'Eğitim',
    'Araştırma',
    'Politika',
    'İnovasyon'
  ];

  // Quill modülleri
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Temel Bilgiler */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            📋 Temel Bilgiler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Başlık gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                placeholder="Blog yazısının başlığını girin"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                id="category"
                {...register('category', { required: 'Kategori gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
          </div>

          {/* Post Durumu ve Öne Çıkarma */}
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                id="status"
                {...register('status')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              >
                <option value="published">🌟 Yayınlanmış</option>
                <option value="draft">📝 Taslak</option>
                <option value="archived">📦 Arşivlenmiş</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                ⭐ Öne Çıkarılmış Yazı
              </label>
            </div>
          </div>
        </div>

        {/* URL ve Slug Ayarları */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🔗 URL Ayarları
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Otomatik Oluşturulan URL:
            </label>
            <div className="p-2 bg-gray-100 rounded text-sm text-gray-600">
              /blog/{watch('slug') || 'yazı-url-buraya-gelecek'}
            </div>
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              id="slug"
              {...register('slug', { required: 'Slug gereklidir' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-gray-500 mt-1">
              SEO için önemli: kısa, açıklayıcı ve tire ile ayrılmış kelimeler kullanın
            </p>
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        {/* SEO Ayarları */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              🚀 SEO Ayarları
            </h2>
            <button
              type="button"
              onClick={() => setShowSeoOptions(!showSeoOptions)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {showSeoOptions ? 'Gizle' : 'Göster'}
            </button>
          </div>

          {showSeoOptions && (
            <div className="space-y-4">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Başlık (60 karakter önerilir)
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  {...register('metaTitle')}
                  maxLength={60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Google arama sonuçlarında görünecek başlık"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {watchMetaTitle?.length || 0}/60 karakter
                </div>
              </div>
              
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Açıklama (160 karakter önerilir)
                </label>
                <textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Google arama sonuçlarında görünecek açıklama"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {watchMetaDescription?.length || 0}/160 karakter
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anahtar Kelimeler
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Anahtar kelime ekle"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Görsel Yükleme */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🖼️ Kapak Görseli
          </h2>
          
          <div className="border-4 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    setImageUploadError(null);
                  }}
                  className="flex-1 text-gray-900"
                />
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || imageUploadProgress !== null}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all"
                >
                  {imageUploadProgress !== null ? 'Yükleniyor...' : 'Görsel Yükle'}
                </button>
              </div>
              
              {imageUploadProgress !== null && (
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Yükleniyor...</span>
                    <span>{imageUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${imageUploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {imageUploadError && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {imageUploadError}
              </div>
            )}
            
            {watch('featuredImage') && (
              <div className="mt-4">
                <img
                  src={watch('featuredImage')}
                  alt="Kapak görseli"
                  className="w-full h-72 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue('featuredImage', '');
                    setImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Görseli Kaldır
                </button>
              </div>
            )}
          </div>
        </div>

        {/* İçerik Editörü */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            ✍️ İçerik
          </h2>
          
          <div className="mb-4">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Özet
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              placeholder="Blog yazısının kısa özeti..."
            />
          </div>

          <div className="h-80 mb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="h-72"
              placeholder="Harika bir içerik yazın..."
              style={{
                color: '#111827'
              }}
            />
          </div>
        </div>

        {/* İşlem Butonları */}
        <div className="flex gap-4 justify-end bg-white p-6 rounded-lg shadow-md">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSubmit((data) => handleFormSubmit({ ...data, status: 'draft' }))}
            disabled={isSubmitting || saving}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {(isSubmitting || saving) ? '📝 Kaydediliyor...' : '📝 Taslak Kaydet'}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || saving}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all"
          >
            {(isSubmitting || saving) ? '🚀 Kaydediliyor...' : (mode === 'edit' ? '✅ Güncelle' : '🚀 Yayınla')}
          </button>
        </div>
      </form>
    </div>
  );
}
