import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { APIResponse, IUser } from '@/types/database';
import { getSecureEnvVar } from '@/utils/encryption';

const JWT_SECRET = (() => {
  try {
    return getSecureEnvVar('JWT_SECRET_ENCRYPTED', true);
  } catch (error) {
    console.warn('Encrypted JWT_SECRET not found, using fallback');
    return process.env.JWT_SECRET || 'your-secret-key';
  }
})();

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<any>>
) {
  console.log('API Handler called with:', { method: req.method, action: req.query.action, body: req.body });
  
  if (req.method === 'POST') {
    const { action } = req.query;
    
    try {
      await connectDB();
      
      if (action === 'login') {
        const { email, password }: LoginRequest = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            error: 'Email ve şifre gerekli'
          });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Geçersiz email veya şifre'
          });
        }

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            error: 'Geçersiz email veya şifre'
          });
        }

        // JWT token oluştur
        const token = jwt.sign(
          { 
            userId: user._id, 
            email: user.email, 
            isAdmin: user.isAdmin,
            role: user.role 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Son giriş zamanını güncelle
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        // Şifreyi response'dan çıkar
        const userResponse = user.toJSON();
        delete userResponse.password;

        return res.status(200).json({
          success: true,
          data: {
            user: userResponse,
            token
          },
          message: 'Giriş başarılı'
        });

      } else if (action === 'register') {
        const { username, email, password, firstName, lastName }: RegisterRequest = req.body;

        if (!username || !email || !password) {
          return res.status(400).json({
            success: false,
            error: 'Kullanıcı adı, email ve şifre gerekli'
          });
        }

        // Email ve kullanıcı adı kontrolü
        const existingUser = await User.findOne({
          $or: [{ email }, { username }]
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: 'Bu email veya kullanıcı adı zaten kullanılıyor'
          });
        }

        // Şifreyi hash'le
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Yeni kullanıcı oluştur
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || ''
        });

        await newUser.save();

        // JWT token oluştur
        const token = jwt.sign(
          { 
            userId: newUser._id, 
            email: newUser.email, 
            isAdmin: newUser.isAdmin,
            role: newUser.role 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        // Şifreyi response'dan çıkar
        const userResponse = newUser.toJSON();

        return res.status(201).json({
          success: true,
          data: {
            user: userResponse,
            token
          },
          message: 'Kayıt başarılı'
        });

      } else {
        return res.status(400).json({
          success: false,
          error: 'Geçersiz action'
        });
      }

    } catch (error: any) {
      console.error('Auth error:', error);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
