import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminUser } from '@/types/admin';

interface HeaderProps {
  title?: string;
  user: AdminUser | null;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, toggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{title}</h2>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Notifications button */}
          <button className="p-1 sm:p-2 mr-2 sm:mr-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full">
            <span className="sr-only">View notifications</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          
          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="hidden sm:flex sm:items-center sm:mr-2">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </div>
            </button>
            
            {/* Dropdown menu */}
            {userMenuOpen && (
              <div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                onClick={() => setUserMenuOpen(false)}
              >
                <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profil
                </Link>
                <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Ayarlar
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
