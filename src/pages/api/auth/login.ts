import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { APIResponse } from '@/types/database';
import { getSecureEnvVar } from '@/utils/encryption';

interface LoginRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

export default async function handler(
  req: LoginRequest,
  res: NextApiResponse<APIResponse<any>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await connectDB();

    const { email, password } = req.body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email ve password gerekli'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? { email: user.email, isAdmin: user.isAdmin, role: user.role, isActive: user.isActive } : 'Not found');

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Hesabınız deaktive edilmiş'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        error: 'Şifre yanlış. Lütfen kontrol ediniz'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const jwtSecret = (() => {
      try {
        return getSecureEnvVar('JWT_SECRET_ENCRYPTED', true);
      } catch (error) {
        console.warn('Encrypted JWT_SECRET not found, using fallback');
        return process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      }
    })();
    
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // User response (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      role: user.role,
      profilePicture: user.profilePicture,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Giriş başarılı'
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası: ' + error.message
    });
  }
}