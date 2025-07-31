import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Sitemap refresh endpoint - triggered by webhooks
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for simplicity
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.beyond2c.org';
    
    // Force regenerate sitemap by calling it with cache-busting
    const sitemapResponse = await axios.get(`${baseUrl}/api/sitemap.xml`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      timeout: 30000 // 30 second timeout
    });

    if (sitemapResponse.status === 200) {
      console.log('Sitemap refreshed successfully at:', new Date().toISOString());
      
      // Optional: Submit to search engines
      await submitToSearchEngines(baseUrl);
      
      res.status(200).json({ 
        success: true, 
        message: 'Sitemap refreshed successfully',
        timestamp: new Date().toISOString(),
        sitemapUrl: `${baseUrl}/api/sitemap.xml`
      });
    } else {
      throw new Error(`Sitemap generation failed with status: ${sitemapResponse.status}`);
    }

  } catch (error) {
    console.error('Error refreshing sitemap:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sitemap refresh failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

// Submit sitemap to search engines
async function submitToSearchEngines(baseUrl: string) {
  const sitemapUrl = `${baseUrl}/api/sitemap.xml`;
  
  try {
    // Submit to Google
    if (process.env.GOOGLE_SEARCH_CONSOLE_API_KEY) {
      await axios.post(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(baseUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${process.env.GOOGLE_SEARCH_CONSOLE_API_KEY}`,
          }
        }
      );
      console.log('Sitemap submitted to Google Search Console');
    }

    // Submit to Bing
    if (process.env.BING_WEBMASTER_API_KEY) {
      await axios.post(
        `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${process.env.BING_WEBMASTER_API_KEY}`,
        {
          siteUrl: baseUrl,
          urlList: [sitemapUrl]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('Sitemap submitted to Bing Webmaster Tools');
    }

  } catch (error) {
    console.warn('Search engine submission failed (non-critical):', error);
    // Don't fail the refresh if search engine submission fails
  }
}
