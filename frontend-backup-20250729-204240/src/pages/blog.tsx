import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    firstName?: string;
    lastName?: string;
    username?: string;
    name?: string;
  };
  publishedAt: string;
  image?: string;
  featuredImage?: string;
  category: string;
  tags?: string[];
  featured?: boolean;
  slug: string;
  readingTime?: number;
  views?: number;
}

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const { t, language } = useLanguage();
  const postsPerPage = 6;

  // Function to translate blog categories
  const translateCategory = (category: string): string => {
    const categoryMap: { [key: string]: { tr: string; en: string } } = {
      'SÜRDÜRÜLEBİLİRLİK': { tr: 'SÜRDÜRÜLEBİLİRLİK', en: 'SUSTAINABILITY' },
      'İKLİM DEĞİŞİKLİĞİ': { tr: 'İKLİM DEĞİŞİKLİĞİ', en: 'CLIMATE CHANGE' },
      'CLİMATE': { tr: 'İKLİM', en: 'CLIMATE' },
      'ÇEVRE KORUMA': { tr: 'ÇEVRE KORUMA', en: 'ENVIRONMENTAL PROTECTION' }
    };
    const translation = categoryMap[category];
    if (translation) {
      return language === 'tr' ? translation.tr : translation.en;
    }
    return category; // Return original if no translation found
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && data.data) {
          setBlogPosts(data.data);
        } else {
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Blog fetch error:', error);
        setBlogPosts([]);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

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
      <section className="section-padding bg-black diagonal-split">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="slashed-heading font-montserrat font-black text-4xl md:text-5xl text-white mb-6 tracking-wide">
              {t('blog.featuredPosts')}
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <div key={post._id} className="propaganda-box h-full flex flex-col">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop'} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                    {translateCategory(post.category)}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 text-white border-diagonal">{post.title}</h3>
                  <p className="text-white mb-4 flex-1">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                    <span className="font-bold text-primary-500">{post.author?.firstName || post.author?.name || post.author?.username || '-'}</span>
                    <span className="text-accent-500">{formatDate(post.publishedAt)}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider">
                    {t('common.readMore')} &rarr;
                  </Link>
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
                  <div key={post._id} className="card hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop'} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                        {translateCategory(post.category)}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 text-white">{post.title}</h3>
                      <p className="text-white opacity-80 mb-4 flex-1 text-sm">{post.excerpt}</p>
                      <div className="mt-auto flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                        <span className="font-bold text-primary-500">{post.author?.firstName || post.author?.name || post.author?.username || '-'}</span>
                        <span className="text-accent-500">{formatDate(post.publishedAt)}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider">
                        {t('common.readMore')} &rarr;
                      </Link>
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
