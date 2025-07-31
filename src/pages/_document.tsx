import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        {/* Character Set */}
        <meta charSet="utf-8" />
        
        {/* Core Meta Tags */}
        <meta name="description" content="Beyond2C - İklim değişikliğine karşı birlikte hareket edelim. Z kuşağını yerel yönetimlerle buluşturan iklim eylem platformu." />
        <meta name="keywords" content="iklim değişikliği, climate change, beyond2c, çevre koruma, sürdürülebilirlik, iklim krizi, yeşil yaşam, çevre aktivizmi, iklim eylemi, climate action" />
        <meta name="author" content="Beyond2C Team" />
        <meta name="generator" content="Next.js" />
        
        {/* Mobile Meta Tags (viewport _app.tsx'de handle edilecek) */}
        <meta name="theme-color" content="#2D7D46" />
        <meta name="msapplication-TileColor" content="#2D7D46" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Beyond2C" />
        
        {/* SEO and Crawling */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Icons and Manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/2Clogo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Canonical Link */}
        <link rel="canonical" href="https://tarhunta.xyz" />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="tr" href="https://tarhunta.xyz" />
        <link rel="alternate" hrefLang="en" href="https://tarhunta.xyz" />
        <link rel="alternate" hrefLang="x-default" href="https://tarhunta.xyz" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Beyond2C",
              "alternateName": "Beyond 2 Degrees",
              "url": "https://tarhunta.xyz",
              "logo": "https://tarhunta.xyz/2Clogo.png",
              "description": "İklim değişikliğine karşı Z kuşağını yerel yönetimlerle buluşturan iklim eylem platformu",
              "foundingDate": "2024",
              "sameAs": [
                "https://twitter.com/beyond2c",
                "https://www.linkedin.com/company/beyond2c",
                "https://www.instagram.com/beyond2c"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-XXX-XXX-XXXX",
                "contactType": "customer service",
                "areaServed": "TR",
                "availableLanguage": ["Turkish", "English"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "TR"
              }
            })
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Beyond2C",
              "url": "https://tarhunta.xyz",
              "description": "İklim değişikliğine karşı birlikte hareket edelim",
              "inLanguage": ["tr-TR", "en-US"],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tarhunta.xyz/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
