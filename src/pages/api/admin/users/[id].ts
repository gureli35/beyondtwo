import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest, requireAdminAuth } from '@/utils/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  await connectDB();

  switch (method) {
    case 'GET':
      try {
        const user = await User.findById(id).select('-password');
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Kullanıcı bulunamadı'
          });
        }

        res.status(200).json({
          success: true,
          data: user
        });
      } catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({
          success: false,
          message: 'Kullanıcı getirilirken hata oluştu'
        });
      }
      break;

    case 'PUT':
      try {
        const { username, email, firstName, lastName, role, isActive, password } = req.body;

        const updateData: any = {};
        
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        // Şifre güncellenecekse hash'le
        if (password) {
          updateData.password = await bcrypt.hash(password, 12);
        }

        const user = await User.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Kullanıcı bulunamadı'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Kullanıcı başarıyla güncellendi',
          data: user
        });
      } catch (error: any) {
        console.error('User update error:', error);
        
        if (error.code === 11000) {
          return res.status(400).json({
            success: false,
            message: 'Bu email veya kullanıcı adı zaten kullanılıyor'
          });
        }
        
        res.status(500).json({
          success: false,
          message: 'Kullanıcı güncellenirken hata oluştu'
        });
      }
      break;

    case 'DELETE':
      try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'Kullanıcı bulunamadı'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Kullanıcı başarıyla silindi'
        });
      } catch (error) {
        console.error('User delete error:', error);
        res.status(500).json({
          success: false,
          message: 'Kullanıcı silinirken hata oluştu'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
