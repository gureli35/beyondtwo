import { NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { AuthenticatedRequest } from '@/utils/auth';
import { APIResponse } from '@/types/database';
import { getSecureEnvVar } from '@/utils/encryption';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await connectDB();

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token gerekli'
      });
    }

    const jwtSecret = (() => {
      try {
        return getSecureEnvVar('JWT_SECRET_ENCRYPTED', true);
      } catch (error) {
        console.warn('Encrypted JWT_SECRET not found, using fallback');
        return process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      }
    })();
    
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Kullanıcının hala var olduğunu ve aktif olduğunu kontrol et
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive || !user.isAdmin) {
        return res.status(401).json({
          success: false,
          error: 'Geçersiz token'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            role: user.role
          }
        }
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Geçersiz token'
      });
    }

  } catch (error: any) {
    console.error('Token verify error:', error);
    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
}
