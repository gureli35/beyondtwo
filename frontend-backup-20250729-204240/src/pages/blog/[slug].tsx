import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';

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
    profilePicture?: string;
  };
  publishedAt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  featured: boolean;
  slug: string;
  readingTime: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog post from API
  const fetchBlogPost = async () => {
    if (!slug || typeof slug !== 'string') return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
      } else {
        setError('Blog yazısı bulunamadı');
      }
    } catch (error) {
      console.error('Blog post fetch error:', error);
      setError('Blog yazısı yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mb-8 w-1/2"></div>
              <div className="h-64 bg-gray-300 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-8">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error || 'Blog yazısı bulunamadı'}
            </h1>
            <p className="text-gray-600 mb-8">
              Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.
            </p>
            <Link href="/blog">
              <Button>
                ← Blog Ana Sayfası
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={post.metaTitle || post.title}
      description={post.metaDescription || post.excerpt}
      keywords={post.metaKeywords}
      ogImage={post.featuredImage}
    >
      <div className="min-h-screen bg-black pb-20">
        {/* Back Navigation */}
        <div className="bg-secondary-900/80 backdrop-blur-sm border-b border-primary-500">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary-500 hover:text-accent-500 font-medium"
            >
              ← Blog Ana Sayfası
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            {post.featured && (
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                ⭐ Öne Çıkan
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-montserrat">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-accent-500 mb-8 pb-8 border-b border-primary-500">
            <div className="flex items-center space-x-3">
              <img
                src={post.author.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
              />
              <div>
                <p className="font-medium text-white">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <p className="text-sm text-accent-500">@{post.author.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                📅 {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center">
                ⏱️ {post.readingTime} dakika okuma
              </span>
              <span className="flex items-center">
                👁️ {post.views} görüntülenme
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-12">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg border-4 border-primary-500"
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

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-primary-500">
              <h3 className="text-lg font-semibold text-white mb-4">Etiketler</h3>
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
            <h3 className="text-lg font-semibold text-white mb-4">Bu yazıyı paylaş</h3>
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

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-primary-500 text-center">
            <Link href="/blog">
              <Button size="large" className="bg-primary-500 hover:bg-primary-600 text-white font-bold">
                ← Tüm Blog Yazılarını Gör
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPostPage;
