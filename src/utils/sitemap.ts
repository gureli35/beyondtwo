import { NextApiRequest, NextApiResponse } from 'next';

export interface SitemapTriggerOptions {
  action: 'create' | 'update' | 'delete';
  type: 'blog' | 'voice';
  slug?: string;
}

/**
 * Sitemap'i yeniden oluşturmak için trigger yapar
 * Bu fonksiyon blog yazısı veya voice eklendiğinde/güncellendiğinde çağrılır
 */
export const triggerSitemapRegeneration = async (options: SitemapTriggerOptions) => {
  try {
    // Production URL'ini kesinlikle zorla
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // Environment variable yoksa veya pages.dev içeriyorsa, production URL'ini zorla
    if (!baseUrl || baseUrl.includes('pages.dev') || baseUrl.includes('localhost')) {
      baseUrl = 'https://www.beyond2c.org';
    }
    
    // Sitemap API'sini çağırarak yeniden oluşturmasını sağla
    const response = await fetch(`${baseUrl}/api/sitemap.xml`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (response.ok) {
      console.log(`✅ Sitemap regenerated after ${options.action} ${options.type}${options.slug ? ` (${options.slug})` : ''}`);
      return true;
    } else {
      console.error(`❌ Failed to regenerate sitemap: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error triggering sitemap regeneration:', error);
    return false;
  }
};

/**
 * Sitemap ping'i - Arama motorlarına sitemap güncellendiğini bildirir
 */
export const notifySearchEngines = async () => {
  try {
    // Production URL'ini kesinlikle zorla
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    // Environment variable yoksa veya pages.dev içeriyorsa, production URL'ini zorla
    if (!baseUrl || baseUrl.includes('pages.dev') || baseUrl.includes('localhost')) {
      baseUrl = 'https://www.beyond2c.org';
    }
    
    const sitemapUrl = `${baseUrl}/api/sitemap.xml`;

    // Google'a ping gönder
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    // Bing'e ping gönder
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    // Production ortamında ping gönder
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BASE_URL?.includes('www.beyond2c.org')) {
      const promises = [
        fetch(googlePingUrl).catch(err => console.log('Google ping failed:', err.message)),
        fetch(bingPingUrl).catch(err => console.log('Bing ping failed:', err.message))
      ];

      await Promise.allSettled(promises);
      console.log('🔔 Search engines notified of sitemap update');
    } else {
      console.log('🔕 Skipping search engine notification (development/staging)');
    }
  } catch (error) {
    console.error('❌ Error notifying search engines:', error);
  }
};

/**
 * Blog veya voice işlemlerinden sonra sitemap güncelleme
 */
export const updateSitemapAfterContentChange = async (options: SitemapTriggerOptions) => {
  try {
    // Sitemap'i yeniden oluştur
    const regenerated = await triggerSitemapRegeneration(options);
    
    if (regenerated) {
      // Arama motorlarına bildir (sadece production'da)
      await notifySearchEngines();
    }
    
    return regenerated;
  } catch (error) {
    console.error('❌ Error updating sitemap after content change:', error);
    return false;
  }
};
