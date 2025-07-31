import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { useWordPressPosts } from '@/hooks/useWordPressPosts';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { posts: blogPosts, isLoading } = useWordPressPosts('exclude-voices'); // Voices kategorisi hariç
  const { t, language } = useLanguage();
  const postsPerPage = 6;

  // Function to translate blog categories
  const translateCategory = (category: string): string => {
    const categoryMap: { [key: string]: { tr: string; en: string } } = {
      'SÜRDÜRÜLEBİLİRLİK': { tr: 'SÜRDÜRÜLEBİLİRLİK', en: 'SUSTAINABILITY' },
      'İKLİM DEĞİŞİKLİĞİ': { tr: 'İKLİM DEĞİŞİKLİĞİ', en: 'CLIMATE CHANGE' },
      'CLİMATE': { tr: 'İKLİM', en: 'CLIMATE' },
      'ÇEVRE KORUMA': { tr: 'ÇEVRE KORUMA', en: 'ENVIRONMENTAL PROTECTION' },
      'Uncategorized': { tr: 'KATEGORİSİZ', en: 'UNCATEGORIZED' }
    };
    const translation = categoryMap[category];
    if (translation) {
      return language === 'tr' ? translation.tr : translation.en;
    }
    return category; // Return original if no translation found
  };

  // Kategorileri API'den gelen postlardan çıkar
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  // Filtreleme
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Featured postlar (örnek: ilk 2 postu featured göster)
  const featuredPosts = blogPosts.slice(0, 2);

  return (
    <Layout 
      title={language === 'tr' ? 'Blog - Beyond2C' : 'Blog - Beyond2C'} 
      description={language === 'tr' 
        ? 'İklim krizi, sürdürülebilirlik ve aktivizm hakkında güncel yazılar, analizler ve rehberler. Uzmanlar ve aktivistlerden en son gelişmeler.'
        : 'Current articles, analysis and guides on climate crisis, sustainability and activism. Latest developments from experts and activists.'
      }
      keywords={language === 'tr' 
        ? ['iklim değişikliği blog', 'çevre makaleleri', 'sürdürülebilirlik yazıları', 'iklim haberleri', 'çevre aktivizmi', 'yeşil yaşam rehberleri']
        : ['climate change blog', 'environmental articles', 'sustainability articles', 'climate news', 'environmental activism', 'green living guides']
      }
      type="website"
      locale={language === 'tr' ? 'tr_TR' : 'en_US'}
      alternateLocales={language === 'tr' ? ['en_US'] : ['tr_TR']}
      url="/blog"
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase">
              <span className="text-white">BEYOND</span><span className="text-primary-500">BLOG</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white max-w-3xl mx-auto border-diagonal">
              {t('blog.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="slashed-heading font-montserrat font-black text-4xl md:text-5xl text-white mb-6 tracking-wide">
              {t('blog.featuredPosts')}
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <div 
                key={post._id} 
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 hover:border-primary-500 transition-all duration-500 group overflow-hidden hover:shadow-red-500/30 hover:scale-[1.02] transform-gpu h-full flex flex-col"
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
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
                      <span>Featured</span>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {translateCategory(post.category)}
                  </div>
                </div>
                
                <div className="p-6 relative flex-1 flex flex-col">
                  {/* Subtle red glow effect */}
                  <div className="absolute top-0 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <h3 className="font-montserrat font-bold text-2xl mb-4 text-white group-hover:text-primary-300 transition-colors duration-500 line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="border-t border-gray-700 pt-4 mt-auto">
                    <div className="flex items-center space-x-3 mb-4">                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
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
                    
                    <Link href={`/blog/${post.slug}`} className="inline-block w-full text-center bg-gradient-to-r from-primary-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                      {t('common.readMore')}
                    </Link>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Posts Section */}
      <section className="section-padding bg-black relative">
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl text-white mb-6 tracking-wide uppercase">
              {t('blog.allPosts')}
            </h3>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            <div className="max-w-xl mx-auto mb-8">
              <input
                type="text"
                placeholder={t('blog.search.placeholder')}
                className="form-input flex-1"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Blog yazılarında arama yap"
              />
            </div>
            <div className="propaganda-box inline-block p-2 mb-6">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-6 py-3 font-bold uppercase tracking-wider transition-all duration-200 ${activeCategory === category ? 'bg-primary-500 text-white' : 'bg-secondary-900 text-accent-500 hover:bg-secondary-800 border border-primary-500'}`}
                    aria-pressed={activeCategory === category}
                  >
                    {category === 'all' ? t('blog.categories.all') : translateCategory(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center py-20">
              <div className="loading-spinner mx-auto"></div>
              <p className="text-accent-500 mt-4">{t('blog.loadingPosts')}</p>
            </div>
          ) : (
            <React.Fragment>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post, index) => (
                  <div 
                    key={post._id} 
                    className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 hover:border-primary-500 transition-all duration-500 group overflow-hidden hover:shadow-red-500/30 hover:scale-[1.03] transform-gpu h-full flex flex-col"
                  >
                    <div className="relative w-full h-56 overflow-hidden">
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
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 bg-primary-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {translateCategory(post.category)}
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
                      
                      <h3 className="font-montserrat font-bold text-xl mb-4 text-white group-hover:text-primary-300 transition-colors duration-500 line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 line-clamp-3 leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="border-t border-gray-700 pt-4 mt-auto">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {(post.author?.name || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">
                              {post.author?.name || '-'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {formatDate(post.publishedAt)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-primary-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`} className="inline-block w-full text-center bg-gradient-to-r from-primary-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm tracking-wider hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:scale-105">
                          {t('common.readMore')}
                        </Link>
                      </div>
                      
                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 bg-secondary-900 border-l-4 border-primary-500 rounded-lg shadow-md">
                  <p className="text-white text-lg font-semibold mb-2">
                    {t('blog.noResults')}
                  </p>
                  <p className="text-white text-base mb-4 font-semibold">
                    Pro İpucu: Okuyucularınız için değerli bilgiler paylaşmayı unutmayın.
                  </p>
                  <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="mt-4 text-primary-400 font-bold hover:underline transition-colors">
                    {t('blog.showAllPosts')}
                  </button>
                </div>
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex bg-secondary-900 rounded-lg shadow px-4 py-2 gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 px-4 py-2 rounded font-semibold transition-colors border focus:outline-none focus:ring-2 focus:ring-primary-500 ${currentPage === index + 1 ? 'bg-primary-500 text-white border-primary-500 shadow' : 'bg-secondary-800 text-accent-500 border-secondary-700 hover:bg-secondary-700'}`}
                        aria-current={currentPage === index + 1 ? 'page' : undefined}
                        aria-label={`Sayfa ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black border-t-4 border-primary-500 text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-500">{t('blog.newsletterTitle')}</h2>
            <p className="text-xl mb-8 text-accent-500">{t('blog.newsletterDesc')}</p>
            <div className="max-w-xl mx-auto">
              <form className="flex flex-col md:flex-row gap-4">
                <input type="email" placeholder={t('common.email')} className="form-input flex-1" aria-label={t('common.email')} required />
                <Button variant="primary" className="px-8 py-3 font-bold uppercase tracking-wider">{t('common.subscribe')}</Button>
              </form>
              <p className="text-sm text-accent-500 mt-3">{t('blog.privacyNotice')}</p>
              <div className="mt-6">
                <Link href="/contact" className="text-primary-500 hover:text-accent-500 font-bold">{t('blog.suggestPost')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
