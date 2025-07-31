import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { AuthenticatedRequest, requireBlogAuth } from '@/utils/auth';
import { APIResponse, IPost, UpdatePostData } from '@/types/database';
import { updateSitemapAfterContentChange } from '@/utils/sitemap';

// Slug oluştur
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<APIResponse<IPost>>
) {
  // Blog erişim yetkisi olan kullanıcılar erişebilir (editor, moderator, admin)
  return requireBlogAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Blog yazısı ID\'si gerekli'
      });
    }

    // Blog yazısını bul
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog yazısı bulunamadı'
      });
    }

    // Yetki kontrolü - Admin olmayan kullanıcılar sadece kendi yazılarını düzenleyebilir
    if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
      if (post.userId?.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: 'Bu yazıyı düzenleme yetkiniz yok'
        });
      }
    }

    if (req.method === 'GET') {
      try {
        const post = await Post.findById(id)
          .populate('author', 'username profilePicture firstName lastName')
          .lean();

        return res.status(200).json({
          success: true,
          data: post as any
        });

      } catch (error: any) {
        console.error('Admin Blog GET error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası'
        });
      }
    } else if (req.method === 'PUT') {
      try {
        const updateData: UpdatePostData = req.body;

        // Slug güncellemesi
        if (updateData.title && updateData.title !== post.title) {
          let newSlug = updateData.slug || createSlug(updateData.title);
          const slugExists = await Post.findOne({ 
            slug: newSlug, 
            _id: { $ne: id } 
          });
          if (slugExists) {
            newSlug = `${newSlug}-${Date.now()}`;
          }
          updateData.slug = newSlug;
        }

        // Tags array olarak kaydet
        if (updateData.tags && typeof updateData.tags === 'string') {
          updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
        }

        // Eğer status published olarak değiştiyse ve publishedAt null ise, şu anki tarihi set et
        if (updateData.status === 'published' && (!post.publishedAt || post.status !== 'published')) {
          (updateData as any).publishedAt = new Date();
        }

        const updatedPost = await Post.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
        ).populate('author', 'username profilePicture firstName lastName');

        // Sitemap'i güncelle (published durumuna geçtiyse veya zaten publishedsa)
        if (updateData.status === 'published' || (post.status === 'published' && updatedPost?.status === 'published')) {
          updateSitemapAfterContentChange({
            action: 'update',
            type: 'blog',
            slug: updatedPost?.slug
          }).catch(err => console.error('Sitemap update failed:', err));
        }

        return res.status(200).json({
          success: true,
          data: updatedPost as IPost,
          message: 'Blog yazısı başarıyla güncellendi'
        });

      } catch (error: any) {
        console.error('Admin Blog update error:', error);
        return res.status(500).json({
          success: false,
          error: 'Sunucu hatası: ' + error.message
        });
      }
    } else if (req.method === 'DELETE') {
      try {
        // Sitemap güncellemesi için slug'ı al (silmeden önce)
        const deletingSlug = post.slug;
        const wasPublished = post.status === 'published';

        await Post.findByIdAndDelete(id);

        // Sitemap'i güncelle (published durumdaydıysa)
        if (wasPublished) {
          updateSitemapAfterContentChange({
            action: 'delete',
            type: 'blog',
            slug: deletingSlug
          }).catch(err => console.error('Sitemap update failed:', err));
        }

        return res.status(200).json({
          success: true,
          message: 'Blog yazısı başarıyla silindi'
        });

      } catch (error: any) {
        console.error('Admin Blog delete error:', error);
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
  })(req, res);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}
