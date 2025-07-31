import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    platform: [
      { name: t('nav.home'), href: '/' },
      { name: t('nav.about'), href: '/about' },
      { name: t('nav.impactMap'), href: '/impact-map' },
      { name: t('nav.dataHub'), href: '/data-hub' },
    ],
    community: [
      { name: t('nav.voices'), href: '/voices' },
      { name: t('nav.events'), href: '/events' },
      { name: t('nav.blog'), href: '/blog' },
      { name: t('cta.volunteer'), href: '/take-action' },
    ],
    resources: [
      { name: t('nav.resources'), href: '/resources' },
      { name: t('nav.faq'), href: '/faq' },
      { name: t('nav.contact'), href: '/contact' },
      { name: t('nav.privacy'), href: '/privacy' },
    ],
  };

  return (
    <footer className="bg-black text-white border-t-4 border-primary-500 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img 
                  src="/2Clogo.png" 
                  alt="Beyond2C Logo" 
                  className="h-10 w-auto filter drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-primary-500 opacity-20 rounded blur-sm"></div>
              </div>
              <span className="font-montserrat font-black text-2xl">
                <span className="bg-gradient-to-r from-primary-500 to-red-600 bg-clip-text text-transparent">Beyond</span>
                <span className="text-white">2C</span>
              </span>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
              {t('footer.description')}
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/beyond2c"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25"
                aria-label="Instagram"
              >
                <svg className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/furkangureli"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700 p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/beyond2c"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-900 p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-500/25"
                aria-label="Twitter/X"
              >
                <svg className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800 hover:border-primary-500 transition-all duration-300">
            <h3 className="font-montserrat font-bold text-xl mb-6 text-white flex items-center">
              <span className="w-2 h-6 bg-primary-500 mr-3 rounded"></span>
              {t('footer.platform')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 py-2"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-primary-500 mr-0 group-hover:mr-3 transition-all duration-300 rounded"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800 hover:border-primary-500 transition-all duration-300">
            <h3 className="font-montserrat font-bold text-xl mb-6 text-white flex items-center">
              <span className="w-2 h-6 bg-primary-500 mr-3 rounded"></span>
              {t('footer.community')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-white transition-all duration-300 py-2"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-primary-500 mr-0 group-hover:mr-3 transition-all duration-300 rounded"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resources Links - Full Width */}
        <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-800 hover:border-primary-500 transition-all duration-300 mb-12">
          <h3 className="font-montserrat font-bold text-xl mb-6 text-white flex items-center justify-center">
            <span className="w-2 h-6 bg-primary-500 mr-3 rounded"></span>
            {t('footer.resources')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {footerLinks.resources.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-primary-500/10 border border-transparent hover:border-primary-500/30"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t-2 border-primary-500/30 pt-8 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-white font-semibold flex items-center">
                <span className="text-primary-500 mr-2">©</span>
                {currentYear} Beyond2C. {t('common.allRightsReserved')}.
              </p>
              <div className="flex items-center space-x-2 text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Verified Secure Platform</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <p className="text-gray-300 text-sm flex items-center">
                <span className="text-primary-500 mr-2">🌱</span>
                {t('footer.builtBy')}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live & Active</span>
              </div>
            </div>
          </div>
          
          {/* Climate Action Call */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-300 text-sm mb-2">
              🚨 <strong className="text-primary-500">Climate Crisis Alert:</strong> Every second counts!
            </p>
            <div className="flex justify-center items-center space-x-6 text-xs text-gray-400">
              <span>2°C Critical Threshold</span>
              <span>•</span>
              <span>Generation Z Action</span>
              <span>•</span>
              <span>Time is Running Out</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
