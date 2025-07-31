import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tab } from '@headlessui/react';
import { classNames } from '@/utils/classNames';
import { MediaSelector } from './MediaSelector';
import { useToast } from '../ui/ToastProvider';

const pageSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır'),
  slug: z.string().min(3, 'Slug en az 3 karakter olmalıdır').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug geçerli bir format olmalıdır'),
  content: z.string().min(10, 'İçerik en az 10 karakter olmalıdır'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(160, 'Meta açıklaması en fazla 160 karakter olabilir').optional(),
  template: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
  featuredImage: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

interface PageEditorProps {
  page?: {
    id?: string;
    title: string;
    slug: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    template: string;
    status: 'draft' | 'published' | 'archived';
    featuredImage?: string;
  };
  onSubmit: (data: PageFormData) => void;
  isSubmitting?: boolean;
}

export function PageEditor({ page, onSubmit, isSubmitting = false }: PageEditorProps) {
  const isEditing = !!page?.id;
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValidating },
  } = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page?.title || '',
      slug: page?.slug || '',
      content: page?.content || '',
      metaTitle: page?.metaTitle || '',
      metaDescription: page?.metaDescription || '',
      template: page?.template || 'StandardPage',
      status: page?.status || 'draft',
      featuredImage: page?.featuredImage || '',
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
      
    setValue('slug', slug);
  };
  
  const templateOptions = [
    { value: 'StandardPage', label: 'Standart Sayfa' },
    { value: 'HomePage', label: 'Ana Sayfa' },
    { value: 'ContactPage', label: 'İletişim Sayfası' },
    { value: 'EventsPage', label: 'Etkinlikler Sayfası' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">
          {isEditing ? 'Sayfa Düzenle' : 'Yeni Sayfa Oluştur'}
        </h2>
        <div className="flex items-center space-x-3">            <select
            id="status"
            {...register('status')}
            className="block w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınla</option>
            <option value="archived">Arşivle</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
              )
            }
          >
            İçerik
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
              )
            }
          >
            SEO & Ayarlar
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white p-3">
            <div className="space-y-6">
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

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    id="slug"
                    {...register('slug')}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 text-gray-900"
                  />
                </div>
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                )}
                <button
                  type="button"
                  onClick={generateSlug}
                  className="mt-1 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Başlıktan oluştur
                </button>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  İçerik
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    rows={15}
                    {...register('content')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  HTML veya Markdown formatında yazabilirsiniz.
                </p>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="rounded-xl bg-white p-3">
            <div className="space-y-6">
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                  Şablon
                </label>
                <select
                  id="template"
                  {...register('template')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900"
                >
                  {templateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.template && (
                  <p className="mt-1 text-sm text-red-600">{errors.template.message}</p>
                )}
              </div>

              <div>
                <MediaSelector 
                  label="Öne Çıkan Görsel"
                  value={watch('featuredImage')}
                  onChange={(url) => setValue('featuredImage', url)}
                />
              </div>

              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="metaTitle"
                    {...register('metaTitle')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Boş bırakılırsa, sayfa başlığı kullanılacaktır.
                </p>
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                  Meta Açıklaması
                </label>
                <div className="mt-1">
                  <textarea
                    id="metaDescription"
                    rows={3}
                    {...register('metaDescription')}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                  />
                  {errors.metaDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.metaDescription.message}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Arama sonuçlarında ve sosyal medya paylaşımlarında görünecek açıklama. Maksimum 160 karakter.
                </p>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </form>
  );
}
