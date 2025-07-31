import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';
import useWordPressPosts, { TransformedPost } from '@/hooks/useWordPressPosts';

// Helper function for consistent date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const VoicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { language, t } = useLanguage();
  
  // WordPress'ten voices kategorisindeki yazıları çek
  const { posts: voicesPosts, isLoading, error } = useWordPressPosts('voices');
  
  const postsPerPage = 6;

  // Arama ve sayfalama için filtreleme
  const filteredPosts = voicesPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  // Featured posts (ilk 3 postu featured olarak göster)
  const featuredPosts = voicesPosts.slice(0, 3);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Filtrelenmiş hikayeleri hazırla (sadece arama ile)
  let voices = paginatedPosts;

  return (
    <Layout
      title={t('voices.title')}
      description={t('voices.description')}
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase">
              <span className="text-white">BEYOND</span><span className="text-primary-500">VOICES</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white max-w-3xl mx-auto border-diagonal">
              {t('voices.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="slashed-heading font-montserrat font-black text-4xl md:text-5xl text-white mb-6 tracking-wide">
              {language === 'tr' ? 'Öne Çıkan Voices' : 'Featured Voices'}
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 animate-pulse h-full flex flex-col"
                >
                  <div className="bg-secondary-900 h-48 rounded-t-xl"></div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-4 bg-secondary-900 mb-3 w-1/2 rounded"></div>
                    <div className="h-6 bg-secondary-900 mb-3 rounded"></div>
                    <div className="h-16 bg-secondary-900 mb-4 flex-1 rounded"></div>
                    <div className="h-4 bg-secondary-900 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredPosts.map((post, index) => (
                <div 
                  key={post._id}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 hover:border-primary-500 transition-all duration-500 group overflow-hidden hover:shadow-red-500/30 hover:scale-[1.02] transform-gpu h-full flex flex-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <img 
                      src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated red accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-red-600 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    
                    {/* Featured badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-primary-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>🎤 Voices</span>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6 relative flex-1 flex flex-col">
                    {/* Subtle red glow effect */}
                    <div className="absolute top-0 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block bg-primary-500/90 text-white text-xs font-bold px-3 py-1 mr-2 uppercase tracking-wider rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="font-montserrat font-bold text-2xl mb-4 text-white group-hover:text-primary-300 transition-colors duration-500 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="border-t border-gray-700 pt-4 mt-auto">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-base">
                            {(post.author?.name || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-base">
                            {post.author?.name || '-'}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-primary-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      
                      <Link href={`/voices/${post.slug}`} className="inline-block w-full text-center bg-gradient-to-r from-primary-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                        {language === 'tr' ? 'Hikayeyi Oku' : 'Read Story'}
                      </Link>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filter & Posts Section */}
      <section className="section-padding bg-black relative">
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl text-white mb-6 tracking-wide uppercase">
              {t('voices.allStories')}
            </h3>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            <div className="max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder={language === 'tr' ? 'Hikayelerde ara...' : 'Search stories...'}
                className="form-input flex-1"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Voice hikayelerinde arama yap"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="loading-spinner mx-auto"></div>
              <p className="text-accent-500 mt-4">{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {voices.map((voice, index) => (
                <div 
                  key={voice._id}
                  className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 hover:border-primary-500 transition-all duration-500 group overflow-hidden hover:shadow-red-500/30 hover:scale-[1.03] transform-gpu h-full flex flex-col"
                >
                  <div className="relative w-full h-56 overflow-hidden">
                    <img 
                      src={voice.featuredImage || `${process.env.NODE_ENV === 'production' ? '/beyond3c' : ''}/images/default-voice.jpg`} 
                      alt={voice.title} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated red accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-red-600 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4 bg-primary-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      🎤 Voices
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-primary-500/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hover:bg-primary-600">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-6 relative flex-1 flex flex-col">
                    {/* Subtle red glow effect */}
                    <div className="absolute top-0 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="mb-3">
                      {voice.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-block bg-primary-500/90 text-white text-xs font-bold px-3 py-1 mr-2 uppercase tracking-wider rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="font-montserrat font-bold text-xl mb-4 text-white group-hover:text-primary-300 transition-colors duration-500 line-clamp-2 leading-tight">
                      {voice.title}
                    </h3>
                    
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                      {voice.excerpt || 'No excerpt available'}
                    </p>
                    
                    <div className="border-t border-gray-700 pt-4 mt-auto">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {(voice.author?.name || 'A').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">
                            {voice.author?.name || '-'}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {formatDate(voice.publishedAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-primary-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/voices/${voice.slug}`} 
                        className="inline-block w-full text-center bg-gradient-to-r from-primary-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105"
                      >
                        {t('voices.readStory')}
                      </Link>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
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
      <section className="bg-gradient-to-r from-primary-500 to-red-600 text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="font-montserrat font-black text-4xl mb-8 text-shadow uppercase tracking-wider">
            {t('voices.shareStoryTitle')}
          </h2>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('voices.shareStoryDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
            <Link href="/contact">
              <Button variant="secondary" size="large" className="px-8 py-4 font-bold uppercase tracking-wider bg-white text-primary-500 hover:bg-gray-100">
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