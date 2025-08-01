import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

// WordPress post interfaces
interface WordPressPost {
  ID: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  author: {
    name: string;
  };
  featured_image: string;
  categories: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      parent: number;
      meta: any;
    };
  };
  tags: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
      description: string;
      post_count: number;
      meta: any;
    };
  };
  slug: string;
  attachments?: {
    [key: string]: {
      ID: number;
      URL: string;
      guid: string;
      mime_type: string;
      width: number;
      height: number;
    };
  };
}

export interface TransformedPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
  };
  publishedAt: string;
  image: string;
  featuredImage: string;
  images: string[];
  category: string;
  tags: string[];
  slug: string;
}

interface BlogPostPageProps {
  post: TransformedPost;
  relatedPosts: TransformedPost[];
}

// Helper function for consistent date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

// Function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text.replace(/<[^>]*>/g, '');
  return textarea.value;
}

// Function to extract image URLs from HTML content
function extractImagesFromContent(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }
  
  return images;
}

// Transform WordPress post to our format
function transformWordPressPost(post: WordPressPost): TransformedPost {
  const categoryNames = Object.values(post.categories || {}).map((cat) => cat.name);
  const tagNames = Object.values(post.tags || {}).map((tag) => tag.name);
  const images = extractImagesFromContent(post.content);
  
  let featuredImage = post.featured_image;
  if (!featuredImage && post.attachments) {
    const firstAttachment = Object.values(post.attachments)[0];
    if (firstAttachment) {
      featuredImage = firstAttachment.URL;
    }
  }
  if (!featuredImage && images.length > 0) {
    featuredImage = images[0];
  }
  if (!featuredImage) {
    featuredImage = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
  }

  return {
    _id: post.ID.toString(),
    title: decodeHTMLEntities(post.title),
    excerpt: decodeHTMLEntities(post.excerpt),
    content: post.content,
    author: post.author,
    publishedAt: post.date,
    image: featuredImage,
    featuredImage,
    images,
    category: categoryNames[0] || 'General',
    tags: tagNames,
    slug: post.slug,
  };
}

// Fetch all posts from WordPress API
async function fetchAllPosts(): Promise<TransformedPost[]> {
  try {
    const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts?number=100');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    return data.posts.map(transformWordPressPost);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, relatedPosts }) => {
  const { t, language } = useLanguage();

  if (!post) {
    return (
      <Layout
        title={language === 'tr' ? 'Blog Yazısı Bulunamadı - Beyond2C' : 'Blog Post Not Found - Beyond2C'}
        description={language === 'tr' ? 'Aradığınız blog yazısı bulunamadı' : 'The blog post you are looking for could not be found'}
      >
        <div className="min-h-screen bg-black">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-8">😕</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {language === 'tr' ? 'Blog yazısı bulunamadı' : 'Blog post not found'}
            </h1>
            <p className="text-accent-500 mb-8">
              {language === 'tr' ? 'Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.' : 'The blog post you are looking for may not exist or has been removed.'}
            </p>
            <Link href="/blog">
              <Button variant="primary" size="large">
                ← {language === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Create clean excerpt for meta description
  const cleanExcerpt = post.excerpt ? 
    decodeHTMLEntities(post.excerpt).substring(0, 160) : 
    decodeHTMLEntities(post.content).substring(0, 160);

  return (
    <Layout 
      title={`${post.title} - Beyond2C Climate Action Blog`}
      description={cleanExcerpt}
      keywords={post.tags}
      type="article"
      ogImage={post.featuredImage}
      locale={language === 'tr' ? 'tr_TR' : 'en_US'}
      url={`/blog/${post.slug}`}
      author={post.author.name}
      publishedTime={post.publishedAt}
      section="Climate Action"
      tags={post.tags}
    >
      <div className="min-h-screen bg-black pb-20">
        {/* Back Navigation */}
        <div className="bg-secondary-900/80 backdrop-blur-sm border-b border-primary-500">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link 
              href="/blog"
              className="inline-flex items-center text-primary-500 hover:text-accent-500 font-medium"
            >
              ← {language === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}
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
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="bg-secondary-800 text-accent-400 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-primary-500">
              <h3 className="text-2xl font-bold text-white mb-6">
                {language === 'tr' ? 'İlgili Yazılar' : 'Related Posts'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: TransformedPost) => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await fetchAllPosts();
    const paths = posts.map((post) => ({
      params: { slug: post.slug }
    }));

    return {
      paths,
      fallback: false // Static export - generate all pages at build time
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: false
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const posts = await fetchAllPosts();
    const post = posts.find((p) => p.slug === params?.slug);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // Find related posts (same category, excluding current post)
    const relatedPosts = posts
      .filter((p) => p.category === post.category && p._id !== post._id)
      .slice(0, 3);

    return {
      props: {
        post,
        relatedPosts,
      },
      // revalidate: 3600, // Removed for static export
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default BlogPostPage; 
       