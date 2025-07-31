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
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="propaganda-box bg-primary-500 text-white px-6 py-3 text-lg font-bold uppercase tracking-wider inline-block">
                🎤 {language === 'tr' ? 'SESLERİMİZ' : 'OUR VOICES'}
              </span>
            </div>
            <h1 className="font-montserrat font-black text-4xl md:text-7xl mb-8 text-shadow-red leading-tight uppercase tracking-tight text-white">
              {language === 'tr' ? 'GENÇLİĞİN SESİ' : 'YOUTH VOICES'}
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto font-medium diagonal-border">
              {language === 'tr' 
                ? 'İklim krizine karşı mücadelede GERÇEK deneyimlerle hareketi güçlendiriyoruz. Sesinizi duyurun, değişimi hızlandırın.'
                : 'We empower the climate movement with REAL stories and experiences. Make your voice heard, accelerate change.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Voices Grid */}
      <section className="section-padding bg-secondary-900">
        <div className="container-custom">
          {isLoading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-white font-bold uppercase tracking-wider">{language === 'tr' ? 'YÜKLENİYOR...' : 'LOADING...'}</p>
            </div>
          )}

          {error && (
            <div className="text-center propaganda-box bg-secondary-800 border-l-4 border-primary-500 p-8 max-w-2xl mx-auto">
              <p className="text-white mb-4 font-bold uppercase tracking-wider">
                {language === 'tr' ? 'HİKAYELER YÜKLENİRKEN BİR HATA OLUŞTU' : 'AN ERROR OCCURRED WHILE LOADING STORIES'}
              </p>
              <p className="text-gray-300">{error}</p>
            </div>
          )}

          {!isLoading && !error && voicesPosts.length === 0 && (
            <div className="text-center propaganda-box bg-secondary-800 border-l-4 border-primary-500 p-8 max-w-2xl mx-auto">
              <p className="text-white font-bold uppercase tracking-wider">
                {language === 'tr' ? 'HENÜZ HİKAYE BULUNMUYOR' : 'NO STORIES FOUND YET'}
              </p>
              <p className="text-gray-300 mt-2">
                {language === 'tr' ? 'Yakında hikayeler eklenecek...' : 'Stories will be added soon...'}
              </p>
            </div>
          )}

          {!isLoading && !error && voicesPosts.length > 0 && (
            <>
              {/* Featured Stories Section */}
              <div className="mb-16">
                <h2 className="font-montserrat font-black text-3xl md:text-4xl text-center mb-12 text-white uppercase tracking-wider">
                  {language === 'tr' ? 'ÖNE ÇIKAN SESLERİMİZ' : 'FEATURED VOICES'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {voicesPosts.slice(0, 3).map((voice) => (
                    <Link key={voice._id} href={`/voices/${voice.slug}`}>
                      <div className="propaganda-box hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border-2 border-primary-500 hover:border-accent-500">
                        {voice.featuredImage && (
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={voice.featuredImage}
                              alt={voice.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="propaganda-box bg-primary-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                🎤 {language === 'tr' ? 'SES' : 'VOICE'}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col bg-secondary-800">
                          <h3 className="font-bold text-lg mb-3 line-clamp-2 text-white uppercase tracking-wide">
                            {voice.title}
                          </h3>
                          {voice.excerpt && (
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                              {voice.excerpt.replace(/<[^>]*>/g, '')}
                            </p>
                          )}
                          <div className="mt-auto">
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-white font-bold uppercase tracking-wider">{voice.author.name}</span>
                              <span className="text-primary-300">{calculateReadingTime(voice.content)} {language === 'tr' ? 'dk' : 'min'}</span>
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">
                              {new Date(voice.publishedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="mt-3 text-center">
                              <span className="propaganda-box bg-primary-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-primary-700 transition-colors">
                                {language === 'tr' ? 'HİKAYEYİ OKU' : 'READ STORY'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Stories Section */}
              {voicesPosts.length > 3 && (
                <div>
                  <h2 className="font-montserrat font-black text-3xl md:text-4xl text-center mb-12 text-white uppercase tracking-wider">
                    {language === 'tr' ? 'TÜM HİKAYELER' : 'ALL STORIES'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {voicesPosts.slice(3).map((voice) => (
                      <Link key={voice._id} href={`/voices/${voice.slug}`}>
                        <div className="propaganda-box hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                          {voice.featuredImage && (
                            <div className="relative overflow-hidden h-48">
                              <img
                                src={voice.featuredImage}
                                alt={voice.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="propaganda-box bg-secondary-700 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                  🎤 {language === 'tr' ? 'SES' : 'VOICE'}
                                </span>
                              </div>
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
                              <span className="text-white">{voice.author.name}</span>
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
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-6">
                <span className="propaganda-box bg-primary-500 text-white px-6 py-3 text-lg font-bold uppercase tracking-wider inline-block">
                  📢 {language === 'tr' ? 'SESİNİZİ DUYURUN' : 'MAKE YOUR VOICE HEARD'}
                </span>
              </div>
              <h2 className="font-montserrat font-black text-4xl md:text-6xl mb-6 text-white uppercase tracking-tight text-shadow-red">
                {language === 'tr' ? 'HİKAYENİZİ SİZ DE PAYLAŞIN' : 'SHARE YOUR STORY TOO'}
              </h2>
              <p className="text-xl text-white mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                {language === 'tr' 
                  ? 'İklim değişikliğine karşı mücadeledeki deneyimlerinizi paylaşın. HİKAYENİZ DİĞERLERİNE İLHAM VEREBİLİR.'
                  : 'Share your experiences in the fight against climate change. YOUR STORY CAN INSPIRE OTHERS.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="propaganda-box bg-secondary-800 border-2 border-primary-500 p-8 text-center">
                <div className="mb-4">
                  <span className="text-4xl">🎯</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-white uppercase tracking-wider mb-4">
                  {language === 'tr' ? 'ETKİ YARATIN' : 'CREATE IMPACT'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'tr' 
                    ? 'Deneyimleriniz diğer gençlere ilham verebilir ve iklim hareketi güçlenebilir.'
                    : 'Your experiences can inspire other youth and strengthen the climate movement.'
                  }
                </p>
              </div>
              
              <div className="propaganda-box bg-secondary-800 border-2 border-accent-500 p-8 text-center">
                <div className="mb-4">
                  <span className="text-4xl">🌍</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-white uppercase tracking-wider mb-4">
                  {language === 'tr' ? 'KÜRESEL AĞ' : 'GLOBAL NETWORK'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {language === 'tr' 
                    ? 'Dünya çapındaki iklim aktivistleriyle bağlantı kurun ve deneyimlerinizi paylaşın.'
                    : 'Connect with climate activists worldwide and share your experiences.'
                  }
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/contact">
                <button className="propaganda-box bg-primary-600 text-white px-12 py-6 hover:bg-primary-700 transition-all duration-300 border-2 border-primary-500 hover:border-accent-500 font-bold text-xl uppercase tracking-wider transform hover:scale-105 hover:shadow-xl mb-6 inline-block">
                  {language === 'tr' ? 'HİKAYE GÖNDER' : 'SUBMIT STORY'}
                </button>
              </Link>
              <div className="flex flex-wrap gap-4 justify-center">
                <span className="propaganda-box bg-accent-500 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider">
                  {language === 'tr' ? 'HAREKETE GEÇ' : 'TAKE ACTION'}
                </span>
                <span className="propaganda-box bg-secondary-600 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider">
                  {language === 'tr' ? 'DEĞİŞİME ÖNCÜLÜK ET' : 'LEAD THE CHANGE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VoicesPage;
