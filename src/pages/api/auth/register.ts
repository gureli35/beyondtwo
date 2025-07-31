import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { APIResponse } from '@/types/database';

interface RegisterRequest extends NextApiRequest {
  body: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  };
}

export default async function handler(
  req: RegisterRequest,
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

    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email ve password gerekli'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password en az 6 karakter olmalı'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Bu email veya username zaten kullanılıyor'
      });
    }

    // Check if this is the first user (will be super admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      isAdmin: isFirstUser,
      role: isFirstUser ? 'admin' : 'user',
      emailVerified: isFirstUser, // First user is auto-verified
      isActive: true
    });

    await newUser.save();

    // Remove password from response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isAdmin: newUser.isAdmin,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
      createdAt: newUser.createdAt
    };

    return res.status(201).json({
      success: true,
      data: userResponse,
      message: isFirstUser 
        ? 'İlk kullanıcı olarak super admin yetkileriniz verildi!' 
        : 'Kullanıcı başarıyla oluşturuldu'
    });

  } catch (error: any) {
    console.error('Register error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Bu email veya username zaten kullanılıyor'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Sunucu hatası: ' + error.message
    });
  }
}