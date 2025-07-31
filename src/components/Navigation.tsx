import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavItem } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const navigationItems: NavItem[] = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.issues'), href: '/issues' },
    { name: t('nav.impactMap'), href: '/impact-map' },
    { name: t('nav.voices'), href: '/voices' },
    { name: t('nav.dataHub'), href: '/data-hub' },
    { name: t('nav.blog'), href: '/blog' },
    { name: language === 'tr' ? 'Haberler' : 'News', href: '/news' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <nav className={`bg-black shadow-sm sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md shadow-red-900/20 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-sm' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Sol taraf - Optimize edilmiş genişlik */}
          <div className="flex-shrink-0 flex items-center hover-glow">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/2Clogo.png"
                  alt="Beyond2C Logo" 
                  className="h-8 w-auto filter brightness-110 hover:brightness-125 transition-all duration-300"
                />
                <span className="font-montserrat font-bold text-lg ml-2 hidden sm:block">
                  <span className="text-primary bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">BEYOND</span>
                  <span className="text-white">2C</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Orta - Esnek alan */}
          <div className="hidden lg:flex flex-1 items-center justify-center mx-8">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href) 
                      ? 'bg-gradient-to-r from-primary-900 to-red-900 text-primary shadow-lg shadow-red-900/30 font-semibold' 
                      : 'text-gray-400 hover:text-primary hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 font-medium'
                  } px-3 py-2 text-sm whitespace-nowrap rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-900/20`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Sağ taraf - CTA Button ve İkonlar - Optimize edilmiş genişlik */}
          <div className="hidden lg:flex items-center justify-end space-x-3">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-primary transition-colors duration-200 p-2 rounded-md hover:bg-gray-800"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
                </svg>
              )}
            </button>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-2">
              <a
                href="https://www.instagram.com/beyond2c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-all duration-300 transform hover:scale-110 hover:rotate-12 p-1 rounded-md hover:bg-gray-800"
                aria-label="Follow us on Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/beyond2c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-all duration-300 transform hover:scale-110 hover:rotate-12 p-1 rounded-md hover:bg-gray-800"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            
            <Link href="/take-action" className="btn-gradient px-4 py-2 text-sm font-medium rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center text-center whitespace-nowrap">
              {t('nav.takeAction')}
            </Link>
          </div>

          {/* Tablet Navigation - Orta boyut ekranlar için */}
          <div className="hidden md:flex lg:hidden flex-1 items-center justify-center mx-4">
            <div className="flex items-center space-x-1">
              {navigationItems.slice(0, 6).map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href) 
                      ? 'bg-gradient-to-r from-primary-900 to-red-900 text-primary shadow-lg shadow-red-900/30 font-semibold' 
                      : 'text-gray-400 hover:text-primary hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 font-medium'
                  } px-2 py-2 text-xs whitespace-nowrap rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-900/20`}
                >
                  {item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tablet Sağ taraf */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            <Link href="/take-action" className="btn-gradient px-3 py-2 text-xs font-medium rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center text-center whitespace-nowrap">
              Harekete Geç
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Social Icons */}
            <div className="flex items-center space-x-2">
              <a
                href="https://www.instagram.com/beyond2c_official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-all duration-300 p-1 rounded-md hover:bg-gray-800"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Mobile Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-primary focus:outline-none p-2 rounded-md hover:bg-gray-800 transition-all duration-300"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15" />
                </svg>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-primary focus:outline-none p-2 rounded-md hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle navigation menu"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="px-4 pt-3 pb-4 space-y-2 bg-gradient-to-b from-black to-gray-900">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-primary-900 to-red-900 text-primary font-semibold'
                    : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-primary'
                } block px-4 py-3 text-base font-medium rounded-md transition-all duration-300 transform hover:scale-105`}
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile CTA Button */}
            <div className="pt-3 border-t border-gray-800">
              <Link 
                href="/take-action" 
                className="btn-gradient w-full text-center py-3 px-4 text-base font-medium rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-900/30 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.takeAction')}
              </Link>
            </div>

            {/* Mobile Social Links */}
            <div className="pt-3 border-t border-gray-800">
              <div className="flex items-center justify-center space-x-6">
                <a
                  href="https://www.instagram.com/beyond2c_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-all duration-300 transform hover:scale-110 flex items-center space-x-2"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="text-sm">Instagram</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/beyond2c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-all duration-300 transform hover:scale-110 flex items-center space-x-2"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
