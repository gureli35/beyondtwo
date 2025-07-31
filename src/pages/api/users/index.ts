import { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { AuthenticatedRequest, requireAdminAuth } from '@/utils/auth';
import { APIResponse, PaginatedResponse, IUser, CreateUserData, UpdateUserData, UserFilters } from '@/types/database';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<any> | PaginatedResponse<IUser>>
) {
  await connectDB();

  if (req.method === 'GET') {
    // Kullanıcıları listele - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const {
          page = 1,
          limit = 10,
          role,
          isActive,
          emailVerified,
          search,
          dateFrom,
          dateTo
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Filter oluştur
        const filter: any = {};

        if (role && role !== 'all') filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (emailVerified !== undefined) filter.emailVerified = emailVerified === 'true';

        // Tarih filtresi
        if (dateFrom || dateTo) {
          filter.createdAt = {};
          if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
          if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
        }

        // Arama
        if (search) {
          filter.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } }
          ];
        }

        const users = await User.find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean();

        const total = await User.countDocuments(filter);
        const pages = Math.ceil(total / limitNum);

        return res.status(200).json({
          success: true,
          data: users,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages,
            hasNext: pageNum < pages,
            hasPrev: pageNum > 1
          }
        });

      } catch (error: any) {
        console.error('Users GET error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'POST') {
    // Yeni kullanıcı oluştur - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const userData: CreateUserData = req.body;

        if (!userData.username || !userData.email || !userData.password) {
          return res.status(400).json({
            success: false,
            error: 'Kullanıcı adı, email ve şifre gerekli'
          });
        }

        // Mevcut kullanıcı kontrolü
        const existingUser = await User.findOne({
          $or: [{ email: userData.email }, { username: userData.username }]
        });

        if (existingUser) {
          return res.status(409).json({
            success: false,
            error: 'Bu email veya kullanıcı adı zaten kullanılıyor'
          });
        }

        // Şifreyi hash'le
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        const newUser = new User({
          ...userData,
          password: hashedPassword
        });

        await newUser.save();

        // Şifreyi response'dan çıkar
        const userResponse = newUser.toJSON();

        return res.status(201).json({
          success: true,
          data: userResponse,
          message: 'Kullanıcı başarıyla oluşturuldu'
        });

      } catch (error: any) {
        console.error('User create error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'PUT') {
    // Kullanıcı güncelle - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const updateData: UpdateUserData = req.body;

        if (!updateData._id) {
          return res.status(400).json({
            success: false,
            error: 'Kullanıcı ID gerekli'
          });
        }

        const existingUser = await User.findById(updateData._id);
        if (!existingUser) {
          return res.status(404).json({
            success: false,
            error: 'Kullanıcı bulunamadı'
          });
        }

        // Şifre güncellemesi varsa hash'le
        if (updateData.password) {
          const saltRounds = 12;
          updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        // Email/username benzersizlik kontrolü
        if (updateData.email || updateData.username) {
          const duplicateCheck: any = {};
          if (updateData.email) duplicateCheck.email = updateData.email;
          if (updateData.username) duplicateCheck.username = updateData.username;

          const duplicateUser = await User.findOne({
            $or: Object.keys(duplicateCheck).map(key => ({ [key]: duplicateCheck[key] })),
            _id: { $ne: updateData._id }
          });

          if (duplicateUser) {
            return res.status(409).json({
              success: false,
              error: 'Bu email veya kullanıcı adı zaten kullanılıyor'
            });
          }
        }

        const updatedUser = await User.findByIdAndUpdate(
          updateData._id,
          updateData,
          { new: true }
        ).select('-password');

        return res.status(200).json({
          success: true,
          data: updatedUser,
          message: 'Kullanıcı başarıyla güncellendi'
        });

      } catch (error: any) {
        console.error('User update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else if (req.method === 'DELETE') {
    // Kullanıcı sil - Admin gerekli
    return requireAdminAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            success: false,
            error: 'Kullanıcı ID gerekli'
          });
        }

        // Kendi hesabını silmesini engelle
        if (id === req.user!.userId) {
          return res.status(400).json({
            success: false,
            error: 'Kendi hesabınızı silemezsiniz'
          });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({
            success: false,
            error: 'Kullanıcı bulunamadı'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Kullanıcı başarıyla silindi'
        });

      } catch (error: any) {
        console.error('User delete error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    })(req, res);

  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
