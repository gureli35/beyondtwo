import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import useWordPressPosts from '@/hooks/useWordPressPosts';

const VoicesPage: React.FC = () => {
  const { language } = useLanguage();
  const { posts: voicesPosts, isLoading, error } = useWordPressPosts('voices');

  // Calculate reading time (roughly 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <Layout
      title={language === 'tr' ? 'Gençlik Sesleri - Beyond2C' : 'Youth Voices - Beyond2C'}
      description={language === 'tr' 
        ? 'Gençlerin iklim değişikliği ve sürdürülebilirlik konularındaki deneyimlerini ve projelerini keşfedin.'
        : 'Discover young people\'s experiences and projects on climate change and sustainability.'
      }
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-secondary-800 to-black text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-montserrat font-black text-4xl md:text-6xl mb-6 text-shadow leading-tight">
              {language === 'tr' ? 'Gençlik Sesleri' : 'Youth Voices'}
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              {language === 'tr' 
                ? 'Gençlerin iklim değişikliği, sürdürülebilirlik ve çevresel sorunlar konularındaki deneyimlerini, projelerini ve hikayelerini keşfedin.'
                : 'Discover young people\'s experiences, projects, and stories on climate change, sustainability, and environmental issues.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Voices Grid */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          {isLoading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-white">{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-red-400 mb-4">
                {language === 'tr' ? 'Hikayeler yüklenirken bir hata oluştu.' : 'An error occurred while loading stories.'}
              </p>
              <p className="text-gray-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && voicesPosts.length === 0 && (
            <div className="text-center">
              <p className="text-gray-400">
                {language === 'tr' ? 'Henüz hikaye bulunmuyor.' : 'No stories found yet.'}
              </p>
            </div>
          )}

          {!isLoading && !error && voicesPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {voicesPosts.map((voice) => (
                <Link key={voice._id} href={`/voices/${voice.slug}`}>
                  <div className="propaganda-box hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {voice.featuredImage && (
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={voice.featuredImage}
                          alt={voice.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
                        {voice.title}
                      </h3>
                      {voice.excerpt && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                          {voice.excerpt.replace(/<[^>]*>/g, '')}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                        <span className="text-accent-500">{voice.author.name}</span>
                        <span>{calculateReadingTime(voice.content)} {language === 'tr' ? 'dk' : 'min'}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(voice.publishedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-secondary-700">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              {language === 'tr' ? 'Hikayenizi Paylaşın' : 'Share Your Story'}
            </h2>
            <p className="text-gray-300 mb-8">
              {language === 'tr' 
                ? 'İklim değişikliği ve sürdürülebilirlik konularında bir deneyiminiz var mı? Hikayenizi bizimle paylaşın ve diğer gençlere ilham verin.'
                : 'Do you have an experience in climate change and sustainability? Share your story with us and inspire other young people.'
              }
            </p>
            <Link href="/contact">
              <button className="bg-primary-600 text-white px-8 py-3 hover:bg-primary-700 transition-colors border border-primary-500">
                {language === 'tr' ? 'İletişime Geçin' : 'Get In Touch'}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VoicesPage;
