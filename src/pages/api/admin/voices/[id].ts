import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Voice from '@/models/Voice';
import User from '@/models/User'; // User model'ini import et
import { AuthenticatedRequest, requireVoicesAuth } from '@/utils/auth';
import { updateSitemapAfterContentChange } from '@/utils/sitemap';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

// Slug creation function
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

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  await connectDB();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Voice ID is required'
    });
  }

  if (req.method === 'GET') {
    try {
      const voice = await Voice.findById(id)
        // .populate('userId', 'firstName lastName username email') // Geçici olarak kapalı
        // .populate('reviewedBy', 'firstName lastName username') // Geçici olarak kapalı
        .lean();

      if (!voice) {
        return res.status(404).json({
          success: false,
          message: 'Voice/Story not found'
        });
      }

      // Role-based access control - Non-admin users can only access their own voices
      if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
        if ((voice as any).userId !== req.user.userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: You can only view your own voices'
          });
        }
      }

      res.status(200).json({
        success: true,
        data: voice
      });

    } catch (error) {
      console.error('Error fetching voice:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching voice/story',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  else if (req.method === 'PUT') {
    try {
      // First, find the voice to check ownership
      const existingVoice = await Voice.findById(id).lean();
      
      if (!existingVoice) {
        return res.status(404).json({
          success: false,
          message: 'Voice/Story not found'
        });
      }

      // Role-based access control - Non-admin users can only edit their own voices
      if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
        if ((existingVoice as any).userId !== req.user.userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: You can only edit your own voices'
          });
        }
      }

      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;

      // Generate new slug if title changed
      if (updateData.title) {
        const newSlug = createSlug(updateData.title);
        if (newSlug !== updateData.slug) {
          const existingVoice = await Voice.findOne({ 
            slug: newSlug, 
            _id: { $ne: id } 
          });
          if (existingVoice) {
            updateData.slug = `${newSlug}-${Date.now()}`;
          } else {
            updateData.slug = newSlug;
          }
        }
      }

      // Handle status changes
      if (updateData.status === 'published' && updateData.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      // Set review data if status is being reviewed
      if (['reviewed', 'published', 'rejected'].includes(updateData.status)) {
        updateData.reviewedBy = '507f1f77bcf86cd799439011'; // Geçici sabit ID
        updateData.reviewedAt = new Date();
      }

      const voice = await Voice.findByIdAndUpdate(
        id,
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      );
      // .populate('userId', 'firstName lastName username email') // Geçici olarak kapalı
      // .populate('reviewedBy', 'firstName lastName username'); // Geçici olarak kapalı

      if (!voice) {
        return res.status(404).json({
          success: false,
          message: 'Voice/Story not found'
        });
      }

      // Sitemap'i güncelle (published durumuna geçtiyse veya zaten publishedsa)
      if (updateData.status === 'published' || ((existingVoice as any).status === 'published' && voice.status === 'published')) {
        updateSitemapAfterContentChange({
          action: 'update',
          type: 'voice',
          slug: voice.slug
        }).catch(err => console.error('Sitemap update failed:', err));
      }

      res.status(200).json({
        success: true,
        message: 'Voice/Story updated successfully',
        data: voice
      });

    } catch (error) {
      console.error('Error updating voice:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating voice/story',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      // First, find the voice to check ownership
      const existingVoice = await Voice.findById(id).lean();
      
      if (!existingVoice) {
        return res.status(404).json({
          success: false,
          message: 'Voice/Story not found'
        });
      }

      // Role-based access control - Non-admin users can only delete their own voices
      if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
        if ((existingVoice as any).userId !== req.user.userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: You can only delete your own voices'
          });
        }
      }

      // Sitemap güncellemesi için gerekli bilgileri al (silmeden önce)
      const deletingSlug = (existingVoice as any).slug;
      const wasPublished = (existingVoice as any).status === 'published';

      const voice = await Voice.findByIdAndDelete(id);

      // Sitemap'i güncelle (published durumdaydıysa)
      if (wasPublished) {
        updateSitemapAfterContentChange({
          action: 'delete',
          type: 'voice',
          slug: deletingSlug
        }).catch(err => console.error('Sitemap update failed:', err));
      }

      res.status(200).json({
        success: true,
        message: 'Voice/Story deleted successfully',
        data: { id: voice!._id }
      });

    } catch (error) {
      console.error('Error deleting voice:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting voice/story',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}

export default requireVoicesAuth(handler);
