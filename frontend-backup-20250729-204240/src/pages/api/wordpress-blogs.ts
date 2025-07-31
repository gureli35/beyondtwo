import { NextApiRequest, NextApiResponse } from 'next';

interface WordPressPost {
  ID: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    slug: string;
  };
  categories: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
    };
  };
  tags: {
    [key: string]: {
      ID: number;
      name: string;
      slug: string;
    };
  };
  featured_image?: string;
  slug: string;
  URL: string;
  short_URL: string;
  like_count: number;
  comment_count: number;
}

interface WordPressResponse {
  found: number;
  posts: WordPressPost[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { page = 1, per_page = 10, category, search } = req.query;

  try {
    // WordPress API URL'i oluştur
    let apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts?number=${per_page}&page=${page}`;
    
    if (category && category !== 'all') {
      apiUrl += `&category=${category}`;
    }
    
    if (search) {
      apiUrl += `&search=${search}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Beyond2C-Platform/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: WordPressResponse = await response.json();

    // WordPress verilerini frontend formatına dönüştür
    const transformedPosts = data.posts.map((post: WordPressPost) => ({
      _id: post.ID.toString(),
      title: post.title,
      excerpt: post.excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      content: post.content,
      author: {
        name: post.author.name,
        username: post.author.slug
      },
      publishedAt: post.date,
      image: post.featured_image || '/images/blog-default.jpg',
      featuredImage: post.featured_image,
      category: Object.keys(post.categories).length > 0 ? 
        Object.values(post.categories)[0].name : 'Genel',
      tags: Object.values(post.tags || {}).map(tag => tag.name),
      featured: false, // WordPress'te featured field yoksa default false
      slug: post.slug,
      readingTime: Math.ceil(post.content.replace(/<[^>]*>/g, '').split(' ').length / 200),
      views: post.like_count || 0,
      wordpress_url: post.URL,
      short_url: post.short_URL,
      like_count: post.like_count,
      comment_count: post.comment_count
    }));

    // Kategorileri çıkar
    const categories = Array.from(new Set(
      data.posts.flatMap(post => 
        Object.values(post.categories || {}).map(cat => cat.name)
      )
    ));

    res.status(200).json({
      success: true,
      data: transformedPosts,
      pagination: {
        page: parseInt(page as string),
        per_page: parseInt(per_page as string),
        total: data.found,
        total_pages: Math.ceil(data.found / parseInt(per_page as string))
      },
      categories: categories,
      message: 'WordPress blog posts fetched successfully'
    });

  } catch (error) {
    console.error('WordPress API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching WordPress blog posts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
