import React, { useState, useEffect } from 'react';

// Mock data for blog posts
const blogPosts: BlogPost[] = [
    {
      _id: 'post-1',
      title: 'İklim Değişikliğinin Türkiye\'ye Etkileri: Son Araştırmalar',
      excerpt: 'Yeni bilimsel çalışmalar, iklim değişikliğinin Türkiye üzerindeki etkilerinin beklenenden daha hızlı gerçekleştiğini gösteriyor.',
      content: '',
      author: {
        firstName: 'Dr. Ahmet',
        lastName: 'Yılmaz',
        username: 'dr-ahmet'
      },
      publishedAt: '2024-06-10',
      image: 'https://images.unsplash.com/photo-1500740516770-92bd004b159e?w=800&q=80',
      category: 'Bilim',
      tags: ['Türkiye', 'Araştırma', 'Kuraklık'],
      featured: true,
      slug: 'iklim-degisikliginin-turkiye-etkileri',
      readingTime: 5,
      views: 120
    }
  ];

import Layout from '@/components/Layout';
import Link from 'next/link';
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

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    username: string;
  };
  publishedAt: string;
  image?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  featured: boolean;
  slug: string;
  readingTime: number;
  views: number;
}

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage();
  const postsPerPage = 6;

  // Empty blog posts array - to be replaced with API data
  const blogPosts: BlogPost[] = [];

  // Extract unique categories from blog posts
  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  
  // Function to get translated category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'all': return t('common.all');
      case 'Bilim': return t('blog.categories.science');
      case 'Yaşam': return t('blog.categories.lifestyle');
      case 'Teknoloji': return t('blog.categories.technology');
      case 'Politika': return t('blog.categories.politics');
      case 'Aktivizm': return t('blog.categories.activism');
      default: return category;
    }
  };

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const featuredPosts = blogPosts.filter(post => post.featured);

  // Handle page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setIsLoading(true);
    
    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <Layout
      title="Blog - Beyond2C"
      description="İklim krizi, sürdürülebilirlik ve aktivizm hakkında güncel yazılar, analizler ve rehberler."
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
             {formatDate('2024-06-14')}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase"
              data-aos="fade-up"
            >
              <span className="text-white">BEYOND</span><span className="text-primary-500">BLOG</span>
            </h1>
            
            <div className="bg-secondary-900 p-4 mb-8 inline-block transform -skew-x-6 border-l-4 border-primary-500" data-aos="fade-up" data-aos-delay="200">
              <p className="text-xl md:text-2xl font-bold text-accent-500 transform skew-x-6">
                {t('blog.latestDevelopments')}
              </p>
            </div>
            
            <p 
              className="text-lg md:text-xl mb-10 text-accent-500 max-w-3xl mx-auto border-diagonal"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {t('blog.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="section-padding bg-black diagonal-split">
        <div className="container-custom">
          <div className="mb-16 text-center">
            <h2 className="slashed-heading font-montserrat font-black text-4xl md:text-5xl text-accent-500 mb-6 tracking-wide">
              {t('blog.featuredPosts').split(' ')[0]} <span className="text-primary-500">{t('blog.featuredPosts').split(' ')[1]}</span>
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <div 
                key={post.id}
                className="propaganda-box transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                    {post.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 text-accent-500 border-diagonal">
                    {post.title}
                  </h3>
                  
                  <p className="text-accent-500 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                      <span className="font-bold text-primary-500">{post.author}</span>
                      <span className="text-accent-500">{formatDate(post.publishDate)}</span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.id}`} 
                      className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider"
                    >
                      {t('common.readMore')} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding bg-black relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl text-accent-500 mb-6 tracking-wide uppercase">
              {t('blog.allPosts').split(' ')[0]} <span className="text-primary-500">{t('blog.allPosts').split(' ')[1]}</span>
            </h3>
            <div className="w-20 h-1 bg-primary-500 mx-auto mb-8"></div>
            
            {/* Search Box */}
            <div className="max-w-xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder={t('blog.searchPlaceholder')} 
                  className="form-input flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Blog yazılarında arama yap"
                />
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.searching') : t('common.search')}
                </Button>
              </form>
            </div>
            
            <div className="propaganda-box inline-block p-2 mb-6">
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 font-bold uppercase tracking-wider transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-900 text-accent-500 hover:bg-secondary-800 border border-primary-500'
                    }`}
                    aria-pressed={activeCategory === category}
                    aria-label={`Kategori: ${category === 'all' ? 'Tümü' : category}`}
                  >
                    {getCategoryName(category)}
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, index) => (                
                  <div 
                    key={post.id}
                    className="card hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 font-bold text-sm uppercase">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="inline-block bg-secondary-700 text-accent-500 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-accent-500">
                        {post.title}
                      </h3>
                      
                      <p className="text-accent-500 opacity-80 mb-4 flex-1 text-sm">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between text-sm border-t border-primary-500 pt-3">
                          <span className="font-bold text-primary-500">{post.author}</span>
                          <span className="text-accent-500">{formatDate(post.publishDate)}</span>
                        </div>
                        
                        <Link 
                          href={`/blog/${post.id}`} 
                          className="mt-4 inline-block text-primary-500 hover:text-accent-500 font-bold uppercase text-sm tracking-wider"
                        >
                          {t('common.readMore')} &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12 bg-secondary-900 border-l-4 border-primary-500">
                  <p className="text-accent-500 text-lg">
                    {t('blog.noResults')}
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-primary-500 font-bold hover:underline"
                  >
                    {t('blog.showAllPosts')}
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredPosts.length > postsPerPage && (
                <div className="flex justify-center mt-12">
                  <div className="flex">
                    {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-4 py-2 ${
                          currentPage === index + 1
                            ? 'bg-primary-500 text-white'
                            : 'bg-secondary-800 text-accent-500 hover:bg-secondary-700'
                        }`}
                        aria-current={currentPage === index + 1 ? 'page' : undefined}
                        aria-label={`Sayfa ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-black border-t-4 border-primary-500 text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-500">
              {t('blog.newsletterTitle')}
            </h2>
            <p className="text-xl mb-8 text-accent-500">
              {t('blog.newsletterDesc')}
            </p>
            
            <div className="max-w-xl mx-auto">
              <form className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder={t('common.email')} 
                  className="form-input flex-1"
                  aria-label={t('common.email')}
                  required
                />
                <Button variant="primary" className="px-8 py-3 font-bold uppercase tracking-wider">
                  {t('common.subscribe')}
                </Button>
              </form>
              <p className="text-sm text-accent-500 mt-3">
                {t('blog.privacyNotice')}
              </p>
              <div className="mt-6">
                <Link href="/contact" className="text-primary-500 hover:text-accent-500 font-bold">
                  {t('blog.suggestPost')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
