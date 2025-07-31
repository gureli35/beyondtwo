import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest, requireAdminAuth } from '@/utils/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const { page = 1, limit = 10, search = '', role = 'all' } = req.query;
        
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Filtreleme
        const filter: any = {};
        
        if (search) {
          filter.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } }
          ];
        }
        
        if (role !== 'all') {
          filter.role = role;
        }

        const users = await User.find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum);

        const totalUsers = await User.countDocuments(filter);

        res.status(200).json({
          success: true,
          data: users,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalUsers / limitNum),
            totalUsers,
            hasNextPage: pageNum < Math.ceil(totalUsers / limitNum),
            hasPrevPage: pageNum > 1
          }
        });
      } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({
          success: false,
          message: 'Kullanıcılar getirilirken hata oluştu'
        });
      }
      break;

    case 'POST':
      try {
        const { username, email, password, firstName, lastName, role = 'user' } = req.body;

        // Validation
        if (!username || !email || !password) {
          return res.status(400).json({
            success: false,
            message: 'Kullanıcı adı, email ve şifre gereklidir'
          });
        }

        // Check if user exists
        const existingUser = await User.findOne({
          $or: [{ email }, { username }]
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Bu email veya kullanıcı adı zaten kullanılıyor'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          firstName: firstName || '',
          lastName: lastName || '',
          role,
          emailVerified: true, // Admin tarafından oluşturulan kullanıcılar otomatik onaylı
          isActive: true
        });

        await newUser.save();

        res.status(201).json({
          success: true,
          message: 'Kullanıcı başarıyla oluşturuldu',
          data: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        });
      } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({
          success: false,
          message: 'Kullanıcı oluşturulurken hata oluştu'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
