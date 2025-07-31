import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
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

const BlogPosts: React.FC = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blogs?status=published&limit=3&sortBy=publishedAt&sortOrder=desc');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.data || []);
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fallback mock data if no real posts are available
  const mockPosts: BlogPost[] = [
    {
      _id: '1',
      title: language === 'tr' ? '2024 İklim Raporu: Türkiye\'nin Durumu' : '2024 Climate Report: Turkey\'s Situation',
      excerpt: language === 'tr' 
        ? 'Son araştırmalara göre Türkiye\'de iklim değişikliğinin etkileri hızlanıyor. Yapılması gerekenler...'
        : 'Recent research shows that the effects of climate change in Turkey are accelerating. What needs to be done...',
      author: {
        name: language === 'tr' ? 'Dr. Ayşe Demir' : 'Dr. Ayse Demir'
      },
      publishedAt: '2024-05-15T00:00:00.000Z',
      category: language === 'tr' ? 'Araştırma' : 'Research',
      featuredImage: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=500&q=80',
      slug: '2024-iklim-raporu-turkiye'
    },
    {
      _id: '2',
      title: language === 'tr' ? 'Gençler İçin İklim Eylemi Rehberi' : 'Climate Action Guide for Youth',
      excerpt: language === 'tr'
        ? 'İklim değişikliği ile mücadelede gençlerin yapabileceği 10 pratik adım ve bu adımları nasıl uygulanacağı...'
        : '10 practical steps youth can take in the fight against climate change and how to implement them...',
      author: {
        name: 'Kemal Arslan'
      },
      publishedAt: '2024-05-12T00:00:00.000Z',
      category: language === 'tr' ? 'Rehber' : 'Guide',
      featuredImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80',
      slug: 'gencler-icin-iklim-eylemi-rehberi'
    },
    {
      _id: '3',
      title: language === 'tr' ? 'Yerel Yönetimlerle İşbirliği Nasıl Kurulur?' : 'How to Collaborate with Local Governments?',
      excerpt: language === 'tr'
        ? 'İklim projelerinizi hayata geçirmek için yerel yönetimlerle etkili işbirliği kurmanın yolları...'
        : 'Ways to establish effective collaboration with local governments to realize your climate projects...',
      author: {
        name: language === 'tr' ? 'Fatma Çelik' : 'Fatma Celik'
      },
      publishedAt: '2024-05-10T00:00:00.000Z',
      category: language === 'tr' ? 'İpuçları' : 'Tips',
      featuredImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&q=80',
      slug: 'yerel-yonetimlerle-isbirligi'
    }
  ];

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  return (
    <section className="py-16 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white"
            data-aos="fade-up"
          >
            <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('blogPosts.title')}</span>
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('blogPosts.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-white mt-4">
              {language === 'tr' ? 'Blog yazıları yükleniyor...' : 'Loading blog posts...'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayPosts.slice(0, 3).map((post, index) => (
                <div 
                  key={post._id}
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 100}
                >
                  <Card
                    title={post.title}
                    image={post.featuredImage || post.image || 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&q=80'}
                    href={`/blog/${post.slug}`}
                    className="h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-600 to-red-700 text-white">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-400 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {(post.author?.firstName || post.author?.name || post.author?.username || 'A').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">
                              {post.author?.firstName || post.author?.name || post.author?.username || 'Anonim'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {language === 'tr' ? 'Yazar' : 'Author'}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-primary-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
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
                <Link href="/blog">
                  <Button variant="primary" size="large">
                    {t('blogPosts.readAll')}
                  </Button>
                </Link>
                <div className="mt-4">
                  <Link 
                    href="/contact" 
                    className="text-primary-400 hover:text-primary-300 font-medium underline transition-colors duration-300"
                  >
                    {t('blogPosts.writeArticle')}
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

export default BlogPosts;
