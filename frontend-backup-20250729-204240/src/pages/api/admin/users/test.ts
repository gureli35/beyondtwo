import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    console.log('Test API called');
    await connectDB();
    console.log('Database connected');
    
    // Tüm kullanıcıları getir (test için)
    const users = await User.find({})
      .select('-password')
      .limit(10)
      .lean();
    
    console.log('Users found:', users.length);

    const stats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      admins: await User.countDocuments({ $or: [{ isAdmin: true }, { role: 'admin' }] }),
      moderators: await User.countDocuments({ role: 'moderator' })
    };

    return res.status(200).json({
      success: true,
      data: users,
      stats,
      message: 'Users fetched successfully'
    });

  } catch (error: any) {
    console.error('Test API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
