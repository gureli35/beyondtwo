import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import useWordPressPosts from '@/hooks/useWordPressPosts';

interface FeaturedStory {
  _id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  image?: string; // WordPress API'den gelen resim için
  author: {
    name: string;
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
  };
  category: string;
  readingTime?: number;
  publishedAt: string;
  featured?: boolean;
  tags: string[];
}

const FeaturedStories: React.FC = () => {
  const { t, language } = useLanguage();
  
  // WordPress API'den voices kategorisindeki son 3 yazıyı çek
  const { posts: voicesPosts, isLoading, error } = useWordPressPosts('voices');

  // Fallback mock data if no real stories are available
  const mockStories: FeaturedStory[] = [
    {
      _id: '1',
      title: language === 'tr' ? 'İstanbul\'da Genç İklim Aktivistleri' : 'Young Climate Activists in Istanbul',
      excerpt: language === 'tr' 
        ? 'Beyoğlu\'nda bir grup üniversite öğrencisi, yerel belediye ile işbirliği yaparak çevre dostu ulaşım projesi başlattı...'
        : 'A group of university students in Beyoğlu started an eco-friendly transportation project in collaboration with the local municipality...',
      author: {
        name: language === 'tr' ? 'Elif Yılmaz' : 'Elif Yilmaz',
        location: {
          city: language === 'tr' ? 'İstanbul' : 'Istanbul',
          country: language === 'tr' ? 'Türkiye' : 'Turkey'
        }
      },
      featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&q=80',
      slug: 'istanbul-genc-iklim-aktivistleri',
      category: 'Transportation',
      readingTime: 5,
      publishedAt: '2024-05-15T00:00:00.000Z',
      featured: true
    },
    {
      _id: '2',
      title: language === 'tr' ? 'Köyde Güneş Enerjisi Devrimi' : 'Solar Energy Revolution in the Village',
      excerpt: language === 'tr'
        ? 'Anadolu\'nun küçük bir köyünde başlayan güneş enerjisi projesi, tüm bölgeye ilham veriyor...'
        : 'A solar energy project started in a small Anatolian village is inspiring the whole region...',
      author: {
        name: 'Mehmet Kaya',
        location: {
          city: 'Konya',
          country: language === 'tr' ? 'Türkiye' : 'Turkey'
        }
      },
      featuredImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&q=80',
      slug: 'koyde-gunes-enerjisi-devrimi',
      category: 'Energy',
      readingTime: 7,
      publishedAt: '2024-05-10T00:00:00.000Z',
      featured: true
    },
    {
      _id: '3',
      title: language === 'tr' ? 'Okul Bahçesinden Küresel Değişim' : 'Global Change from a School Garden',
      excerpt: language === 'tr'
        ? 'Lise öğrencileri kurdukları organik bahçe ile hem beslenme alışkanlıklarını değiştirdi hem de farkındalık yarattı...'
        : 'High school students changed their eating habits and raised awareness with the organic garden they created...',
      author: {
        name: language === 'tr' ? 'Zeynep Özkan' : 'Zeynep Ozkan',
        location: {
          city: language === 'tr' ? 'İzmir' : 'Izmir',
          country: language === 'tr' ? 'Türkiye' : 'Turkey'
        }
      },
      featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80',
      slug: 'okul-bahcesinden-kuresel-degisim',
      category: 'Education',
      readingTime: 4,
      publishedAt: '2024-04-28T00:00:00.000Z',
      featured: true
    }
  ];

  // En son 3 yazıyı al (eğer WordPress'ten veri gelmediyse mock data kullan)
  const featuredStories: FeaturedStory[] = voicesPosts.slice(0, 3);
  
  // Eğer WordPress'ten veri gelmezse mock data kullan
  const displayStories = featuredStories.length > 0 ? featuredStories : mockStories;

  const formatLocation = (location?: { city?: string; region?: string; country?: string }) => {
    if (!location) return '';
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  return (
    <section className="py-16 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white"
            data-aos="fade-up"
          >
            <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('featuredStories.title')}</span>
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('featuredStories.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-white mt-4">
              {language === 'tr' ? 'Hikayeler yükleniyor...' : 'Loading stories...'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredStories.map((story, index) => (
                <div 
                  key={story._id}
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 100}
                >
                  <Card
                    title={story.title}
                    image={story.featuredImage || story.image || 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&q=80'}
                    href={`/blog/${story.slug}`}
                    className="h-full"
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
                        🎤 Voices
                      </div>
                      
                      <p className="text-gray-300 line-clamp-3 leading-relaxed">
                        {story.excerpt || (language === 'tr' ? 'Bu hikayenin özeti henüz eklenmemiş.' : 'No excerpt available for this story yet.')}
                      </p>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {story.author.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{story.author.name}</div>
                              <div className="text-gray-400 text-xs">{formatLocation(story.author.location)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-400 text-xs">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{story.readingTime || 5} {language === 'tr' ? 'dk' : 'min'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div 
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <Link href="/voices">
                  <Button variant="primary" size="large">
                    {t('featuredStories.viewAll')}
                  </Button>
                </Link>
                <div className="mt-4">
                  <Link 
                    href="/contact" 
                    className="text-primary-400 hover:text-primary-300 font-medium underline transition-colors duration-300"
                  >
                    {t('featuredStories.shareYourStory')}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedStories;
