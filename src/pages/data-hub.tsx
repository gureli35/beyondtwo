import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

// Helper function for consistent date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const DataHubPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language, t } = useLanguage();

  // Mock data categories with translations
  const dataCategories = [
    {
      id: 'temperature',
      name: t('dataHub.temperatureData'),
      icon: '🌡️',
      color: 'bg-red-500'
    },
    {
      id: 'emissions',
      name: t('dataHub.emissionData'),
      icon: '🏭',
      color: 'bg-gray-500'
    },
    {
      id: 'energy',
      name: t('dataHub.energyData'),
      icon: '⚡',
      color: 'bg-yellow-500'
    },
    {
      id: 'ocean',
      name: t('dataHub.oceanData'),
      icon: '🌊',
      color: 'bg-blue-500'
    }
  ];

  // Mock climate data with translations
  const climateData = [
    {
      id: 'global-temp',
      title: t('dataHub.globalTemperature'),
      value: '+1.2°C',
      change: language === 'tr' ? '+0.08°C/dekad' : '+0.08°C/decade',
      trend: 'up',
      category: 'temperature',
      description: language === 'tr' 
        ? 'Sanayi öncesi döneme göre küresel ortalama sıcaklık artışı'
        : 'Global average temperature rise compared to pre-industrial era',
      source: 'NASA GISS',
      lastUpdated: '2024-12-01'
    },
    {
      id: 'co2-levels',
      title: t('dataHub.co2Levels'),
      value: '421.2 ppm',
      change: language === 'tr' ? '+2.4 ppm/yıl' : '+2.4 ppm/year',
      trend: 'up',
      category: 'emissions',
      description: language === 'tr' 
        ? 'Mauna Loa Gözlemevi atmosferik CO₂ ölçümleri'
        : 'Mauna Loa Observatory atmospheric CO₂ measurements',
      source: 'NOAA',
      lastUpdated: '2024-11-30'
    },
    {
      id: 'renewable-energy',
      title: t('dataHub.renewableEnergy'),
      value: '%28.3',
      change: language === 'tr' ? '+1.2%/yıl' : '+1.2%/year',
      trend: 'up',
      category: 'energy',
      description: language === 'tr' 
        ? 'Küresel elektrik üretiminde yenilenebilir enerji payı'
        : 'Share of renewable energy in global electricity generation',
      source: 'IRENA',
      lastUpdated: '2024-10-15'
    },
    {
      id: 'sea-level',
      title: t('dataHub.seaLevelRise'),
      value: language === 'tr' ? '+3.4 mm/yıl' : '+3.4 mm/year',
      change: language === 'tr' ? '+0.1 mm/yıl²' : '+0.1 mm/year²',
      trend: 'up',
      category: 'ocean',
      description: language === 'tr' 
        ? 'Uydu altimetresi ile ölçülen küresel deniz seviyesi değişimi'
        : 'Global sea level change measured by satellite altimetry',
      source: 'NASA',
      lastUpdated: '2024-11-25'
    },
    {
      id: 'arctic-ice',
      title: t('dataHub.arcticSeaIce'),
      value: language === 'tr' ? '4.2 milyon km²' : '4.2 million km²',
      change: language === 'tr' ? '-13%/dekad' : '-13%/decade',
      trend: 'down',
      category: 'ocean',
      description: language === 'tr' 
        ? 'Eylül ayı minimum Arktik deniz buzu alanı'
        : 'September minimum Arctic sea ice extent',
      source: 'NSIDC',
      lastUpdated: '2024-09-30'
    },
    {
      id: 'carbon-budget',
      title: t('dataHub.carbonBudget'),
      value: '380 GtCO₂',
      change: language === 'tr' ? '-40 GtCO₂/yıl' : '-40 GtCO₂/year',
      trend: 'down',
      category: 'emissions',
      description: language === 'tr' 
        ? '1.5°C için kalan karbon bütçesi (50% olasılık)'
        : 'Remaining carbon budget for 1.5°C (50% probability)',
      source: language === 'tr' ? 'IPCC AR6' : 'IPCC AR6',
      lastUpdated: '2024-12-01'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = climateData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-red-500">📈</span>;
      case 'down':
        return <span className="text-blue-500">📉</span>;
      default:
        return <span className="text-accent-500">➡️</span>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-500';
      case 'down':
        return 'text-blue-500';
      default:
        return 'text-accent-500';
    }
  };

  return (
    <Layout>
      <Head>
        <title>{t('dataHub.title')}</title>
        <meta name="description" content={t('dataHub.description')} />
      </Head>

      {/* Hero Section */}
      <section className="bg-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
                {t('dataHub.bannerText')}
              </div>
              
              <h1 className="font-montserrat font-black text-5xl md:text-7xl mb-8 tracking-tight">
                <span className="text-gradient">{language === 'tr' ? 'GERÇEKLER' : 'FACTS'}</span> {language === 'tr' ? 'KONUŞUYOR' : 'ARE SPEAKING'}
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 text-accent-500 max-w-3xl mx-auto diagonal-border">
                {t('dataHub.heroDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">14</div>
                <div className="text-sm uppercase font-bold text-white mb-1">{language === 'tr' ? 'Haziran 2025' : 'June 2025'}</div>
                <div className="text-xs text-gray-400">{t('dataHub.lastUpdate')}</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold text-primary-500 mb-2">421<span className="text-2xl">ppm</span></div>
                <div className="text-sm uppercase font-bold text-white mb-1">CO₂ LEVELS</div>
                <div className="text-xs text-gray-400">{language === 'tr' ? 'Atmosferik seviye' : 'Atmospheric level'}</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">+1.2°C</div>
                <div className="text-sm uppercase font-bold text-white mb-1">{language === 'tr' ? 'KÜRESEL ISINMA' : 'GLOBAL WARMING'}</div>
                <div className="text-xs text-gray-400">{language === 'tr' ? '1850-1900\'e göre' : 'vs 1850-1900'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-black py-8 sticky top-16 z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder={t('dataHub.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-400 text-accent-500 hover:bg-secondary-300'
                }`}
              >
                {t('dataHub.all')}
              </button>
              {dataCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-400 text-accent-500 hover:bg-secondary-300'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="card hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-accent-500 flex-1">
                    {item.title}
                  </h3>
                  <div className="ml-2">
                    {getTrendIcon(item.trend)}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-primary-500 mb-1">
                    {item.value}
                  </div>
                  <div className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                    {item.change}
                  </div>
                </div>

                <p className="text-sm text-accent-500 mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-xs text-accent-500">
                  <div>
                    <span className="font-medium">{t('dataHub.source')}:</span> {item.source}
                  </div>
                  <div>
                    {formatDate(item.lastUpdated)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-accent-500 text-lg mb-4">📊</div>
              <p className="text-accent-500">
                {t('dataHub.noDataFound')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Key Insights */}
      <section className="bg-black section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-accent-500">
              {t('dataHub.importantFindings')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="propaganda-box transform skew-x-0 p-6">
                <div className="text-red-500 text-2xl mb-4">🚨</div>
                <h3 className="text-xl font-semibold mb-3 text-accent-500">{t('dataHub.criticalThreshold')}</h3>
                <p className="text-accent-500 mb-4">
                  {language === 'tr' 
                    ? `${t('dataHub.globalTemperatureRise')} 1.2°C'ye ${t('dataHub.temperatureReached')}. 1.5°C ${t('dataHub.temperatureOnly')} 0.3°C ${t('dataHub.temperatureLeft')}.`
                    : `${t('dataHub.globalTemperatureRise')} has reached 1.2°C. Only 0.3°C left to the 1.5°C threshold.`
                  }
                </p>
                <div className="w-full bg-secondary-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-accent-500 mt-2">
                  <span>{t('dataHub.current')}: 1.2°C</span>
                  <span>{t('dataHub.target')}: 1.5°C</span>
                </div>
              </div>

              <div className="propaganda-box transform skew-x-0 p-6">
                <div className="text-green-500 text-2xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-3 text-accent-500">{t('dataHub.positiveDevelopment')}</h3>
                <p className="text-accent-500 mb-4">
                  {language === 'tr' 
                    ? `Yenilenebilir enerji payı %28.3'e ${t('dataHub.renewableEnergyReached')} %1.2 ${t('dataHub.renewableEnergyIncreasing')}.`
                    : `Renewable energy share has reached 28.3% and is increasing by 1.2% annually.`
                  }
                </p>
                <div className="w-full bg-secondary-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-accent-500 mt-2">
                  <span>{t('dataHub.current')}: %28.3</span>
                  <span>{t('dataHub.target')}: %100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black border-t-4 border-primary-500 text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-500">
              {t('dataHub.dataSpeaks')}
            </h2>
            <p className="text-xl mb-8 text-accent-500">
              {t('dataHub.dataDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/take-action" className="btn-primary">
                {t('dataHub.takeAction')}
              </a>
              <a href="/issues" className="btn-outline">
                {t('dataHub.exploreIssues')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DataHubPage;
