import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const MapPreview: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <section className="py-16 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white">
              <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('mapPreview.title')}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {t('mapPreview.description')}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-white">{t('map.activeProjects')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white">{t('map.upcomingEvents')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-white">{t('featuredStories.title')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/impact-map">
                <Button variant="primary" size="large">
                  {t('mapPreview.exploreMap')}
                </Button>
              </Link>
              <Link href="/take-action">
                <Button variant="outline" size="large">
                  {t('mapPreview.addAction')}
                </Button>
              </Link>
            </div>
          </div>

          <div data-aos="fade-left" className="relative">
            {/* Harita placeholder - gerçek uygulamada Mapbox/Leaflet component olacak */}
            <div className="bg-gradient-to-br from-red-900 to-black rounded-2xl p-8 min-h-[400px] flex items-center justify-center relative overflow-hidden border border-red-800">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="font-montserrat font-semibold text-xl text-white mb-2">
                  {t('mapPreview.interactiveMap')}
                </h3>
                <p className="text-gray-300">
                  {t('mapPreview.mapStats')}
                </p>
              </div>

              {/* Animated pins */}
              <div className="absolute top-8 left-12 w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="absolute top-16 right-20 w-4 h-4 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-12 left-20 w-4 h-4 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-8 right-16 w-4 h-4 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
