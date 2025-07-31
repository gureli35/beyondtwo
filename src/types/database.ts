// User Types
export interface IUser {
  _id: string;
  username: string;
  email: string;
  password?: string;
  profilePicture: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  bio: string;
  website: string;
  location: string;
  isActive: boolean;
  lastLogin: Date | null;
  emailVerified: boolean;
  role: 'user' | 'admin' | 'moderator' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

// Post Types
export interface IPost {
  _id: string;
  userId: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  image: string;
  category: 'technology' | 'business' | 'lifestyle' | 'education' | 'health' | 'travel' | 'environment' | 'climate' | 'sustainability' | 'uncategorized';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt: Date | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  views: number;
  likes: number;
  readingTime: number;
  allowComments: boolean;
  contentType: 'article' | 'news' | 'case-study' | 'tutorial' | 'opinion';
  language: 'tr' | 'en';
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image' | 'app' | 'player';
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  author?: IUser;
  commentCount?: number;
}

// Comment Types
export interface IComment {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  parentId: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likes: string[];
  numberOfLikes: number;
  reportedBy: string[];
  reportCount: number;
  moderatedBy: string | null;
  moderatedAt: Date | null;
  moderationNote: string;
  edited: boolean;
  editedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  author?: IUser;
  post?: IPost;
  replies?: IComment[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  image?: string;
  featuredImage?: string;
  category: string;
  tags?: string[] | string;
  status: 'draft' | 'published';
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  allowComments?: boolean;
  contentType?: string;
  language?: 'tr' | 'en';
}

export interface UpdatePostData extends Partial<CreatePostData> {
  _id: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin' | 'moderator' | 'editor';
}

export interface UpdateUserData extends Partial<CreateUserData> {
  _id: string;
  isActive?: boolean;
  emailVerified?: boolean;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentData {
  _id: string;
  content?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  moderationNote?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  edited?: boolean;
  editedAt?: Date;
}

// Filter and Search Types
export interface PostFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  featured?: boolean;
  userId?: string;
  tags?: string[];
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UserFilters {
  role?: 'user' | 'admin' | 'moderator' | 'editor';
  isActive?: boolean;
  emailVerified?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CommentFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  postId?: string;
  userId?: string;
  reported?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Admin Dashboard Stats
export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    thisMonth: number;
  };
  users: {
    total: number;
    active: number;
    admins: number;
    thisMonth: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisMonth: number;
  };
  views: {
    total: number;
    thisMonth: number;
    today: number;
  };
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface TimeSeriesData {
  date: string;
  posts: number;
  users: number;
  comments: number;
  views: number;
}
