import { NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Voice from '@/models/Voice';
import User from '@/models/User'; // User model'ini import et
import { AuthenticatedRequest, requireVoicesAuth } from '@/utils/auth';
import { updateSitemapAfterContentChange } from '@/utils/sitemap';

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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        featured,
        search,
        sort = 'createdAt',
        order = 'desc',
        storyType,
        city
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build filter
      const filter: any = {};

      // Role-based filtering - Non-admin users can only see their own voices
      if (req.user && req.user.role !== 'admin' && !req.user.isAdmin) {
        filter.userId = req.user.userId;
      }

      if (status) filter.status = status;
      if (category && category !== 'all') filter.category = category;
      if (featured === 'true') filter.featured = true;
      if (storyType) filter.storyType = storyType;
      if (city) filter['author.location.city'] = new RegExp(city as string, 'i');

      // Search functionality
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { 'author.name': { $regex: search, $options: 'i' } },
          { 'author.location.city': { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      // Sort configuration
      const sortConfig: any = {};
      sortConfig[sort as string] = order === 'desc' ? -1 : 1;

      const voices = await Voice.find(filter)
        // .populate('userId', 'firstName lastName username email') // Geçici olarak kapalı
        // .populate('reviewedBy', 'firstName lastName username') // Geçici olarak kapalı
        .sort(sortConfig)
        .skip(skip)
        .limit(limitNum)
        .lean();

      const total = await Voice.countDocuments(filter);
      const totalPages = Math.ceil(total / limitNum);

      res.status(200).json({
        success: true,
        data: voices,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      });

    } catch (error) {
      console.error('Error fetching voices:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching voices',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  else if (req.method === 'POST') {
    try {
      const voiceData = req.body;
      
      console.log('Received voice data:', JSON.stringify(voiceData, null, 2));

      // Validate required fields
      if (!voiceData.title || !voiceData.content || !voiceData.author?.name) {
        console.log('Validation failed:', {
          title: !!voiceData.title,
          content: !!voiceData.content,
          authorName: !!voiceData.author?.name
        });
        return res.status(400).json({
          success: false,
          message: 'Title, content, and author name are required',
          details: {
            title: !!voiceData.title,
            content: !!voiceData.content,
            authorName: !!voiceData.author?.name
          }
        });
      }

      // Generate slug if not provided
      if (!voiceData.slug) {
        voiceData.slug = createSlug(voiceData.title);
      }

      // Check if slug already exists
      const existingVoice = await Voice.findOne({ slug: voiceData.slug });
      if (existingVoice) {
        voiceData.slug = `${voiceData.slug}-${Date.now()}`;
      }

      // Set userId from authenticated request (geçici olarak sabit bir ID kullan)
      voiceData.userId = '507f1f77bcf86cd799439011'; // Geçici sabit ObjectId

      // Set submission date
      voiceData.submittedAt = new Date();

      // Create new voice/story
      const newVoice = new Voice(voiceData);
      await newVoice.save();

      // Populate user data for response (geçici olarak kapalı)
      // await newVoice.populate('userId', 'firstName lastName username email');

      // Sitemap'i güncelle (published durumundaysa)
      if (voiceData.status === 'published') {
        updateSitemapAfterContentChange({
          action: 'create',
          type: 'voice',
          slug: newVoice.slug
        }).catch(err => console.error('Sitemap update failed:', err));
      }

      res.status(201).json({
        success: true,
        message: 'Voice/Story created successfully',
        data: newVoice
      });

    } catch (error) {
      console.error('Error creating voice:', error);
      
      if (error instanceof Error && error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating voice/story',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}

export default requireVoicesAuth(handler);
