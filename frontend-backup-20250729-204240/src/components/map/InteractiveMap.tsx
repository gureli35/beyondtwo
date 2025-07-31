import React, { useEffect, useRef } from 'react';
import { FilterOptions } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface InteractiveMapProps {
  filters: FilterOptions;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Map initialization will be implemented here
    // For now, showing a placeholder
    console.log('Map initialized with filters:', filters);
  }, [filters]);

  return (
    <div className="relative h-screen">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100"
      >
        {/* Placeholder Map Content */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-montserrat font-bold text-2xl text-neutral-900 mb-4">
              {t('map.loadingTitle')}
            </h3>
            <p className="text-neutral-600 mb-6">
              {t('map.loading')}
            </p>
            <div className="flex justify-center space-x-4">
              <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-accent-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-montserrat font-semibold text-sm mb-3 text-neutral-900">
            {t('map.mapIndicators')}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span className="text-neutral-700">{t('map.activeProjects')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              <span className="text-neutral-700">{t('map.upcomingEvents')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
              <span className="text-neutral-700">{t('map.completedProjects')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 space-y-2">
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary-600 transition-colors">
            {t('map.addAction')}
          </button>
          <button className="bg-white text-neutral-900 px-4 py-2 rounded-lg shadow-lg hover:bg-neutral-50 transition-colors">
            {t('map.reportIssue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
