import { NextApiRequest, NextApiResponse } from 'next';

export interface WordPressPost {
  ID: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  URL: string;
  short_URL: string;
  featured_image?: string;
  author: {
    ID: number;
    login: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    nice_name: string;
    URL: string;
    avatar_URL: string;
  };
  tags: Record<string, any>;
  categories: Record<string, any>;
  status: string;
  sticky: boolean;
  slug: string;
  password: string;
  parent: boolean;
  type: string;
  comments_open: boolean;
  pings_open: boolean;
  likes_enabled: boolean;
  sharing_enabled: boolean;
  comment_count: number;
  like_count: number;
  i_like: boolean;
  is_reblogged: boolean;
  is_following: boolean;
  global_ID: string;
  featured_media?: number;
  format: string;
}

export interface WordPressApiResponse {
  found: number;
  posts: WordPressPost[];
  meta: {
    links: {
      self: string;
      help: string;
      site: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { page = 1, per_page = 10, search = '' } = req.query;
    
    const params = new URLSearchParams({
      number: per_page.toString(),
      offset: ((Number(page) - 1) * Number(per_page)).toString(),
      order_by: 'date',
      order: 'DESC',
      ...(search && { search: search.toString() })
    });

    const apiUrl = `https://public-api.wordpress.com/rest/v1.1/sites/beyond2capi.wordpress.com/posts?${params}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Beyond2C-Platform/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    const data: WordPressApiResponse = await response.json();

    // Transform the data to match our frontend needs
    const transformedPosts = data.posts.map(post => ({
      id: post.ID,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      date: post.date,
      modified: post.modified,
      url: post.URL,
      shortUrl: post.short_URL,
      featuredImage: post.featured_image,
      author: {
        id: post.author.ID,
        name: post.author.name,
        firstName: post.author.first_name,
        lastName: post.author.last_name,
        avatarUrl: post.author.avatar_URL,
        url: post.author.URL
      },
      tags: Object.keys(post.tags).map(key => ({
        id: key,
        name: post.tags[key].name,
        slug: post.tags[key].slug
      })),
      categories: Object.keys(post.categories).map(key => ({
        id: key,
        name: post.categories[key].name,
        slug: post.categories[key].slug
      })),
      status: post.status,
      slug: post.slug,
      commentCount: post.comment_count,
      likeCount: post.like_count,
      format: post.format,
      globalId: post.global_ID
    }));

    res.status(200).json({
      success: true,
      data: transformedPosts,
      pagination: {
        page: Number(page),
        perPage: Number(per_page),
        total: data.found,
        totalPages: Math.ceil(data.found / Number(per_page))
      }
    });

  } catch (error) {
    console.error('WordPress API Error:', error);
    res.status(500).json({
      success: false,
      message: 'WordPress verilerini çekerken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
