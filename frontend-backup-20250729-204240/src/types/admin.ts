// Admin kullanıcı rolleri
export type AdminRole = 
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'editor'
  | 'content_manager'
  | 'analytics_viewer';

// Admin izinleri
export type Permission = 
  | 'dashboard.view'
  | 'admin.view'
  // User Management
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.manage_roles'
  | 'users.manage'
  // Blog Management
  | 'blog.view'
  | 'blog.create'
  | 'blog.edit'
  | 'blog.delete'
  | 'blog.publish'
  | 'blog.manage'
  // Voices Management
  | 'voices.view'
  | 'voices.create'
  | 'voices.edit'
  | 'voices.delete'
  | 'voices.publish'
  | 'voices.manage'
  // Content Management
  | 'content.view'
  | 'content.create'
  | 'content.edit'
  | 'content.delete'
  | 'content.publish'
  | 'content.manage'
  // Media Management
  | 'media.view'
  | 'media.upload'
  | 'media.delete'
  | 'media.manage'
  // Comments Management
  | 'comments.view'
  | 'comments.moderate'
  | 'comments.delete'
  | 'comments.manage'
  // Stories
  | 'stories.view'
  // Climate Data
  | 'climate_data.view'
  // Maps
  | 'maps.view'
  // Analytics
  | 'analytics.view'
  | 'analytics.export'
  | 'analytics.manage'
  // System Settings
  | 'system.settings'
  | 'system.manage'
  | 'system.backup'
  | 'system.security'
  | 'settings.view'
  | 'settings.manage'
  | 'permissions.manage'
  // Super Admin
  | 'super.admin'
  | 'super.manage'
  | 'super.override';

// Rol bazında izin konfigürasyonu
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  editor: [
    'dashboard.view',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete'
  ],
  moderator: [
    'dashboard.view',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish'
  ],
  admin: [
    'dashboard.view',
    'admin.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.manage_roles',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish',
    'analytics.view',
    'system.settings',
    'permissions.manage'
  ],
  super_admin: [
    'dashboard.view',
    'admin.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.manage_roles',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete',
    'voices.publish',
    'stories.view',
    'content.view',
    'content.create',
    'content.edit',
    'content.delete',
    'content.publish',
    'climate_data.view',
    'maps.view',
    'analytics.view',
    'system.settings',
    'permissions.manage'
  ],
  content_manager: [
    'dashboard.view',
    'blog.view',
    'blog.create',
    'blog.edit',
    'blog.delete',
    'blog.publish',
    'voices.view',
    'voices.create',
    'voices.edit',
    'voices.delete'
  ],
  analytics_viewer: [
    'dashboard.view',
    'analytics.view'
  ]
};

// Admin kullanıcı tipi
export interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  permissions: Permission[];
  lastLogin: string;
  avatar?: string;
  createdAt?: string;
  createdBy?: string;
  isActive?: boolean;
}

// Admin aktivite logu
export interface AdminActivity {
  id: string;
  userId: string;
  userDisplayName: string;
  action: string;
  targetType: 'user' | 'content' | 'setting' | 'system';
  targetId?: string;
  targetName?: string;
  timestamp: string;
  details?: Record<string, any>;
}
