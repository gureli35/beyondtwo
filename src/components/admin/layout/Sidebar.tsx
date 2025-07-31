import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Permission } from '@/types/admin';

interface SidebarProps {
  mobile?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  permission: Permission;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false }) => {
  const router = useRouter();
  const { hasPermission, user } = useAdminAuth();

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: 'home',
      permission: 'dashboard.view'
    },
    { 
      name: 'Blog Management', 
      href: '/admin/blog',
      icon: 'document',
      permission: 'blog.view'
    },
    { 
      name: 'Voices Management', 
      href: '/admin/voices',
      icon: 'microphone',
      permission: 'voices.view'
    },
    { 
      name: 'User Management', 
      href: '/admin/user-management', 
      icon: 'users',
      permission: 'users.view'
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: 'chart',
      permission: 'analytics.view'
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: 'cog',
      permission: 'system.settings'
    }
  ];

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter(item => hasPermission(item.permission));

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'users':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'microphone':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'cog':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const containerClasses = mobile 
    ? "flex-1 h-0 pt-5 pb-4 overflow-y-auto" 
    : "bg-blue-800 text-white h-screen flex-1 flex flex-col overflow-y-auto";

  return (
    <div className={containerClasses}>
      <div className="px-6 py-4">
        <Link href="/admin">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-white">Beyond2C Admin</span>
          </div>
        </Link>
      </div>
      
      <nav className="mt-5 flex-1 px-4 space-y-1">
        {visibleNavItems.map((item) => {
          const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
          
          return (
            <Link 
              key={item.name} 
              href={item.href!}
              className={`
                flex items-center px-4 py-2 text-sm font-medium rounded-md 
                ${isActive 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-100 hover:bg-blue-700'
                }
              `}
            >
              <span className="mr-3">{getIcon(item.icon)}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
        
        {/* Role Information */}
        {user && (
          <div className="mt-8 pt-4 border-t border-blue-700">
            <div className="px-4 py-2">
              <span className="text-xs text-blue-300 uppercase tracking-wider">
                Rol: {user.role}
              </span>
            </div>
          </div>
        )}
      </nav>
      
      <div className="px-6 py-4 border-t border-blue-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {user?.displayName?.charAt(0) || 'A'}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {user?.displayName || 'Admin User'}
            </p>
            <p className="text-xs text-blue-300 capitalize">
              {user?.role?.replace('_', ' ') || 'Admin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
