import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { FaGlobeAmericas, FaCalendarAlt, FaSearch, FaNewspaper, FaArrowRight } from 'react-icons/fa';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  publishDate: string;
  source: string;
  category: string;
  language: string;
}

interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const NewsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalNews, setTotalNews] = useState<number>(0);
  const newsPerPage = 12;
  const { language, t } = useLanguage();

  // Fetch news from API
  const fetchNews = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/news?language=${language}&page=${page}&limit=${newsPerPage}`);
      const data: NewsResponse & { isError?: boolean; errorMessage?: string } = await response.json();
      
      if (data.success) {
        setNews(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalNews(data.pagination.total);
        
        // API'den hata alındıysa ve mock data kullanıldıysa bunu konsola yazdır
        if (data.isError) {
          console.warn('API Error:', data.errorMessage);
          // İsteğe bağlı: Kullanıcıya API hatası bilgisi gösterilebilir
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage, language]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(news.map(article => article.category)))];

  // Filter news based on selected category and search query
  const filteredNews = news.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 700, behavior: 'smooth' });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout
      title={language === 'tr' ? 'İklim Haberleri' : 'Climate News'}
      description={language === 'tr' ? 'En güncel iklim değişikliği haberleri ve gelişmeleri' : 'Latest climate change news and developments'}
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
              {language === 'tr' ? 'GÜNCEL HABERLER' : 'LATEST NEWS'}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase"
              data-aos="fade-up"
            >
{language === 'tr' ? 'İKLİM HABERLERİ' : 'CLIMATE NEWS'}
            </h1>
            
            <div className="bg-secondary-900 p-4 mb-8 inline-block transform -skew-x-6 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="200">
              <p className="text-xl md:text-2xl font-bold text-accent-500 transform skew-x-6">
                {language === 'tr' ? 'En Güncel Gelişmeler' : 'Latest Developments'}
              </p>
            </div>
            
            <p 
              className="text-lg md:text-xl mb-10 text-accent-500 max-w-3xl mx-auto border-diagonal"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {language === 'tr' 
                ? 'Dünya genelinden iklim değişikliği, sürdürülebilirlik ve çevre politikaları hakkında en güncel haberleri takip edin.'
                : 'Follow the latest news on climate change, sustainability, and environmental policies from around the world.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-secondary-900 py-8 sticky top-16 z-40 shadow-lg border-b border-primary-500">
        <div className="container-custom">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder={language === 'tr' ? 'İklim haberleri ara...' : 'Search climate news...'}
                  className="form-input w-full py-3 pl-12 pr-4 rounded-lg bg-secondary-800 border border-secondary-700 focus:border-primary-500 text-accent-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={language === 'tr' ? 'Haber arama' : 'Search news'}
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-500" />
              </div>
              <Button 
                variant="primary" 
                type="submit" 
                className="px-6 py-3 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {language === 'tr' ? 'Aranıyor...' : 'Searching...'}
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" /> {language === 'tr' ? 'Ara' : 'Search'}
                  </>
                )}
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="w-full md:w-auto">
              <label className="block text-accent-500 mb-2 font-bold">{language === 'tr' ? 'Kategori Filtresi' : 'Category Filter'}</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-primary-500 text-white shadow-glow-primary transform -translate-y-1'
                        : 'bg-secondary-800 text-accent-500 hover:bg-secondary-700 hover:-translate-y-1'
                    }`}
                    aria-pressed={activeCategory === category}
                    aria-label={`${language === 'tr' ? 'Kategori' : 'Category'}: ${category === 'all' ? (language === 'tr' ? 'Tümü' : 'All') : category}`}
                  >
                    {category === 'all' ? (language === 'tr' ? 'Tümü' : 'All') : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-accent-500 font-medium bg-secondary-800 px-4 py-2 rounded-lg border border-secondary-700">
              {language === 'tr' ? `Toplam ${totalNews} haber bulundu` : `Found ${totalNews} articles total`}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="section-padding bg-black bg-grid-pattern">
        <div className="container-custom">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="loading-spinner mx-auto"></div>
              <p className="text-accent-500 mt-4 text-lg">{language === 'tr' ? 'İklim haberleri yükleniyor...' : 'Loading climate news...'}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((article, index) => (
                  <div 
                    key={article.id} 
                    className="bg-secondary-900 rounded-lg overflow-hidden shadow-lg border border-secondary-800 hover:border-primary-500 transition-all duration-300 h-full flex flex-col"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative overflow-hidden h-48">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            const parent = img.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full news-fallback-bg flex items-center justify-center relative overflow-hidden">
                                  <div class="news-fallback-content text-center p-4">
                                    <div class="text-5xl mb-3 animate-pulse">🌿</div>
                                    <h4 class="text-white font-bold text-sm line-clamp-3 max-w-48">${article.title}</h4>
                                    <div class="mt-2 text-xs text-gray-300 opacity-75">
                                      ${article.source}
                                    </div>
                                  </div>
                                  <div class="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase z-20">
                                    ${article.category}
                                  </div>
                                  <div class="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 font-bold text-sm flex items-center z-20">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                                    </svg>
                                    ${language === 'tr' ? 'Haber' : 'News'}
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full news-fallback-bg flex items-center justify-center relative overflow-hidden">
                          <div className="news-fallback-content text-center p-4">
                            <div className="text-5xl mb-3 animate-pulse">🌱</div>
                            <h4 className="text-white font-bold text-sm line-clamp-3 max-w-48">{article.title}</h4>
                            <div className="mt-2 text-xs text-gray-300 opacity-75">
                              {article.source}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase z-20">
                        {article.category}
                      </div>
                      <div className="absolute top-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 font-bold text-sm flex items-center z-20">
                        <FaNewspaper className="mr-1" /> {language === 'tr' ? 'Haber' : 'News'}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 text-accent-500 line-clamp-2 hover:text-primary-500 transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-accent-500 mb-4 flex-1 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center"><FaGlobeAmericas className="mr-1" /> {article.source}</span>
                        <span className="flex items-center"><FaCalendarAlt className="mr-1" /> {formatDate(article.publishDate)}</span>
                      </div>
                      
                      <div className="mt-auto">
                        {article.url && article.url !== '#' ? (
                          <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary w-full text-center flex items-center justify-center hover:bg-primary-600 transition-colors"
                            onClick={(e) => {
                              // URL'nin geçerli olduğundan emin ol
                              try {
                                new URL(article.url);
                              } catch {
                                e.preventDefault();
                                console.error('Invalid URL:', article.url);
                                alert(language === 'tr' ? 'Geçersiz haber linki!' : 'Invalid article link!');
                              }
                            }}
                          >
                            {language === 'tr' ? 'Haberi Oku' : 'Read Article'} <FaArrowRight className="ml-2" />
                          </a>
                        ) : (
                          <div className="w-full text-center py-3 px-4 bg-secondary-700 text-secondary-400 rounded-lg cursor-not-allowed">
                            {language === 'tr' ? 'Link Mevcut Değil' : 'Link Not Available'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNews.length === 0 && !isLoading && (
                <div className="text-center py-12 bg-secondary-900 border-l-4 border-primary-500 rounded-lg shadow-lg">
                  <FaSearch className="mx-auto text-4xl text-accent-500 mb-4 opacity-50" />
                  <p className="text-accent-500 text-lg font-medium">
                    {language === 'tr' ? 'Arama kriterlerinize uygun haber bulunamadı.' : 'No news found matching your search criteria.'}
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      fetchNews(1);
                    }}
                    className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center mx-auto"
                  >
                    <FaSearch className="mr-2" /> {language === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentPage === 1
                          ? 'bg-secondary-800 text-secondary-600 cursor-not-allowed'
                          : 'bg-secondary-800 text-accent-500 hover:bg-secondary-700'
                      }`}
                      aria-label={language === 'tr' ? 'Önceki sayfa' : 'Previous page'}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      {language === 'tr' ? 'Önceki' : 'Prev'}
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          currentPage === index + 1
                            ? 'bg-primary-500 text-white font-bold shadow-glow-primary'
                            : 'bg-secondary-800 text-accent-500 hover:bg-secondary-700'
                        }`}
                        aria-current={currentPage === index + 1 ? 'page' : undefined}
                        aria-label={`${language === 'tr' ? 'Sayfa' : 'Page'} ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        currentPage === totalPages
                          ? 'bg-secondary-800 text-secondary-600 cursor-not-allowed'
                          : 'bg-secondary-800 text-accent-500 hover:bg-secondary-700'
                      }`}
                      aria-label={language === 'tr' ? 'Sonraki sayfa' : 'Next page'}
                    >
                      {language === 'tr' ? 'Sonraki' : 'Next'}
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-secondary-900 to-black border-t-4 border-primary-500 text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-500 uppercase tracking-wider">
              {language === 'tr' ? 'Haberlerden Eyleme Geçin' : 'From News to Action'}
            </h2>
            <p className="text-xl mb-10 text-accent-500 max-w-3xl mx-auto">
              {language === 'tr' 
                ? 'Bu haberleri okumanın ötesine geçin ve iklim krizi ile mücadelede aktif rol alın. Birlikte değişim yaratabilir ve daha sürdürülebilir bir gelecek inşa edebiliriz.'
                : 'Go beyond reading the news and take an active role in fighting the climate crisis. Together, we can create change and build a more sustainable future.'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/take-action" 
                className="btn-primary group px-8 py-4 text-lg flex items-center"
                aria-label={language === 'tr' ? 'Harekete Geç' : 'Take Action'}
              >
                {language === 'tr' ? 'Harekete Geç' : 'Take Action'} 
                <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/voices" 
                className="btn-outline group px-8 py-4 text-lg flex items-center"
                aria-label={language === 'tr' ? 'Hikayenizi Paylaşın' : 'Share Your Story'}
              >
                {language === 'tr' ? 'Hikayenizi Paylaşın' : 'Share Your Story'}
                <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
