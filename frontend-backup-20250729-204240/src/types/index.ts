// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  interests: string[];
  joinedDate: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
  };
}

// Action Types
export interface Action {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'planned';
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  startDate: string;
  endDate?: string;
  createdBy: string;
  participants: string[];
  images: string[];
  impact?: {
    metric: string;
    value: number;
  };
  municipality?: {
    name: string;
    contactPerson: string;
  };
  approved: boolean;
}

// Story Types
export interface Story {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  media: MediaItem[];
  tags: string[];
  featured: boolean;
  likes: number;
  comments: Comment[];
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Comment {
  user: string;
  text: string;
  date: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    online: boolean;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    joinLink?: string;
  };
  organizer: string;
  category: string;
  image: string;
  capacity?: number;
  attendees: string[];
  waitlist: string[];
  recurring: boolean;
  recurrencePattern?: string;
  tags: string[];
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'draft' | 'published';
  relatedPosts: string[];
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'report' | 'tool' | 'template';
  url: string;
  fileType?: string;
  fileSize?: number;
  uploadDate: string;
  author: string;
  organization?: string;
  tags: string[];
  featured: boolean;
  downloadCount: number;
}

// Climate Data Types
export interface ClimateData {
  id: string;
  metric: string;
  value: number;
  unit: string;
  date: string;
  location?: string;
  source: string;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ActionSubmissionForm {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate?: string;
  images?: File[];
  expectedImpact?: string;
}

export interface StorySubmissionForm {
  title: string;
  content: string;
  location: string;
  media?: File[];
  tags: string[];
}

export interface VolunteerForm {
  name: string;
  email: string;
  skills: string[];
  availability: string;
  interests: string[];
  experience: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends ComponentProps {
  title?: string;
  image?: string;
  href?: string;
}

// Map Types
export interface MapMarker {
  id: string;
  position: [number, number];
  popup?: string;
  icon?: string;
  category?: string;
}

export interface MapProps {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string;
  className?: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  current?: boolean;
  children?: NavItem[];
}

// SEO Types
export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  structuredData?: object;
}

// Theme Types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Filter Types
export interface FilterOptions {
  category?: string[];
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  status?: string[];
}

// Statistics Types
export interface Statistics {
  totalActions: number;
  totalParticipants: number;
  totalStories: number;
  totalEvents: number;
  co2Saved: number;
  citiesReached: number;
}

// Data Hub Types
export interface DataCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ClimateDataPoint {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
  source: string;
  lastUpdated: string;
}

// Issue Category Types
export interface IssueCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  stats: {
    current: string;
    target: string;
    trend: string;
    urgency: string;
  };
  impacts: string[];
  solutions: string[];
}
