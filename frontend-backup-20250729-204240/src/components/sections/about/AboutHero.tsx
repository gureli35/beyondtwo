import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const AboutHero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-red-black text-white py-24 relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-md inline-block mb-8 text-sm font-medium" data-aos="fade-down">
            {t('about.mission')}
          </div>
          
          <h1 
            className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-lg tracking-tight"
            data-aos="fade-up"
          >
            <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('about.whoAreWe')}</span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('about.subtitle')}
          </p>
          
          <div 
            className="bg-gradient-to-r from-red-900 to-black p-6 rounded-lg border border-red-800 text-left transform skew-x-0"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <blockquote className="text-lg md:text-xl text-white font-bold leading-relaxed">
              {t('about.missionStatement')}
            </blockquote>
            <cite className="block mt-4 text-gray-300 font-semibold">
              — Beyond2C
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
