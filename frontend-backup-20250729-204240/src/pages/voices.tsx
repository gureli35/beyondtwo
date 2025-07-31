import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

// Helper function for consistent date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface Voice {
  _id: string;
  title: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  author: {
    name: string;
    age?: number;
    location: {
      city?: string;
      region?: string;
      country?: string;
    };
  };
  category: string;
  tags: string[];
  featured: boolean;
  storyType: string;
  readingTime: number;
  publishedAt: string;
  views: number;
  likes: number;
}

const VoicesPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [featuredVoices, setFeaturedVoices] = useState<Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { language, t } = useLanguage();

  // Categories for filtering
  const categories = [
    'all',
    'Youth',
    'Energy',
    'Transportation',
    'Education',
    'Technology'
  ];

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      all: language === 'tr' ? 'Tümü' : 'All',
      Youth: language === 'tr' ? 'Gençlik' : 'Youth',
      Energy: language === 'tr' ? 'Enerji' : 'Energy',
      Transportation: language === 'tr' ? 'Ulaşım' : 'Transportation',
      Education: language === 'tr' ? 'Eğitim' : 'Education',
      Technology: language === 'tr' ? 'Teknoloji' : 'Technology'
    };
    return labels[category] || category;
  };

  // Fetch voices from API
  const fetchVoices = async (category = 'all', page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        limit: '9',
        page: page.toString(),
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });
      
      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`/api/voices?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVoices(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch voices');
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch featured voices
  const fetchFeaturedVoices = async () => {
    try {
      const response = await fetch('/api/voices?featured=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedVoices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching featured voices:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedVoices();
    fetchVoices(filter, currentPage);
  }, [filter, currentPage]);

  const handleCategoryFilter = (category: string) => {
    setFilter(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatLocation = (location: { city?: string; region?: string; country?: string }) => {
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  return (
    <Layout
      title={t('voices.title')}
      description={t('voices.description')}
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
              {t('voices.bannerText')}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase"
              data-aos="fade-up"
            >
              {t('voices.heroTitle')}
            </h1>
            
            <div className="bg-black p-4 mb-8 inline-block transform -skew-x-6 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="200">
              <p className="text-xl md:text-2xl font-bold text-white transform skew-x-6">
                {t('voices.heroSubtitle')}
              </p>
            </div>
            
            <p 
              className="text-lg md:text-xl mb-10 text-accent-500 max-w-3xl mx-auto border-diagonal"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {t('voices.heroDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <Link href="/contact">
                <Button variant="primary" size="large" className="w-full sm:w-auto px-8 py-4 text-lg font-bold tracking-wider">
                  {t('voices.submitStory')}
                </Button>
              </Link>
              <Button variant="outline" size="large" className="w-full sm:w-auto px-8 py-4 text-lg font-bold tracking-wider border-white text-white hover:bg-white hover:text-primary-500">
                {t('voices.exploreAllStories')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-padding bg-black diagonal-split">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="slashed-heading font-montserrat font-black text-4xl md:text-5xl text-accent-500 mb-6 tracking-wide">
              {t('voices.featuredStories')}
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="propaganda-box animate-pulse h-full flex flex-col"
                >
                  <div className="bg-black h-48"></div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-4 bg-black mb-3 w-1/2"></div>
                    <div className="h-6 bg-black mb-3"></div>
                    <div className="h-16 bg-black mb-4 flex-1"></div>
                    <div className="h-4 bg-black"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredVoices.map((voice, index) => (
                <div 
                  key={voice._id}
                  className="propaganda-box transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={voice.featuredImage || '/images/default-voice.jpg'} 
                      alt={voice.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                      {voice.author.location.city || voice.author.location.region || voice.author.location.country || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      {voice.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 mr-2 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-accent-500 border-diagonal">
                      {voice.title}
                    </h3>
                    
                    <p className="text-accent-500 mb-4 flex-1">
                      {voice.excerpt || 'No excerpt available'}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                        <span className="font-bold text-primary-500">
                          {voice.author.name}
                          {voice.author.age && `, ${voice.author.age}`}
                        </span>
                        <span className="text-accent-500">{formatDate(voice.publishedAt)}</span>
                      </div>
                      
                      <Link 
                        href={`/voices/${voice.slug}`} 
                        className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider"
                      >
                        {t('voices.readStory')} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-black relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl text-accent-500 mb-6 tracking-wide uppercase">
              {t('voices.allStories')}
            </h3>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            
            <div className="propaganda-box inline-block p-2 mb-6">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-6 py-3 font-bold uppercase tracking-wider transition-all duration-200 ${
                      filter === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-black text-accent-500 hover:bg-secondary-900 border border-primary-500'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-black border-l-4 border-primary-500 shadow-lg animate-pulse h-full flex flex-col"
                >
                  <div className="bg-black h-48"></div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-4 bg-secondary-600 mb-3 w-1/2"></div>
                    <div className="h-6 bg-secondary-600 mb-3"></div>
                    <div className="h-16 bg-secondary-600 mb-4 flex-1"></div>
                    <div className="h-4 bg-secondary-600"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {voices.map((voice, index) => (
                <div 
                  key={voice._id}
                  className="bg-black border-l-4 border-primary-500 shadow-lg transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={voice.featuredImage || '/images/default-voice.jpg'} 
                      alt={voice.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                      {voice.author.location.city || voice.author.location.region || voice.author.location.country || 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      {voice.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block bg-primary-500 text-white text-xs font-bold px-3 py-1 mr-2 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-accent-500">
                      {voice.title}
                    </h3>
                    
                    <p className="text-accent-500 opacity-80 mb-4 flex-1 text-sm">
                      {voice.excerpt || 'No excerpt available'}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                        <span className="font-bold text-primary-500">
                          {voice.author.name}
                          {voice.author.age && `, ${voice.author.age}`}
                        </span>
                        <span className="text-accent-500">{formatDate(voice.publishedAt)}</span>
                      </div>
                      
                      <Link 
                        href={`/voices/${voice.slug}`} 
                        className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider"
                      >
                        {t('voices.readStory')} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 font-bold uppercase tracking-wider transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-secondary-600 text-accent-600 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                ← {language === 'tr' ? 'Önceki' : 'Previous'}
              </button>
              
              <span className="text-accent-500 font-bold">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 font-bold uppercase tracking-wider transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-secondary-600 text-accent-600 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {language === 'tr' ? 'Sonraki' : 'Next'} →
              </button>
            </div>
          )}

          {/* Load More Button (optional, keeping for design consistency) */}
          {!isLoading && voices.length === 0 && (
            <div className="text-center mt-16">
              <p className="text-accent-500 text-lg mb-8">
                {language === 'tr' ? 'Henüz bu kategoride hikaye bulunmuyor.' : 'No stories found in this category yet.'}
              </p>
              <Link href="/contact">
                <Button variant="primary" size="large" className="px-8 py-4 font-bold uppercase tracking-wider">
                  {t('voices.submitStory')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-500 text-white section-padding clip-diagonal">
        <div className="container-custom text-center">
          <h2 className="font-montserrat font-black text-4xl mb-8 text-shadow uppercase tracking-wider">
            {t('voices.shareStoryTitle')}
          </h2>
          
          <div className="propaganda-box inline-block p-4 mb-8 max-w-3xl bg-secondary-600 border-primary-500">
            <p className="text-xl tracking-wide font-bold transform skew-x-0">
              {t('voices.shareStoryDescription')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Link href="/contact">
              <Button variant="secondary" size="large" className="px-8 py-4 font-bold uppercase tracking-wider">
                {t('voices.submitStory')}
              </Button>
            </Link>
            <Link href="/take-action">
              <Button 
                variant="outline" 
                size="large" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-500 px-8 py-4 font-bold uppercase tracking-wider"
              >
                {t('nav.takeAction')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default VoicesPage;
