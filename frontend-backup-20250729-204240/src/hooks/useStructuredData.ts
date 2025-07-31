import { useLanguage } from '@/context/LanguageContext';

export const useStructuredData = () => {
  const { language } = useLanguage();

  const generateWebsiteStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Beyond2C",
    "alternateName": "Beyond 2 Degrees",
    "url": "https://beyond2c.org",
    "description": language === 'tr' 
      ? "İklim krizi için harekete geçmek — çok geç olmadan önce. Z kuşağını yerel yönetimlerle buluşturan platform."
      : "Acting on the climate crisis — before it's too late. A platform connecting Gen Z with local governments.",
    "inLanguage": language === 'tr' ? "tr-TR" : "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://beyond2c.org/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Beyond2C",
      "logo": {
        "@type": "ImageObject",
        "url": "https://beyond2c.org/2Clogo.png"
      }
    }
  });

  const generateOrganizationStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Beyond2C",
    "alternateName": "Beyond 2 Degrees",
    "url": "https://beyond2c.org",
    "logo": "https://beyond2c.org/2Clogo.png",
    "description": language === 'tr'
      ? "İklim değişikliğine karşı Z kuşağını yerel yönetimlerle buluşturan iklim eylem platformu"
      : "Climate action platform connecting Gen Z with local governments against climate change",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/beyond2c",
      "https://www.linkedin.com/company/beyond2c",
      "https://www.instagram.com/beyond2c"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "TR",
      "availableLanguage": ["Turkish", "English"],
      "url": "https://beyond2c.org/contact"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    },
    "keywords": language === 'tr'
      ? "iklim değişikliği, çevre koruma, sürdürülebilirlik, gençlik hareketi"
      : "climate change, environmental protection, sustainability, youth movement"
  });

  const generateBlogStructuredData = () => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Beyond2C Blog",
    "description": language === 'tr'
      ? "İklim krizi, sürdürülebilirlik ve aktivizm hakkında güncel yazılar ve analizler"
      : "Current articles and analysis on climate crisis, sustainability and activism",
    "url": "https://beyond2c.org/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Beyond2C",
      "logo": {
        "@type": "ImageObject", 
        "url": "https://beyond2c.org/2Clogo.png"
      }
    },
    "inLanguage": language === 'tr' ? "tr-TR" : "en-US"
  });

  const generateArticleStructuredData = (article: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    image?: string;
    url: string;
    category?: string;
    tags?: string[];
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image || "https://beyond2c.org/images/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Beyond2C",
      "logo": {
        "@type": "ImageObject",
        "url": "https://beyond2c.org/2Clogo.png"
      }
    },
    "datePublished": article.publishedTime,
    "dateModified": article.modifiedTime || article.publishedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    "articleSection": article.category,
    "keywords": article.tags?.join(', '),
    "inLanguage": language === 'tr' ? "tr-TR" : "en-US"
  });

  const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  });

  return {
    generateWebsiteStructuredData,
    generateOrganizationStructuredData,
    generateBlogStructuredData,
    generateArticleStructuredData,
    generateBreadcrumbStructuredData
  };
};
