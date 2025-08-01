import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const generateSitemap = (urls: SitemapUrl[]): string => {
  const urlElements = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Production URL'ini kesinlikle zorla
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // Request header'dan host bilgisini al
    const host = req.headers.host;
    
    // Eğer custom domain üzerinden geliyorsa onu kullan
    if (host && (host.includes('beyond2c.org') || host.includes('www.beyond2c.org'))) {
      baseUrl = `https://${host}`;
    }
    // Environment variable yoksa veya pages.dev içeriyorsa, production URL'ini zorla
    else if (!baseUrl || baseUrl.includes('pages.dev') || baseUrl.includes('localhost')) {
      baseUrl = 'https://www.beyond2c.org';
    }
    
    console.log('Sitemap using base URL:', baseUrl);
    console.log('Request host:', host);
    const now = new Date().toISOString();

    const urls: SitemapUrl[] = [
      // Static pages - High priority
      {
        loc: `${baseUrl}/`,
        lastmod: now,
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${baseUrl}/about`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/issues`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/blog`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${baseUrl}/voices`,
        lastmod: now,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${baseUrl}/impact-map`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${baseUrl}/data-hub`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: `${baseUrl}/resources`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: `${baseUrl}/take-action`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${baseUrl}/contact`,
        lastmod: now,
        changefreq: 'monthly',
        priority: 0.5
      }
    ];

    // Get WordPress posts (Blog & Voices) - Sadece WordPress'ten çek
    try {
      const wpApiUrl = process.env.WORDPRESS_API_URL || 'https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts';
      
      console.log('Fetching WordPress posts from:', wpApiUrl);
      
      // WordPress.com Public API - fetch posts
      const wpResponse = await axios.get(wpApiUrl, {
        timeout: 5000, // 5 saniye timeout (kısaltıldı)
        params: {
          number: 50, // 50 post (azaltıldı)
          fields: 'slug,modified,categories' // Sadece gerekli alanlar
        }
      });

      // Add WordPress posts to sitemap
      if (wpResponse.data && wpResponse.data.posts && Array.isArray(wpResponse.data.posts)) {
        const wordpressPosts = wpResponse.data.posts;
        
        // Blog posts (voices kategorisi hariç)
        const blogPosts = wordpressPosts.filter((post: any) => {
          // Voices kategorisini kontrol et (kategori adı veya ID ile)
          const hasVoicesCategory = post.categories && 
            Object.values(post.categories).some((cat: any) => 
              cat.name?.toLowerCase().includes('voices') || 
              cat.slug?.toLowerCase().includes('voices')
            );
          return !hasVoicesCategory;
        });

        // Voices posts
        const voicesPosts = wordpressPosts.filter((post: any) => {
          const hasVoicesCategory = post.categories && 
            Object.values(post.categories).some((cat: any) => 
              cat.name?.toLowerCase().includes('voices') || 
              cat.slug?.toLowerCase().includes('voices')
            );
          return hasVoicesCategory;
        });

        // Add blog posts to sitemap
        blogPosts.forEach((post: any) => {
          urls.push({
            loc: `${baseUrl}/blog/${post.slug}`,
            lastmod: new Date(post.modified).toISOString(),
            changefreq: 'weekly',
            priority: 0.7
          });
        });

        // Add voices to sitemap
        voicesPosts.forEach((post: any) => {
          urls.push({
            loc: `${baseUrl}/voices/${post.slug}`,
            lastmod: new Date(post.modified).toISOString(),
            changefreq: 'weekly',
            priority: 0.6
          });
        });

        console.log(`Added ${blogPosts.length} WordPress blog posts and ${voicesPosts.length} voices to sitemap`);
        console.log(`Total WordPress posts found: ${wordpressPosts.length}`);
      }
    } catch (wpError) {
      console.warn('WordPress sitemap data fetch failed:', wpError);
      console.log('Continuing without WordPress posts...');
      // WordPress verisi alınamazsa devam et
    }

    const sitemap = generateSitemap(urls);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating sitemap',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
