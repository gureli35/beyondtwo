import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Panel' }) => {
  const { user, logout, hasPermission, getRoleDefinition } = useAdminAuth();
  const router = useRouter();

  const roleDefinition = user ? getRoleDefinition(user.role) : null;

  // Menu items filtered by user permissions
  const getMenuItems = () => {
    const allMenuItems = [
      {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: '📊',
        permission: 'dashboard.view'
      },
      {
        href: '/admin/users',
        label: 'User Management',
        icon: '👥',
        permission: 'users.view'
      },
      {
        href: '/admin/blog',
        label: 'Blog Posts',
        icon: '📝',
        permission: 'content.view'
      },
      {
        href: '/admin/stories',
        label: 'Youth Stories',
        icon: '🌟',
        permission: 'content.view'
      },
      {
        href: '/admin/analytics',
        label: 'Analytics',
        icon: '📈',
        permission: 'analytics.view'
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: '⚙️',
        permission: 'settings.view'
      }
    ];

    return allMenuItems.filter(item => hasPermission(item.permission as any));
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/2Clogo.png" 
                alt="Beyond2C" 
                className="h-8 w-8 mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Beyond2C Admin</h1>
                {roleDefinition && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 mr-2">Role:</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${roleDefinition.color}`}>
                      {roleDefinition.icon} {roleDefinition.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.displayName || user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Panel</h2>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/admin/posts/new"
                  className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <span className="mr-2">➕</span>
                  New Blog Post
                </Link>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md w-full text-left"
                >
                  <span className="mr-2">🌐</span>
                  View Site
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium text-sm">
                    {(user.displayName || user.email)?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.displayName || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
