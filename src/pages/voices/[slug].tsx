import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import connectDB from '@/lib/mongodb';
import Voice from '@/models/Voice';

interface VoicePageProps {
  voice: {
    _id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    featuredImage?: string;
    author: {
      name: string;
      age?: number;
      location: {
        city?: string;
        region?: string;
        country?: string;
      };
      bio?: string;
      image?: string;
    };
    category: string;
    tags: string[];
    status: string;
    featured: boolean;
    storyType: string;
    impact?: {
      description?: string;
      metrics?: Array<{
        name: string;
        value: string;
        unit: string;
      }>;
      beneficiaries?: number;
      timeframe?: string;
    };
    callToAction?: string;
    contact?: {
      email?: string;
      phone?: string;
      website?: string;
      social?: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
      };
    };
    views: number;
    likes: number;
    shares: number;
    readingTime: number;
    publishedAt: string;
    createdAt: string;
    showAuthorContact: boolean;
  };
  relatedVoices: Array<{
    _id: string;
    title: string;
    excerpt?: string;
    slug: string;
    featuredImage?: string;
    author: {
      name: string;
      location: {
        city?: string;
        country?: string;
      };
    };
    category: string;
    readingTime: number;
    publishedAt: string;
  }>;
}

const VoicePage: React.FC<VoicePageProps> = ({ voice, relatedVoices }) => {
  const { t, language } = useLanguage();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStoryTypeLabel = (type: string) => {
    const labels = {
      personal: language === 'tr' ? 'Kişisel Deneyim' : 'Personal Experience',
      community: language === 'tr' ? 'Topluluk Projesi' : 'Community Project',
      project: language === 'tr' ? 'Proje Deneyimi' : 'Project Experience',
      campaign: language === 'tr' ? 'Kampanya' : 'Campaign',
      research: language === 'tr' ? 'Araştırma' : 'Research'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
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
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="text-primary-300 hover:text-white">
                    {language === 'tr' ? 'Ana Sayfa' : 'Home'}
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-primary-300">/</span>
                    <Link href="/voices" className="text-primary-300 hover:text-white">
                      {language === 'tr' ? 'Gençlik Sesleri' : 'Youth Voices'}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-primary-300">/</span>
                    <span className="text-white">{voice.title}</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {getCategoryLabel(voice.category)}
                </span>
                <span className="bg-accent-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {getStoryTypeLabel(voice.storyType)}
                </span>
                {voice.featured && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ {language === 'tr' ? 'Öne Çıkan' : 'Featured'}
                  </span>
                )}
              </div>

              <h1 className="font-montserrat font-black text-4xl md:text-6xl mb-6 text-shadow leading-tight">
                {voice.title}
              </h1>

              {voice.excerpt && (
                <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                  {voice.excerpt}
                </p>
              )}

              {/* Author Info */}
              <div className="flex items-center justify-center gap-6 text-primary-200">
                <div className="flex items-center gap-3">
                  {voice.author.image ? (
                    <img
                      src={voice.author.image}
                      alt={voice.author.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-300"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {voice.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-white">{voice.author.name}</p>
                    {voice.author.age && (
                      <p className="text-sm">{voice.author.age} {language === 'tr' ? 'yaşında' : 'years old'}</p>
                    )}
                  </div>
                </div>

                {voice.author.location.city && (
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>
                      {voice.author.location.city}
                      {voice.author.location.region && `, ${voice.author.location.region}`}
                      {voice.author.location.country && `, ${voice.author.location.country}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{formatDate(voice.publishedAt)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <span>⏱️</span>
                  <span>{voice.readingTime} {language === 'tr' ? 'dk okuma' : 'min read'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {voice.featuredImage && (
        <section className="relative">
          <div className="h-96 bg-gray-900 overflow-hidden">
            <img
              src={voice.featuredImage}
              alt={voice.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="section-padding bg-black">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-invert prose-primary">
              <div 
                className="content text-accent-500"
                dangerouslySetInnerHTML={{ __html: voice.content }}
                style={{
                  color: '#F39C12',
                }}
              />
            </div>

            {/* Author Bio */}
            {voice.author.bio && (
              <div className="mt-12 p-6 bg-secondary-800 border-l-4 border-primary-500 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">
                  {language === 'tr' ? 'Yazar Hakkında' : 'About the Author'}
                </h3>
                <div className="flex items-start gap-4">
                  {voice.author.image ? (
                    <img
                      src={voice.author.image}
                      alt={voice.author.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {voice.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-lg text-white">{voice.author.name}</h4>
                    <p className="text-gray-300 mt-2">{voice.author.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Section */}
            {voice.impact?.description && (
              <div className="mt-12 p-6 bg-secondary-700 border-l-4 border-accent-500 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-accent-500">
                  {language === 'tr' ? 'Etki ve Sonuçlar' : 'Impact & Results'}
                </h3>
                <p className="text-gray-300 mb-4">{voice.impact.description}</p>

                {voice.impact.metrics && voice.impact.metrics.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {voice.impact.metrics.map((metric, index) => (
                      <div key={index} className="bg-secondary-900 p-4 text-center border border-secondary-600">
                        <div className="text-2xl font-bold text-accent-500">
                          {metric.value} {metric.unit}
                        </div>
                        <div className="text-sm text-gray-400">{metric.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {voice.impact.beneficiaries && (
                  <div className="mt-4 text-gray-300">
                    <strong className="text-accent-500">{language === 'tr' ? 'Faydalanıcılar:' : 'Beneficiaries:'}</strong> {voice.impact.beneficiaries} {language === 'tr' ? 'kişi' : 'people'}
                  </div>
                )}

                {voice.impact.timeframe && (
                  <div className="mt-2 text-gray-300">
                    <strong className="text-accent-500">{language === 'tr' ? 'Zaman Çerçevesi:' : 'Timeframe:'}</strong> {voice.impact.timeframe}
                  </div>
                )}
              </div>
            )}

            {/* Call to Action */}
            {voice.callToAction && (
              <div className="mt-12 p-6 bg-secondary-800 border-l-4 border-primary-500 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-primary-300">
                  {language === 'tr' ? 'Harekete Geç' : 'Take Action'}
                </h3>
                <p className="text-gray-300">{voice.callToAction}</p>
              </div>
            )}

            {/* Contact Info */}
            {voice.showAuthorContact && voice.contact && (
              <div className="mt-12 p-6 bg-secondary-700 border border-secondary-600 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">
                  {language === 'tr' ? 'İletişim' : 'Contact'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {voice.contact.email && (
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <a href={`mailto:${voice.contact.email}`} className="text-primary-300 hover:text-primary-500 transition-colors">
                        {voice.contact.email}
                      </a>
                    </div>
                  )}
                  {voice.contact.phone && (
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <a href={`tel:${voice.contact.phone}`} className="text-primary-300 hover:text-primary-500 transition-colors">
                        {voice.contact.phone}
                      </a>
                    </div>
                  )}
                  {voice.contact.website && (
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <a href={voice.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary-300 hover:text-primary-500 transition-colors">
                        {voice.contact.website}
                      </a>
                    </div>
                  )}
                  {voice.contact.social && (
                    <div className="flex items-center gap-4">
                      {voice.contact.social.instagram && (
                        <a href={voice.contact.social.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-300 hover:text-primary-500 transition-colors">
                          📷 Instagram
                        </a>
                      )}
                      {voice.contact.social.twitter && (
                        <a href={voice.contact.social.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-300 hover:text-primary-500 transition-colors">
                          🐦 Twitter
                        </a>
                      )}
                      {voice.contact.social.linkedin && (
                        <a href={voice.contact.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-300 hover:text-primary-500 transition-colors">
                          💼 LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

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
                          <span>{relatedVoice.readingTime} {language === 'tr' ? 'dk' : 'min'}</span>
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
    await connectDB();
    const voices = await Voice.find({ status: 'published' }, 'slug').lean();
    
    const paths = voices.map((voice: any) => ({
      params: { slug: voice.slug }
    }));

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    await connectDB();
    
    const voice = await Voice.findOne({ 
      slug: params?.slug,
      status: 'published'
    }).lean();

    if (!voice) {
      return { notFound: true };
    }

    // Get related voices (same category, excluding current voice)
    const relatedVoices = await Voice.find({
      _id: { $ne: (voice as any)._id },
      category: (voice as any).category,
      status: 'published'
    })
    .select('title excerpt slug featuredImage author category readingTime publishedAt')
    .limit(3)
    .lean();

    return {
      props: {
        voice: JSON.parse(JSON.stringify(voice)),
        relatedVoices: JSON.parse(JSON.stringify(relatedVoices)),
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching voice:', error);
    return { notFound: true };
  }
};

export default VoicePage;
