// filepath: /src/pages/api/blogs/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { APIResponse, IPost } from '@/types/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<IPost[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await connectDB();
    const posts = await Post.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('-content') // İçeriği listelemede gönderme
      .lean();
    
    // Transform posts to include author info
    const transformedPosts = posts.map(post => ({
      ...post,
      author: {
        name: 'Admin', // Default author name since we don't have user system working properly
        username: 'admin'
      }
    }));
    
    return res.status(200).json({
      success: true,
      data: transformedPosts as any
    });
  } catch (error: any) {
    console.error('Public blogs API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
}
