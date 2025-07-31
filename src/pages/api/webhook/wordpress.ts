import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import axios from 'axios';

// WordPress webhook endpoint for sitemap updates
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // WordPress webhook secret for security
    const webhookSecret = process.env.WORDPRESS_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('WORDPRESS_WEBHOOK_SECRET not configured');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    // Verify webhook signature if provided
    const signature = req.headers['x-wp-signature'] as string;
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (signature !== `sha256=${expectedSignature}`) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    }

    // Parse webhook data
    const { post_status, post_type, post_id, hook } = req.body;

    console.log('WordPress webhook received:', {
      hook,
      post_type,
      post_status,
      post_id,
      timestamp: new Date().toISOString()
    });

    // Only process published posts
    if (post_type === 'post' && post_status === 'publish') {
      // Trigger sitemap regeneration
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://beyond2c.org';
      
      try {
        // Clear any sitemap cache and regenerate
        await axios.get(`${baseUrl}/api/sitemap-refresh`);
        
        console.log('Sitemap refresh triggered successfully');
        
        // Optional: Clear CDN cache if you're using one
        if (process.env.CLOUDFLARE_ZONE_ID && process.env.CLOUDFLARE_API_TOKEN) {
          await clearCloudflareCache();
        }
        
      } catch (error) {
        console.error('Error refreshing sitemap:', error);
        // Don't fail the webhook if sitemap refresh fails
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      processed: post_type === 'post' && post_status === 'publish'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Clear Cloudflare cache for sitemap
async function clearCloudflareCache() {
  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`,
      {
        files: [
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/sitemap.xml`,
          `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Cloudflare cache cleared:', response.data);
  } catch (error) {
    console.error('Error clearing Cloudflare cache:', error);
  }
}
