import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Voice from '@/models/Voice';

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
    await connectDB();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://beyond2c.org';
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

    // Get published blog posts
    const publishedPosts = await Post.find({ 
      status: 'published' 
    })
    .select('slug updatedAt createdAt')
    .sort({ updatedAt: -1 })
    .lean();

    // Add blog posts to sitemap
    publishedPosts.forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: new Date(post.updatedAt || post.createdAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      });
    });

    // Get published voices
    const publishedVoices = await Voice.find({ 
      status: 'published' 
    })
    .select('slug updatedAt submittedAt')
    .sort({ updatedAt: -1 })
    .lean();

    // Add voices to sitemap
    publishedVoices.forEach(voice => {
      urls.push({
        loc: `${baseUrl}/voices/${voice.slug}`,
        lastmod: new Date(voice.updatedAt || voice.submittedAt).toISOString(),
        changefreq: 'weekly',
        priority: 0.6
      });
    });

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
