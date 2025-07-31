import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLogin from '../AdminLogin';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Panel' }) => {
  const { isAuthenticated, user, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Debug log
  React.useEffect(() => {
    console.log('AdminLayout - Current route:', router.pathname);
    console.log('AdminLayout - Auth state:', { isAuthenticated, user: user?.email, loading });
  }, [router.pathname, isAuthenticated, user, loading]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Authenticated - show admin panel
  return (
    <div className="flex h-screen bg-gray-100">
          {/* Mobile sidebar */}
          <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
            {/* Dark overlay */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-800 transform transition ease-in-out duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Sidebar mobile={true} />
          </div>
        </div>
        
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar mobile={false} />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header 
            title={title} 
            user={user} 
            toggleSidebar={toggleSidebar} 
          />
          
          <main className="flex-1 overflow-y-auto p-0 sm:p-2 lg:p-4">
            <div className="w-full max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
};

export default AdminLayout;
