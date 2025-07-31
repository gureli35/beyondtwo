import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { APIResponse, IPost } from '@/types/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<IPost>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz blog ID'
      });
    }

    // Blog yazısını bul (yayınlanmış veya taslak olsun fark etmez)
    const post = await Post.findById(id)
      .populate('author', 'username profilePicture firstName lastName')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog yazısı bulunamadı'
      });
    }

    return res.status(200).json({
      success: true,
      data: post as any
    });

  } catch (error: any) {
    console.error('Blog preview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
}
