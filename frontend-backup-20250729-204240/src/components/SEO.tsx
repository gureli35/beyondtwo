import React from 'react';
import Head from 'next/head';
import { SEOProps } from '@/types';

interface EnhancedSEOProps extends SEOProps {
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  structuredData?: object;
}

const SEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  keywords = [],
  author = 'Beyond2C Team',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'tr_TR',
  alternateLocales = ['en_US'],
  structuredData,
}) => {
  const baseUrl = 'https://beyond2c.org';
  const fullTitle = title === 'Beyond2C' ? title : `${title} | Beyond2C`;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Default keywords for climate action website
  const defaultKeywords = [
    'iklim değişikliği', 'climate change', 'beyond2c', 'çevre koruma', 
    'sürdürülebilirlik', 'iklim krizi', 'yeşil yaşam', 'çevre aktivizmi',
    'iklim eylemi', 'climate action', 'environmental protection', 'sustainability'
  ];
  
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  // Generate structured data for better search results
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebSite',
    "name": fullTitle,
    "description": description,
    "url": fullUrl,
    "image": fullImage,
    "publisher": {
      "@type": "Organization",
      "name": "Beyond2C",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/2Clogo.png`
      }
    },
    ...(type === 'article' && publishedTime && {
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "author": {
        "@type": "Person",
        "name": author
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
      }
    })
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Language and Locale */}
      <meta httpEquiv="Content-Language" content={locale.split('_')[0]} />
      <meta property="og:locale" content={locale} />
      {alternateLocales.map(altLocale => (
        <meta key={altLocale} property="og:locale:alternate" content={altLocale} />
      ))}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={`${title} - Beyond2C`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Beyond2C" />
      {section && <meta property="article:section" content={section} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@beyond2c" />
      <meta name="twitter:creator" content="@beyond2c" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={`${title} - Beyond2C`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#2D7D46" />
      <meta name="msapplication-TileColor" content="#2D7D46" />
      <meta name="application-name" content="Beyond2C" />
      <meta name="apple-mobile-web-app-title" content="Beyond2C" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Favicon and Icons */}
      <link rel="icon" href="/icons/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//images.unsplash.com" />
    </Head>
  );
};

export default SEO;
