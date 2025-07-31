import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

// ReactQuill'i dinamik olarak import et (SSR sorunlarını önlemek için)
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-72 bg-gray-100 animate-pulse rounded-md" />
});

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
  // Author information
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
  // Impact data
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
  // Contact information
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
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  // Settings
  allowComments?: boolean;
  allowSharing?: boolean;
  showAuthorContact?: boolean;
  featured?: boolean;
  publishedAt?: string;
  language?: 'tr' | 'en';
  readingTime?: number;
}

interface VoiceEditorProps {
  initialData?: Partial<VoiceFormData>;
  onSave: (data: VoiceFormData) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
  mode?: 'create' | 'edit';
}

export default function AdvancedVoiceEditor({ 
  initialData, 
  onSave, 
  onCancel, 
  saving = false, 
  mode = 'create' 
}: VoiceEditorProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VoiceFormData>({
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      category: initialData?.category || 'Youth',
      tags: initialData?.tags || '',
      featuredImage: initialData?.featuredImage || '',
      status: initialData?.status || 'submitted',
      storyType: initialData?.storyType || 'personal',
      author: {
        name: initialData?.author?.name || '',
        age: initialData?.author?.age || undefined,
        location: {
          city: initialData?.author?.location?.city || '',
          region: initialData?.author?.location?.region || '',
          country: initialData?.author?.location?.country || 'Turkey'
        },
        bio: initialData?.author?.bio || '',
        image: initialData?.author?.image || ''
      },
      impact: {
        description: initialData?.impact?.description || '',
        metrics: initialData?.impact?.metrics || [],
        beneficiaries: initialData?.impact?.beneficiaries || undefined,
        timeframe: initialData?.impact?.timeframe || ''
      },
      callToAction: initialData?.callToAction || '',
      contact: {
        email: initialData?.contact?.email || '',
        phone: initialData?.contact?.phone || '',
        website: initialData?.contact?.website || '',
        social: {
          instagram: initialData?.contact?.social?.instagram || '',
          twitter: initialData?.contact?.social?.twitter || '',
          linkedin: initialData?.contact?.social?.linkedin || '',
          youtube: initialData?.contact?.social?.youtube || ''
        }
      },
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
      metaKeywords: initialData?.metaKeywords || [],
      allowComments: initialData?.allowComments !== false,
      allowSharing: initialData?.allowSharing !== false,
      showAuthorContact: initialData?.showAuthorContact || false,
      featured: initialData?.featured || false,
      language: initialData?.language || 'tr'
    },
  });

  const [content, setContent] = useState(initialData?.content || '');
  const [showSeoOptions, setShowSeoOptions] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [showImpactMetrics, setShowImpactMetrics] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialData?.metaKeywords || []);
  const [impactMetrics, setImpactMetrics] = useState(initialData?.impact?.metrics || []);
  
  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch form values
  const watchTitle = watch('title');
  const watchMetaTitle = watch('metaTitle');
  const watchMetaDescription = watch('metaDescription');

  // Slug creation function
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

  // Reading time calculation
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (watchTitle && !initialData?.slug) {
      const autoSlug = createSlug(watchTitle);
      setValue('slug', autoSlug);
    }
  }, [watchTitle, setValue, initialData?.slug]);

  // Keyword management
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()];
      setKeywords(newKeywords);
      setValue('metaKeywords', newKeywords);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const newKeywords = keywords.filter(k => k !== keyword);
    setKeywords(newKeywords);
    setValue('metaKeywords', newKeywords);
  };

  // Impact metrics management
  const addImpactMetric = () => {
    const newMetric = { name: '', value: '', unit: '' };
    const newMetrics = [...impactMetrics, newMetric];
    setImpactMetrics(newMetrics);
    setValue('impact.metrics', newMetrics);
  };

  const updateImpactMetric = (index: number, field: string, value: string) => {
    const newMetrics = [...impactMetrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setImpactMetrics(newMetrics);
    setValue('impact.metrics', newMetrics);
  };

  const removeImpactMetric = (index: number) => {
    const newMetrics = impactMetrics.filter((_, i) => i !== index);
    setImpactMetrics(newMetrics);
    setValue('impact.metrics', newMetrics);
  };

  // Image upload handling
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

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setImageUploadProgress(percentComplete);
        }
      });

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

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed');
      });

      xhr.open('POST', '/api/admin/upload/voice-image');
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      setImageUploadError('Görsel yükleme başarısız');
      setImageUploadProgress(null);
    }
  };

  // Mock image upload for demo purposes
  const handleMockImageUpload = () => {
    setImageUploadProgress(0);
    const interval = setInterval(() => {
      setImageUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          // Generate a mock Unsplash URL
          const mockImageUrl = `https://images.unsplash.com/photo-${Date.now() % 10000000000000}?w=800&h=600&fit=crop&crop=face`;
          setValue('featuredImage', mockImageUrl);
          setImageFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setTimeout(() => setImageUploadProgress(null), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Form submit
  const handleFormSubmit = async (data: VoiceFormData) => {
    try {
      const readingTime = calculateReadingTime(content);
      
      const cleanContent = content.replace(/<[^>]*>/g, '').trim();
      
      const finalData = {
        ...data,
        content,
        readingTime,
        metaKeywords: keywords || [],
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || cleanContent.substring(0, 160),
        featuredImage: data.featuredImage || '',
        tags: typeof data.tags === 'string' ? data.tags : '',
        impact: {
          ...data.impact,
          metrics: impactMetrics
        }
      };

      console.log('=== FORM DEBUG START ===');
      console.log('Raw form data:', data);
      console.log('Content state:', content);
      console.log('Final data:', finalData);
      console.log('Required fields check:');
      console.log('- title:', finalData.title);
      console.log('- content:', finalData.content);
      console.log('- author.name:', finalData.author?.name);
      console.log('=== FORM DEBUG END ===');

      await onSave(finalData);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  const categories = [
    'Youth',
    'Energy',
    'Transportation',
    'Education',
    'Technology',
    'Agriculture',
    'Community',
    'Policy',
    'Innovation',
    'Conservation',
    'Activism',
    'Research',
    'Other'
  ];

  const storyTypes = [
    { value: 'personal', label: 'Kişisel Hikaye' },
    { value: 'community', label: 'Topluluk Projesi' },
    { value: 'project', label: 'Proje Deneyimi' },
    { value: 'campaign', label: 'Kampanya' },
    { value: 'research', label: 'Araştırma' }
  ];

  // Quill modules
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

  // ReactQuill için özel CSS style ekleme
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'reactquill-custom-styles';
    style.textContent = `
      /* ReactQuill Editor Text Visibility Fixes */
      .ql-editor {
        color: #1f2937 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      
      /* Placeholder text */
      .ql-editor.ql-blank::before {
        color: #9ca3af !important;
        font-style: italic !important;
      }
      
      /* All text elements */
      .ql-editor p, 
      .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6,
      .ql-editor ul, .ql-editor ol, .ql-editor li, 
      .ql-editor blockquote,
      .ql-editor span,
      .ql-editor div,
      .ql-editor strong,
      .ql-editor em,
      .ql-editor u {
        color: #1f2937 !important;
      }
      
      /* Links */
      .ql-editor a {
        color: #2563eb !important;
      }
      
      /* Code blocks */
      .ql-editor pre {
        background-color: #f3f4f6 !important;
        color: #1f2937 !important;
        border: 1px solid #d1d5db !important;
      }
      
      /* Inline code */
      .ql-editor code {
        background-color: #f3f4f6 !important;
        color: #dc2626 !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
      }
      
      /* Lists */
      .ql-editor ul li, .ql-editor ol li {
        color: #1f2937 !important;
      }
      
      /* Blockquotes */
      .ql-editor blockquote {
        border-left: 4px solid #e5e7eb !important;
        color: #6b7280 !important;
        font-style: italic !important;
      }
      
      /* Ensure toolbar visibility */
      .ql-toolbar {
        border-top: 1px solid #d1d5db !important;
        border-left: 1px solid #d1d5db !important;
        border-right: 1px solid #d1d5db !important;
      }
      
      /* Editor container */
      .ql-container {
        border-bottom: 1px solid #d1d5db !important;
        border-left: 1px solid #d1d5db !important;
        border-right: 1px solid #d1d5db !important;
      }
    `;
    
    // Remove existing style if any
    const existingStyle = document.getElementById('reactquill-custom-styles');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    document.head.appendChild(style);
    
    return () => {
      const styleToRemove = document.getElementById('reactquill-custom-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            📝 Temel Bilgiler
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                {...register('title', { 
                  required: 'Başlık gereklidir',
                  maxLength: { value: 200, message: 'Başlık 200 karakterden uzun olamaz' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Hikayenizin başlığını yazın..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                {...register('slug', { 
                  required: 'Slug gereklidir',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Slug sadece küçük harf, rakam ve tire içerebilir'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="url-icin-slug"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                {...register('category', { required: 'Kategori gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hikaye Türü *
              </label>
              <select
                {...register('storyType', { required: 'Hikaye türü gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                {storyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="draft">Taslak</option>
                <option value="submitted">Gönderildi</option>
                <option value="reviewed">İncelendi</option>
                <option value="published">Yayınlandı</option>
                <option value="rejected">Reddedildi</option>
                <option value="archived">Arşivlendi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiketler
            </label>
            <input
              {...register('tags')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="etiket1, etiket2, etiket3"
            />
            <p className="text-gray-500 text-sm mt-1">Etiketleri virgülle ayırın</p>
          </div>
        </div>

        {/* Author Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            👤 Yazar Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İsim Soyisim *
              </label>
              <input
                {...register('author.name', { required: 'Yazar ismi gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Ahmet Mehmet"
              />
              {errors.author?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.author.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yaş
              </label>
              <input
                type="number"
                {...register('author.age', { 
                  min: { value: 13, message: 'Yaş 13\'ten küçük olamaz' },
                  max: { value: 35, message: 'Yaş 35\'ten büyük olamaz' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="25"
              />
              {errors.author?.age && (
                <p className="text-red-500 text-sm mt-1">{errors.author.age.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir
              </label>
              <input
                {...register('author.location.city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="İstanbul"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölge
              </label>
              <input
                {...register('author.location.region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Marmara"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ülke
              </label>
              <input
                {...register('author.location.country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Turkey"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kısa Biyografi
            </label>
            <textarea
              {...register('author.bio')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Yazar hakkında kısa bilgi..."
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            🖼️ Kapak Görseli
          </h2>

          {watch('featuredImage') && (
            <div className="mb-4">
              <img 
                src={watch('featuredImage')} 
                alt="Preview" 
                className="w-full max-w-md h-48 object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImageUploadError(null);
                }
              }}
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Görsel Seç
            </button>

            {imageFile && (
              <button
                type="button"
                onClick={handleMockImageUpload}
                disabled={imageUploadProgress !== null}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {imageUploadProgress !== null ? `Yükleniyor... ${imageUploadProgress}%` : 'Yükle'}
              </button>
            )}
          </div>

          {imageUploadError && (
            <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
          )}

          <div className="mt-2">
            <input
              {...register('featuredImage')}
              placeholder="Veya direkt URL girin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            ✍️ Hikaye İçeriği
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Özet (Opsiyonel)
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              maxLength={300}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-900"
              placeholder="Hikayenizin kısa özeti..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hikaye İçeriği *
            </label>
            <div className="border border-gray-300 rounded-md">
              <ReactQuill
                theme="snow"
                modules={quillModules}
                value={content}
                onChange={setContent}
                className="bg-white"
                style={{ minHeight: '300px' }}
              />
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Tahmini okuma süresi: {calculateReadingTime(content)} dakika
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eylem Çağrısı
            </label>
            <input
              {...register('callToAction')}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Okuyuculardan ne yapmasını istiyorsunuz?"
            />
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              📊 Etki Metrikleri
            </h2>
            <button
              type="button"
              onClick={() => setShowImpactMetrics(!showImpactMetrics)}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {showImpactMetrics ? 'Gizle' : 'Göster'}
            </button>
          </div>

          {showImpactMetrics && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Etki Açıklaması
                </label>
                <textarea
                  {...register('impact.description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Projenizin/hikayenizin etkisini açıklayın..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yararlanıcı Sayısı
                  </label>
                  <input
                    type="number"
                    {...register('impact.beneficiaries')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zaman Dilimi
                  </label>
                  <input
                    {...register('impact.timeframe')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="6 ay"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ölçülebilir Metrikler
                  </label>
                  <button
                    type="button"
                    onClick={addImpactMetric}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Metrik Ekle
                  </button>
                </div>

                {impactMetrics.map((metric, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      value={metric.name}
                      onChange={(e) => updateImpactMetric(index, 'name', e.target.value)}
                      placeholder="Metrik adı"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    <input
                      value={metric.value}
                      onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                      placeholder="Değer"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    <div className="flex">
                      <input
                        value={metric.unit}
                        onChange={(e) => updateImpactMetric(index, 'unit', e.target.value)}
                        placeholder="Birim"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeImpactMetric(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              📞 İletişim Bilgileri
            </h2>
            <button
              type="button"
              onClick={() => setShowContactOptions(!showContactOptions)}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {showContactOptions ? 'Gizle' : 'Göster'}
            </button>
          </div>

          {showContactOptions && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    {...register('contact.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    {...register('contact.phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="+90 555 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  {...register('contact.website')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    {...register('contact.social.instagram')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="@kullaniciadi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    {...register('contact.social.twitter')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="@kullaniciadi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    {...register('contact.social.linkedin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="linkedin.com/in/kullaniciadi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube
                  </label>
                  <input
                    {...register('contact.social.youtube')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="youtube.com/c/kanaladi"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Options */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              🔍 SEO Ayarları
            </h2>
            <button
              type="button"
              onClick={() => setShowSeoOptions(!showSeoOptions)}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {showSeoOptions ? 'Gizle' : 'Göster'}
            </button>
          </div>

          {showSeoOptions && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Başlık ({watchMetaTitle?.length || 0}/60)
                </label>
                <input
                  {...register('metaTitle', { maxLength: 60 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="SEO için optimize edilmiş başlık"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama ({watchMetaDescription?.length || 0}/160)
                </label>
                <textarea
                  {...register('metaDescription', { maxLength: 160 })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Arama sonuçlarında görünecek açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <div className="flex mb-2">
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Anahtar kelime ekle"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
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

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            ⚙️ Ayarlar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="mr-2"
                />
                <span className="text-gray-700">Öne çıkarılsın</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('allowComments')}
                  className="mr-2"
                />
                <span className="text-gray-700">Yorumlara izin ver</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('allowSharing')}
                  className="mr-2"
                />
                <span className="text-gray-700">Paylaşıma izin ver</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('showAuthorContact')}
                  className="mr-2"
                />
                <span className="text-gray-700">Yazar iletişim bilgilerini göster</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dil
                </label>
                <select
                  {...register('language')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving || isSubmitting 
                ? 'Kaydediliyor...' 
                : mode === 'create' 
                  ? 'Hikaye Oluştur' 
                  : 'Hikayi Güncelle'
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
