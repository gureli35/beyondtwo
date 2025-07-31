// filepath: /Users/furkan/Desktop/beyond2c/beyond2c-platform/src/pages/api/news.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

// rss-parser için özel alanları tanımla
interface CustomFeed {
  [key: string]: any;
}

interface CustomItem {
  [key: string]: any;
  'media:thumbnail': { $: { url: string } };
}

const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: [['media:thumbnail', 'media:thumbnail', { keepArray: false }]],
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { language = 'en', page = 1, limit = 12 } = req.query;
    
    // Birden fazla RSS akışı URL'si
    const rssUrls = [
      'https://yaleclimateconnections.org/feed/',
      'https://climategen.org/feed/',
      'https://www.greenpeace.org.au/feed/',
      'https://climatechangedispatch.com/feed/',
      'https://www.climatepolicyinitiative.org/feed/',
      'https://iceblog.org/feed/',
      'https://hothouse.substack.com/feed',
      'https://blogs.law.columbia.edu/climatechange/feed/'
    ];

    console.log('Fetching RSS feeds from multiple sources...');

    // Tüm RSS akışlarını paralel olarak çek
    const feedPromises = rssUrls.map(async (url) => {
      try {
        console.log(`Fetching from: ${url}`);
        const feed = await parser.parseURL(url);
        return {
          source: url,
          items: feed.items || [],
          title: feed.title || 'Unknown Source'
        };
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        return {
          source: url,
          items: [],
          title: 'Failed Source'
        };
      }
    });

    const feeds = await Promise.all(feedPromises);
    
    // Tüm haberleri birleştir
    const allItems = feeds.flatMap((feed) => 
      feed.items.map((item) => ({
        ...item,
        feedSource: feed.title,
        feedUrl: feed.source
      }))
    );
    
    console.log(`Found total ${allItems.length} items from all feeds.`);

    // Haberleri tarihe göre sırala (en yeni önce)
    const sortedItems = allItems.sort((a, b) => {
      const dateA = new Date(a.isoDate || a.pubDate || 0);
      const dateB = new Date(b.isoDate || b.pubDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Sayfalama için slice işlemi
    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    // API yanıtını standardize et
    const formattedNews = {
      success: true,
      data: paginatedItems.map((item) => {
        // Kategoriyi başlık veya içerikten belirlemeye çalış
        let category = 'Climate Science';
        const titleLower = item.title?.toLowerCase() || '';
        const contentLower = (item.contentSnippet || item.content || '').toLowerCase();
        
        if (titleLower.includes('climate') || contentLower.includes('climate')) {
          category = language === 'tr' ? 'İklim Değişikliği' : 'Climate Change';
        } else if (titleLower.includes('energy') || contentLower.includes('energy')) {
          category = language === 'tr' ? 'Enerji' : 'Energy';
        } else if (titleLower.includes('policy') || contentLower.includes('policy')) {
          category = language === 'tr' ? 'İklim Politikası' : 'Climate Policy';
        } else if (titleLower.includes('technology') || contentLower.includes('technology')) {
          category = language === 'tr' ? 'Teknoloji' : 'Technology';
        } else if (titleLower.includes('wildlife') || contentLower.includes('wildlife')) {
          category = language === 'tr' ? 'Yaban Hayatı' : 'Wildlife';
        } else if (titleLower.includes('space') || contentLower.includes('space')) {
          category = language === 'tr' ? 'Uzay' : 'Space';
        } else if (titleLower.includes('renewable') || contentLower.includes('renewable')) {
          category = language === 'tr' ? 'Yenilenebilir Enerji' : 'Renewable Energy';
        }

        // Kaynak adını belirle
        let sourceName = item.feedSource || 'Unknown Source';
        if (item.feedUrl?.includes('bbci.co.uk')) {
          sourceName = 'BBC News';
        } else if (item.feedUrl?.includes('yaleclimateconnections.org')) {
          sourceName = 'Yale Climate Connections';
        } else if (item.feedUrl?.includes('climategen.org')) {
          sourceName = 'Climate Generation';
        } else if (item.feedUrl?.includes('greenpeace.org.au')) {
          sourceName = 'Greenpeace Australia';
        } else if (item.feedUrl?.includes('climatechangedispatch.com')) {
          sourceName = 'Climate Change Dispatch';
        } else if (item.feedUrl?.includes('climatepolicyinitiative.org')) {
          sourceName = 'Climate Policy Initiative';
        } else if (item.feedUrl?.includes('iceblog.org')) {
          sourceName = 'ICE Blog';
        } else if (item.feedUrl?.includes('hothouse.substack.com')) {
          sourceName = 'Hothouse';
        } else if (item.feedUrl?.includes('blogs.law.columbia.edu')) {
          sourceName = 'Columbia Climate Law';
        }

        // URL'den ID çıkart
        const articleId = (item.guid || item.link || '').split('/').filter(Boolean).pop() || Math.random().toString(36).substr(2, 9);

        // URL'yi doğrula ve temizle
        let articleUrl = item.link || '#';
        if (articleUrl && articleUrl !== '#') {
          try {
            // URL'nin geçerli olduğundan emin ol
            const url = new URL(articleUrl);
            articleUrl = url.toString();
          } catch (error) {
            console.warn('Invalid URL found:', articleUrl);
            articleUrl = '#';
          }
        }

        return {
          id: articleId,
          title: item.title || (language === 'tr' ? 'Başlık Yok' : 'No title'),
          summary: item.contentSnippet || item.content?.substring(0, 200) + '...' || (language === 'tr' ? 'Özet mevcut değil.' : 'No summary available.'),
          url: articleUrl,
          image: item['media:thumbnail']?.$?.url || null, // null döndür ki frontend'te fallback gösterilsin
          publishDate: item.isoDate || item.pubDate || new Date().toISOString(),
          source: sourceName,
          category: category,
          language: 'en' // Çoğu RSS feed İngilizce
        };
      }),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: sortedItems.length,
        totalPages: Math.ceil(sortedItems.length / parseInt(limit as string))
      }
    };

    res.status(200).json(formattedNews);
  } catch (error) {
    console.error('RSS Fetching Error:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch news from RSS feed.',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}
