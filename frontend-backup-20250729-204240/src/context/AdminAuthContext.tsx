import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, Permission } from '@/types/admin';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  getRoleDefinition: (role: string) => { name: string; icon: string; color: string } | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export { AdminAuthContext };

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Geçici test modası - API sorunları için
      if (email === 'admin@beyond2c.com' && password === 'admin123') {
        const adminUser: AdminUser = {
          id: '1',
          email: 'admin@beyond2c.com',
          displayName: 'Admin User',
          role: 'admin',
          permissions: [
            // Dashboard
            'dashboard.view',
            // User Management - Tüm yetkiler
            'users.view', 'users.create', 'users.edit', 'users.delete', 'users.manage',
            // Content Management - Tüm yetkiler
            'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish', 'content.manage',
            // Blog Management - Tüm yetkiler
            'blog.view', 'blog.create', 'blog.edit', 'blog.delete', 'blog.publish', 'blog.manage',
            // Voices Management - Tüm yetkiler
            'voices.view', 'voices.create', 'voices.edit', 'voices.delete', 'voices.publish', 'voices.manage',
            // Media Management
            'media.view', 'media.upload', 'media.delete', 'media.manage',
            // Comments Management
            'comments.view', 'comments.moderate', 'comments.delete', 'comments.manage',
            // Analytics - Tüm yetkiler
            'analytics.view', 'analytics.export', 'analytics.manage',
            // System Settings - Tüm yetkiler
            'system.settings', 'system.manage', 'system.backup', 'system.security',
            // Super Admin - En üst düzey yetkiler
            'super.admin', 'super.manage', 'super.override'
          ],
          lastLogin: new Date().toISOString()
        };
        
        const token = 'test-token-' + Date.now();
        
        // Gerçek JWT token formatında oluştur (test amaçlı)
        const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJhZG1pbkBiZXlvbmQyYy5jb20iLCJpc0FkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzgxNTA4MDAsImV4cCI6OTk5OTk5OTk5OX0.fake-signature-for-testing';
        
        localStorage.setItem('admin_token', testToken);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        
        setUser(adminUser);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const getRoleDefinition = (role: string) => {
    const roleDefinitions: Record<string, { name: string; icon: string; color: string }> = {
      super_admin: { name: 'Super Admin', icon: '👑', color: 'bg-purple-600' },
      admin: { name: 'Admin', icon: '⚡', color: 'bg-blue-600' },
      content_manager: { name: 'Content Manager', icon: '📝', color: 'bg-green-600' },
      analytics_viewer: { name: 'Analytics Viewer', icon: '📊', color: 'bg-yellow-600' }
    };
    return roleDefinitions[role] || null;
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      loading,
      isLoading: loading,
      hasPermission,
      getRoleDefinition
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
