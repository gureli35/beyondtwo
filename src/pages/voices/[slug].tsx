import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { TransformedPost } from '@/hooks/useWordPressPosts';

interface VoicePageProps {
  voice: TransformedPost;
  relatedVoices: TransformedPost[];
}

const VoicePage: React.FC<VoicePageProps> = ({ voice, relatedVoices }) => {
  const { language } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate reading time (roughly 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(voice.content);

  const getCategoryLabel = (category: string) => {
    const labels = {
      Voices: language === 'tr' ? 'Gençlik Sesleri' : 'Youth Voices',
      Youth: language === 'tr' ? 'Gençlik' : 'Youth',
      Energy: language === 'tr' ? 'Enerji' : 'Energy',
      Transportation: language === 'tr' ? 'Ulaşım' : 'Transportation',
      Education: language === 'tr' ? 'Eğitim' : 'Education',
      Technology: language === 'tr' ? 'Teknoloji' : 'Technology'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Layout
      title={`${voice.title} - Beyond2C`}
      description={voice.excerpt || voice.content.replace(/<[^>]*>/g, '').substring(0, 160)}
      image={voice.featuredImage}
    >
      <Head>
        <meta property="og:type" content="article" />
        <meta property="article:author" content={voice.author.name} />
        <meta property="article:published_time" content={voice.publishedAt} />
        <meta property="article:section" content={voice.category} />
        {voice.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-secondary-800 to-black text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-red-500/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-500/30">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-primary-300 hover:text-white transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    {language === 'tr' ? 'Ana Sayfa' : 'Home'}
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-primary-300">/</span>
                    <Link href="/voices" className="text-primary-300 hover:text-white transition-colors flex items-center gap-1">
                      <span>🎤</span>
                      {language === 'tr' ? 'Gençlik Sesleri' : 'Youth Voices'}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-primary-300">/</span>
                    <span className="text-white font-medium">{voice.title.length > 30 ? voice.title.substring(0, 30) + '...' : voice.title}</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="bg-gradient-to-r from-primary-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{getCategoryLabel(voice.category)}</span>
                  </div>
                </span>
                <span className="bg-black/70 backdrop-blur-sm text-accent-500 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-accent-500/30">
                  🎤 {language === 'tr' ? 'Gençlik Hikayesi' : 'Youth Story'}
                </span>
              </div>

              <h1 className="font-montserrat font-black text-4xl md:text-6xl lg:text-7xl mb-8 text-shadow-red leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-white via-primary-100 to-accent-500 bg-clip-text text-transparent">
                  {voice.title}
                </span>
              </h1>

              {voice.excerpt && (
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-primary-500/30 mb-8 max-w-4xl mx-auto">
                  <p className="text-xl md:text-2xl text-primary-100 leading-relaxed">
                    {voice.excerpt.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center justify-center gap-8 text-primary-200 flex-wrap mt-8">
                <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border border-primary-500/30">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-red-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {voice.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">{voice.author.name}</p>
                    <p className="text-primary-300 text-sm">{language === 'tr' ? 'Yazar' : 'Author'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-3 rounded-full border border-primary-500/30">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-medium">{formatDate(voice.publishedAt)}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-3 rounded-full border border-primary-500/30">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-medium">{readingTime} {language === 'tr' ? 'dk okuma' : 'min read'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {voice.featuredImage && (
        <section className="relative">
          <div className="h-96 md:h-[500px] lg:h-[600px] bg-gray-900 overflow-hidden relative">
            <img
              src={voice.featuredImage}
              alt={voice.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Floating elements */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-primary-500/30 max-w-md">
                <p className="text-white font-medium text-sm">
                  📸 {language === 'tr' ? 'Hikaye Görseli' : 'Story Image'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert prose-primary">
              <div 
                className="content text-gray-300"
                dangerouslySetInnerHTML={{ __html: voice.content }}
                style={{
                  lineHeight: '1.8',
                }}
              />
            </div>

            {/* Tags */}
            {voice.tags.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {language === 'tr' ? 'Etiketler' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {voice.tags.map((tag, index) => (
                    <span key={index} className="bg-secondary-700 text-accent-500 px-3 py-1 border border-secondary-600 text-sm">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="mt-12 pt-8 border-t border-secondary-600">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {language === 'tr' ? 'Paylaş' : 'Share'}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: voice.title,
                        text: voice.excerpt,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="bg-primary-600 text-white px-4 py-2 hover:bg-primary-700 transition-colors border border-primary-500"
                >
                  📤 {language === 'tr' ? 'Paylaş' : 'Share'}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(language === 'tr' ? 'Link kopyalandı!' : 'Link copied!');
                  }}
                  className="bg-secondary-700 text-white px-4 py-2 hover:bg-secondary-600 transition-colors border border-secondary-600"
                >
                  📋 {language === 'tr' ? 'Linki Kopyala' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Voices */}
      {relatedVoices.length > 0 && (
        <section className="section-padding bg-secondary-700">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-white">
                {language === 'tr' ? 'İlgili Hikayeler' : 'Related Stories'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedVoices.map((relatedVoice) => (
                  <Link key={relatedVoice._id} href={`/voices/${relatedVoice.slug}`}>
                    <div className="propaganda-box hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                      {relatedVoice.featuredImage && (
                        <div className="relative overflow-hidden h-48">
                          <img
                            src={relatedVoice.featuredImage}
                            alt={relatedVoice.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
                          {relatedVoice.title}
                        </h3>
                        {relatedVoice.excerpt && (
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                            {relatedVoice.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                          <span className="text-accent-500">{relatedVoice.author.name}</span>
                          <span>{calculateReadingTime(relatedVoice.content)} {language === 'tr' ? 'dk' : 'min'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Fetch WordPress posts to get slugs for voices category
    const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.posts) {
      // Filter only voices category posts
      const voicesPosts = data.posts.filter((post: any) => {
        if (post.categories && typeof post.categories === 'object') {
          const categoryValues = Object.values(post.categories);
          if (categoryValues.length > 0 && categoryValues[0] && typeof categoryValues[0] === 'object') {
            const firstCategory = categoryValues[0] as any;
            return firstCategory.name && firstCategory.name.toLowerCase() === 'voices';
          }
        }
        return false;
      });

      const paths = voicesPosts.map((post: any) => ({
        params: { slug: post.slug }
      }));

      return { paths, fallback: 'blocking' };
    }

    return { paths: [], fallback: 'blocking' };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // Fetch WordPress posts
    const response = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.posts) {
      return { notFound: true };
    }

    // Find the specific post by slug
    const foundPost = data.posts.find((post: any) => post.slug === params?.slug);
    
    if (!foundPost) {
      return { notFound: true };
    }

    // Check if this post is in voices category
    let isVoicesCategory = false;
    if (foundPost.categories && typeof foundPost.categories === 'object') {
      const categoryValues = Object.values(foundPost.categories);
      if (categoryValues.length > 0 && categoryValues[0] && typeof categoryValues[0] === 'object') {
        const firstCategory = categoryValues[0] as any;
        isVoicesCategory = firstCategory.name && firstCategory.name.toLowerCase() === 'voices';
      }
    }

    if (!isVoicesCategory) {
      return { notFound: true };
    }

    // Transform the post to match our app's structure
    const transformPost = (post: any): TransformedPost => {
      // Extract category name safely
      let categoryName = 'Voices';
      if (post.categories && typeof post.categories === 'object') {
        const categoryValues = Object.values(post.categories);
        if (categoryValues.length > 0 && categoryValues[0] && typeof categoryValues[0] === 'object') {
          const firstCategory = categoryValues[0] as any;
          categoryName = firstCategory.name || 'Voices';
        }
      }
      
      // Extract tags safely
      const tagsList: string[] = [];
      if (post.tags && typeof post.tags === 'object') {
        Object.values(post.tags).forEach((tag: any) => {
          if (tag && typeof tag === 'object' && tag.name) {
            tagsList.push(tag.name);
          }
        });
      }

      return {
        _id: post.ID.toString(),
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: {
          name: post.author ? post.author.name : 'Beyond2C'
        },
        publishedAt: post.date || new Date().toISOString(),
        image: post.featured_image || '',
        featuredImage: post.featured_image || '',
        images: [],
        category: categoryName,
        tags: tagsList,
        slug: post.slug || '',
      };
    };

    const voice = transformPost(foundPost);

    // Get related voices (other posts in voices category, excluding current post)
    const relatedPosts = data.posts
      .filter((post: any) => {
        // Exclude current post
        if (post.slug === params?.slug) return false;
        
        // Check if it's in voices category
        if (post.categories && typeof post.categories === 'object') {
          const categoryValues = Object.values(post.categories);
          if (categoryValues.length > 0 && categoryValues[0] && typeof categoryValues[0] === 'object') {
            const firstCategory = categoryValues[0] as any;
            return firstCategory.name && firstCategory.name.toLowerCase() === 'voices';
          }
        }
        return false;
      })
      .slice(0, 3) // Limit to 3 related posts
      .map(transformPost);

    return {
      props: {
        voice,
        relatedVoices: relatedPosts,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching voice:', error);
    return { notFound: true };
  }
};

export default VoicePage;
