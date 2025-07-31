import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Custom404: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sayfa Bulunamadı - Beyond2C</title>
        <meta name="description" content="Aradığınız sayfa bulunamadı. Ana sayfaya dönün." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto h-32 w-32 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0120 12a8 8 0 10-8 8 7.962 7.962 0 015.291-2z" />
              </svg>
            </div>
            <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Sayfa Bulunamadı</h2>
            <p className="mt-2 text-sm text-gray-600">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              🏠 Ana Sayfaya Dön
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/blog"
                className="py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                📝 Blog
              </Link>
              <Link
                href="/contact"
                className="py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                📞 İletişim
              </Link>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Sorun devam ediyorsa, lütfen{' '}
              <Link href="/contact" className="text-indigo-600 hover:text-indigo-500">
                bizimle iletişime geçin
              </Link>
              .
            </p>
          </div>
          
          {/* Climate Action Quote */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <blockquote className="text-sm text-gray-600 italic">
              "İklim krizi bekleyemez. Her saniye değerli."
            </blockquote>
            <p className="text-xs text-gray-500 mt-2">- Beyond2C Ekibi</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
