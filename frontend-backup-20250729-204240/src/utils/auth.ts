import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { getSecureEnvVar } from './encryption';

const JWT_SECRET = (() => {
  try {
    return getSecureEnvVar('JWT_SECRET_ENCRYPTED', true);
  } catch (error) {
    console.warn('Encrypted JWT_SECRET not found, using fallback');
    return process.env.JWT_SECRET || 'your-secret-key';
  }
})();

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    isAdmin: boolean;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: Function
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    console.log('Auth Debug - Token:', token ? 'Token mevcut' : 'Token yok');
    console.log('Auth Debug - JWT_SECRET:', JWT_SECRET ? 'JWT_SECRET mevcut' : 'JWT_SECRET yok');

    if (!token) {
      console.log('Auth Debug - Token bulunamadı');
      return res.status(401).json({
        success: false,
        error: 'Token bulunamadı'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('Auth Debug - Token decoded:', { userId: decoded.userId, isAdmin: decoded.isAdmin });
    
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('Auth Debug - Kullanıcı bulunamadı:', decoded.userId);
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    if (!user.isActive) {
      console.log('Auth Debug - Kullanıcı aktif değil:', user.email);
      return res.status(401).json({
        success: false,
        error: 'Hesap aktif değil'
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      isAdmin: decoded.isAdmin || user.isAdmin,
      role: decoded.role || user.role
    };

    console.log('Auth Debug - Kimlik doğrulandı:', { 
      userId: req.user.userId, 
      email: req.user.email, 
      isAdmin: req.user.isAdmin 
    });

    next();
  } catch (error: any) {
    console.log('Auth Debug - Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Geçersiz token: ' + error.message
    });
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: Function
) => {
  if (!req.user?.isAdmin && req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin yetkisi gerekli'
    });
  }
  next();
};

export const requireBlogAccess = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: Function
) => {
  const allowedRoles = ['admin', 'moderator', 'editor'];
  if (!req.user?.isAdmin && !allowedRoles.includes(req.user?.role || '')) {
    return res.status(403).json({
      success: false,
      error: 'Bu işlem için gerekli yetki yok'
    });
  }
  next();
};

export const requireVoicesAccess = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: Function
) => {
  const allowedRoles = ['admin', 'moderator'];
  if (!req.user?.isAdmin && !allowedRoles.includes(req.user?.role || '')) {
    return res.status(403).json({
      success: false,
      error: 'Bu işlem için gerekli yetki yok'
    });
  }
  next();
};

export const requireAuth = (handler: Function) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await authenticate(req, res, () => {
      handler(req, res);
    });
  };
};

export const requireAdminAuth = (handler: Function) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await authenticate(req, res, async () => {
      await requireAdmin(req, res, () => {
        handler(req, res);
      });
    });
  };
};

export const requireBlogAuth = (handler: Function) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await authenticate(req, res, async () => {
      await requireBlogAccess(req, res, () => {
        handler(req, res);
      });
    });
  };
};

export const requireVoicesAuth = (handler: Function) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await authenticate(req, res, async () => {
      await requireVoicesAccess(req, res, () => {
        handler(req, res);
      });
    });
  };
};
