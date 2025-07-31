import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';
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

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t, language } = useLanguage();
  const { posts, isLoading, error: postsError } = useWordPressPosts(); // Tüm yazıları çek, filtreleme slug arama sonrası yapılacak
  const [post, setPost] = useState<TransformedPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<TransformedPost[]>([]);

  // Find the specific post and related posts
  useEffect(() => {
    if (!isLoading && posts.length > 0 && slug) {
      const foundPost = posts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Find related posts (same category, excluding current post)
        const related = posts
          .filter(p => p.category === foundPost.category && p._id !== foundPost._id)
          .slice(0, 3); // Get up to 3 related posts
        
        setRelatedPosts(related);
      } else {
        setError('Blog yazısı bulunamadı');
      }
    }
  }, [slug, posts, isLoading]);

  if (isLoading) {
    return (
      <Layout
        title={language === 'tr' ? 'Yükleniyor... - Beyond2C Blog' : 'Loading... - Beyond2C Blog'}
        description={language === 'tr' ? 'Blog yazısı yükleniyor' : 'Loading blog post'}
      >
        <div className="min-h-screen bg-black">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-secondary-900 rounded mb-4"></div>
              <div className="h-4 bg-secondary-900 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-secondary-900 rounded mb-8 w-1/2"></div>
              <div className="h-64 bg-secondary-900 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-secondary-900 rounded"></div>
                <div className="h-4 bg-secondary-900 rounded"></div>
                <div className="h-4 bg-secondary-900 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || postsError || !post) {
    return (
      <Layout
        title={language === 'tr' ? 'Blog Yazısı Bulunamadı - Beyond2C' : 'Blog Post Not Found - Beyond2C'}
        description={language === 'tr' ? 'Aradığınız blog yazısı bulunamadı' : 'The blog post you are looking for could not be found'}
      >
        <div className="min-h-screen bg-black">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-8">😕</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {error || postsError || t('blog.postNotFound')}
            </h1>
            <p className="text-accent-500 mb-8">
              {t('blog.postMayNotExist')}
            </p>
            <Link href="/blog">
              <Button variant="primary" size="large">
                ← {t('blog.backToBlog')}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={post.title + ' - Beyond2C Blog'}
      description={post.excerpt}
      keywords={post.tags}
      type="article"
      ogImage={post.featuredImage}
      locale={language === 'tr' ? 'tr_TR' : 'en_US'}
      url={`/blog/${post.slug}`}
    >
      <div className="min-h-screen bg-black pb-20">
        {/* Back Navigation */}
        <div className="bg-secondary-900/80 backdrop-blur-sm border-b border-primary-500">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary-500 hover:text-accent-500 font-medium"
            >
              ← {t('blog.backToBlog')}
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-montserrat">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-accent-500 mb-8 pb-8 border-b border-primary-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-white">
                  {post.author.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                📅 {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full max-h-96 object-cover rounded-xl shadow-lg border-4 border-primary-500"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-white leading-relaxed mb-8 p-6 bg-secondary-900 rounded-xl border-l-4 border-primary-500">
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-accent-500 prose-headings:text-white prose-a:text-primary-500 prose-blockquote:border-primary-500 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Image Gallery (if multiple images) */}
          {post.images && post.images.length > 1 && (
            <div className="mt-12 pt-8 border-t border-primary-500">
              <h3 className="text-lg font-semibold text-white mb-4">{t('blog.imageGallery')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {post.images.map((img, idx) => (
                  <a 
                    key={idx} 
                    href={img} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-lg border-2 border-primary-500 hover:border-accent-500 transition-all"
                  >
                    <img 
                      src={img} 
                      alt={`${post.title} - ${idx + 1}`} 
                      className="w-full h-48 object-cover transition-transform hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-primary-500">
              <h3 className="text-lg font-semibold text-white mb-4">{t('blog.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-secondary-900 hover:bg-primary-500 text-accent-500 hover:text-white px-3 py-1 rounded-full text-sm cursor-pointer transition-colors border border-primary-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Share */}
          <div className="mt-12 pt-8 border-t border-primary-500">
            <h3 className="text-lg font-semibold text-white mb-4">{t('blog.sharePost')}</h3>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                🐦 Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                📘 Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                💼 LinkedIn
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-primary-500">
              <h3 className="text-2xl font-bold text-white mb-6">{t('blog.relatedPosts')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost._id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="block bg-secondary-900 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border border-primary-500 hover:border-accent-500"
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={relatedPost.featuredImage || relatedPost.image || 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop'} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white mb-2 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-accent-500 text-sm mb-2">{formatDate(relatedPost.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
};

export default BlogPostPage; 
       