import React from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Tabs } from '@/components/admin/ui/Tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// General Settings Form Schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site adı gereklidir'),
  siteDescription: z.string().min(1, 'Site açıklaması gereklidir'),
  siteUrl: z.string().url('Geçerli bir URL giriniz'),
  adminEmail: z.string().email('Geçerli bir e-posta adresi giriniz'),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  defaultLanguage: z.string().min(1, 'Varsayılan dil gereklidir'),
});

// Social Media Settings Form Schema
const socialSettingsSchema = z.object({
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
});

// Analytics Settings Form Schema
const analyticsSettingsSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  enableAnalytics: z.boolean(),
  enableCookieConsent: z.boolean(),
});

type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
type SocialSettingsData = z.infer<typeof socialSettingsSchema>;
type AnalyticsSettingsData = z.infer<typeof analyticsSettingsSchema>;

const SettingsPage: React.FC = () => {
  // General Settings Form
  const {
    register: registerGeneral,
    handleSubmit: handleSubmitGeneral,
    formState: { errors: errorsGeneral },
  } = useForm<GeneralSettingsData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: 'Beyond2C',
      siteDescription: 'İklim Değişikliği ve Aktivizm Platformu',
      siteUrl: 'https://beyond2c.org',
      adminEmail: 'admin@beyond2c.org',
      logoUrl: '/2Clogo.png',
      faviconUrl: '/icons/favicon.ico',
      defaultLanguage: 'tr',
    },
  });

  // Social Media Settings Form
  const {
    register: registerSocial,
    handleSubmit: handleSubmitSocial,
    formState: { errors: errorsSocial },
  } = useForm<SocialSettingsData>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      twitter: 'https://twitter.com/beyond2c',
      facebook: 'https://facebook.com/beyond2c',
      instagram: 'https://instagram.com/beyond2c',
      linkedin: 'https://linkedin.com/company/beyond2c',
      youtube: '',
    },
  });

  // Analytics Settings Form
  const {
    register: registerAnalytics,
    handleSubmit: handleSubmitAnalytics,
    formState: { errors: errorsAnalytics },
  } = useForm<AnalyticsSettingsData>({
    resolver: zodResolver(analyticsSettingsSchema),
    defaultValues: {
      googleAnalyticsId: 'UA-123456789-1',
      enableAnalytics: true,
      enableCookieConsent: true,
    },
  });

  const onSubmitGeneral = (data: GeneralSettingsData) => {
    console.log('General settings submitted:', data);
    // In a real app, this would make an API call to save the settings
  };

  const onSubmitSocial = (data: SocialSettingsData) => {
    console.log('Social settings submitted:', data);
    // In a real app, this would make an API call to save the settings
  };

  const onSubmitAnalytics = (data: AnalyticsSettingsData) => {
    console.log('Analytics settings submitted:', data);
    // In a real app, this would make an API call to save the settings
  };

  const tabItems = [
    {
      key: 'general',
      label: 'Genel Ayarlar',
      content: (
        <div className="py-4">
          <form onSubmit={handleSubmitGeneral(onSubmitGeneral)} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Site Bilgileri</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sitenizin temel bilgilerini buradan yönetebilirsiniz.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Adı
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        {...registerGeneral('siteName')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.siteName && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.siteName.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                        Admin E-posta
                      </label>
                      <input
                        type="email"
                        id="adminEmail"
                        {...registerGeneral('adminEmail')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.adminEmail && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.adminEmail.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                        Site Açıklaması
                      </label>
                      <textarea
                        id="siteDescription"
                        rows={3}
                        {...registerGeneral('siteDescription')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.siteDescription && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.siteDescription.message}</p>
                      )}
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                        Site URL
                      </label>
                      <input
                        type="url"
                        id="siteUrl"
                        {...registerGeneral('siteUrl')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.siteUrl && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.siteUrl.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        id="logoUrl"
                        {...registerGeneral('logoUrl')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.logoUrl && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.logoUrl.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                        Favicon URL
                      </label>
                      <input
                        type="text"
                        id="faviconUrl"
                        {...registerGeneral('faviconUrl')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsGeneral.faviconUrl && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.faviconUrl.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700">
                        Varsayılan Dil
                      </label>
                      <select
                        id="defaultLanguage"
                        {...registerGeneral('defaultLanguage')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                      </select>
                      {errorsGeneral.defaultLanguage && (
                        <p className="mt-1 text-sm text-red-600">{errorsGeneral.defaultLanguage.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: 'social',
      label: 'Sosyal Medya',
      content: (
        <div className="py-4">
          <form onSubmit={handleSubmitSocial(onSubmitSocial)} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Sosyal Medya Hesapları</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sosyal medya hesaplarınızı buradan yönetebilirsiniz.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="twitter"
                        {...registerSocial('twitter')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsSocial.twitter && (
                        <p className="mt-1 text-sm text-red-600">{errorsSocial.twitter.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        {...registerSocial('facebook')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsSocial.facebook && (
                        <p className="mt-1 text-sm text-red-600">{errorsSocial.facebook.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <input
                        type="text"
                        id="instagram"
                        {...registerSocial('instagram')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsSocial.instagram && (
                        <p className="mt-1 text-sm text-red-600">{errorsSocial.instagram.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        id="linkedin"
                        {...registerSocial('linkedin')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsSocial.linkedin && (
                        <p className="mt-1 text-sm text-red-600">{errorsSocial.linkedin.message}</p>
                      )}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                        YouTube
                      </label>
                      <input
                        type="text"
                        id="youtube"
                        {...registerSocial('youtube')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsSocial.youtube && (
                        <p className="mt-1 text-sm text-red-600">{errorsSocial.youtube.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      ),
    },
    {
      key: 'analytics',
      label: 'Analitik',
      content: (
        <div className="py-4">
          <form onSubmit={handleSubmitAnalytics(onSubmitAnalytics)} className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Analitik Ayarları</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Analitik ve izleme ayarlarınızı buradan yönetebilirsiniz.
                  </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        id="googleAnalyticsId"
                        {...registerAnalytics('googleAnalyticsId')}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errorsAnalytics.googleAnalyticsId && (
                        <p className="mt-1 text-sm text-red-600">{errorsAnalytics.googleAnalyticsId.message}</p>
                      )}
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableAnalytics"
                          type="checkbox"
                          {...registerAnalytics('enableAnalytics')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableAnalytics" className="font-medium text-gray-700">
                          Analitik Etkinleştir
                        </label>
                        <p className="text-gray-500">Ziyaretçi istatistiklerini topla ve analiz et.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableCookieConsent"
                          type="checkbox"
                          {...registerAnalytics('enableCookieConsent')}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableCookieConsent" className="font-medium text-gray-700">
                          Çerez İzni Etkinleştir
                        </label>
                        <p className="text-gray-500">Ziyaretçilere çerez izni uyarısı göster.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Ayarlar | Beyond2C Admin</title>
      </Head>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Ayarlar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Site ayarlarınızı ve yapılandırma seçeneklerinizi yönetin
          </p>
        </div>

        <Tabs items={tabItems} />
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
