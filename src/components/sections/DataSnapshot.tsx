import React from 'react';
import Card from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface ClimateStats {
  temperature: string;
  emissions: string;
  timeLeft: string;
  actions: string;
}

const DataSnapshot: React.FC = () => {
  const { t, language } = useLanguage();
  
  const stats: ClimateStats = {
    temperature: '+1.1°C',
    emissions: '36.3 Gt',
    timeLeft: language === 'tr' ? '7 yıl' : '7 years',
    actions: '2,847',
  };

  const statCards = [
    {
      title: t('dataSnapshot.globalTemperature'),
      value: stats.temperature,
      description: t('dataSnapshot.comparedTo'),
      trend: 'up',
      color: 'text-red-600',
    },
    {
      title: t('dataSnapshot.annualCO2'),
      value: stats.emissions,
      description: t('dataSnapshot.globalTotal'),
      trend: 'up',
      color: 'text-orange-600',
    },
    {
      title: t('dataSnapshot.timeRemaining'),
      value: stats.timeLeft,
      description: t('dataSnapshot.atCurrentRate'),
      trend: 'down',
      color: 'text-red-700',
    },
    {
      title: t('dataSnapshot.communityActions'),
      value: stats.actions,
      description: t('dataSnapshot.registeredOnPlatform'),
      trend: 'up',
      color: 'text-green-600',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="font-montserrat font-bold text-3xl md:text-4xl mb-4 text-white"
            data-aos="fade-up"
          >
            {t('dataSnapshot.title')} <span className="text-primary-500 bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('dataSnapshot.titleHighlight')}</span>
          </h2>
          <p 
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('dataSnapshot.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
              className="bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-lg shadow-red-900/20 p-4 text-center border border-gray-800 hover:border-primary-500 transition-all duration-300"
            >
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color === 'text-green-600' ? 'text-primary-400' : 'text-primary-500'}`}>
                {stat.value}
                {stat.trend === 'up' && (
                  <span className="text-red-500 text-xl ml-1">↗</span>
                )}
                {stat.trend === 'down' && (
                  <span className="text-red-500 text-xl ml-1">↘</span>
                )}
              </div>
              <h3 className="font-montserrat font-semibold text-lg mb-2 text-white">
                {stat.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div 
            className="bg-gradient-to-r from-red-900 to-black p-6 rounded-lg border border-red-800 max-w-4xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <h3 className="font-montserrat font-semibold text-xl mb-3 text-white">
              {t('dataSnapshot.emergency')}
            </h3>
            <p className="text-gray-300 mb-4">
              {t('dataSnapshot.parisAgreement')}
            </p>
            <a 
              href="/data-hub" 
              className="text-primary-400 hover:text-primary-300 font-medium underline transition-colors duration-300"
            >
              {t('dataSnapshot.exploreData')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataSnapshot;
