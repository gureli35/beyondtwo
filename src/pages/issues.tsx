import React, { useEffect } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

// Define IssueCategory type locally since it is not exported from @/types
type IssueCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  stats: {
    current: string;
    target: string;
    trend: string;
    urgency: string;
  };
  impacts: string[];
  solutions: string[];
};

const IssuesPage: React.FC = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  // Mock data for climate issues with language support
  const issueCategories: IssueCategory[] = [
    {
      id: 'temperature',
      title: t('issues.temperature.title'),
      description: t('issues.temperature.description'),
      icon: '🌡️',
      stats: {
        current: '1.2°C',
        target: '1.5°C',
        trend: t('issues.temperature.trend'),
        urgency: t('issues.temperature.urgency')
      },
      impacts: language === 'tr' ? [
        'Kutup buzullarının erimesi',
        'Deniz seviyesinin yükselmesi',
        'Aşırı hava olaylarının artması',
        'Tarımsal verimlilikte düşüş'
      ] : [
        'Melting of polar ice caps',
        'Rising sea levels',
        'Increase in extreme weather events',
        'Decreased agricultural productivity'
      ],
      solutions: language === 'tr' ? [
        'Yenilenebilir enerji kullanımı',
        'Enerji verimliliği',
        'Karbon ayak izini azaltma',
        'Sürdürülebilir ulaşım'
      ] : [
        'Use of renewable energy',
        'Energy efficiency',
        'Reducing carbon footprint',
        'Sustainable transportation'
      ]
    },
    {
      id: 'emissions',
      title: t('issues.emissions.title'),
      description: t('issues.emissions.description'),
      icon: '🏭',
      stats: {
        current: '421 ppm',
        target: '350 ppm',
        trend: t('issues.emissions.trend'),
        urgency: t('issues.emissions.urgency')
      },
      impacts: language === 'tr' ? [
        'Sera etkisinin güçlenmesi',
        'Okyanus asidifikasyonu',
        'Ekosistemlerin bozulması',
        'İnsan sağlığına etkileri'
      ] : [
        'Strengthening of greenhouse effect',
        'Ocean acidification',
        'Ecosystem degradation',
        'Effects on human health'
      ],
      solutions: language === 'tr' ? [
        'Fosil yakıt kullanımını azaltma',
        'Karbon yakalama teknolojileri',
        'Orman koruma ve ağaçlandırma',
        'Döngüsel ekonomi modeli'
      ] : [
        'Reducing fossil fuel use',
        'Carbon capture technologies',
        'Forest conservation and afforestation',
        'Circular economy model'
      ]
    },
    {
      id: 'biodiversity',
      title: t('issues.biodiversity.title'),
      description: t('issues.biodiversity.description'),
      icon: '🦋',
      stats: {
        current: language === 'tr' ? '%68 azalma' : '68% decline',
        target: t('issues.biodiversity.target'),
        trend: t('issues.biodiversity.trend'),
        urgency: t('issues.biodiversity.urgency')
      },
      impacts: language === 'tr' ? [
        'Habitat kaybı',
        'Gıda zincirinin bozulması',
        'Polinasyon problemleri',
        'Genetik çeşitliliğin azalması'
      ] : [
        'Habitat loss',
        'Food chain disruption',
        'Pollination problems',
        'Decrease in genetic diversity'
      ],
      solutions: language === 'tr' ? [
        'Korunan alan oranını artırma',
        'Sürdürülebilir tarım',
        'Habitat restorasyonu',
        'Tür koruma programları'
      ] : [
        'Increasing protected area ratio',
        'Sustainable agriculture',
        'Habitat restoration',
        'Species conservation programs'
      ]
    },
    {
      id: 'water',
      title: t('issues.water.title'),
      description: t('issues.water.description'),
      icon: '💧',
      stats: {
        current: language === 'tr' ? '2.2 milyar' : '2.2 billion',
        target: t('issues.water.target'),
        trend: t('issues.water.trend'),
        urgency: t('issues.water.urgency')
      },
      impacts: language === 'tr' ? [
        'Kuraklık artışı',
        'Su kalitesinde düşüş',
        'Tarımsal üretimde sorunlar',
        'Sağlık problemleri'
      ] : [
        'Increase in drought',
        'Decline in water quality',
        'Problems in agricultural production',
        'Health problems'
      ],
      solutions: language === 'tr' ? [
        'Su verimliliği',
        'Yağmur suyu toplama',
        'Atık su arıtımı',
        'Su korunma teknolojileri'
      ] : [
        'Water efficiency',
        'Rainwater harvesting',
        'Wastewater treatment',
        'Water conservation technologies'
      ]
    }
  ];

  return (
    <Layout>
      <Head>
        <title>{t('issues.title')}</title>
        <meta name="description" content={t('issues.description')} />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-red-black text-white py-16 md:py-24 relative overflow-hidden w-full min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Critical Alert Banner */}
            <div className="bg-primary-600 text-white px-6 py-3 rounded-md inline-block mb-8 text-sm font-medium animate-pulse" data-aos="fade-down">
              {language === 'tr' ? '⚠️ İKLİM ACİL DURUMU İLAN EDİLDİ' : '⚠️ CLIMATE EMERGENCY DECLARED'}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight"
              data-aos="fade-up"
            >
              <span className="text-primary-500">{language === 'tr' ? 'İKLİM' : 'CLIMATE'}</span>
              <span className="text-white"> {language === 'tr' ? 'KRİZİ' : 'CRISIS'}</span>
            </h1>
            
            <div 
              className="bg-gradient-to-r from-red-900 to-black p-6 mb-8 inline-block rounded-lg border-l-4 border-primary-500 transform skew-x-0"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {language === 'tr' ? 'GEZEGEN YANIYOR - ŞİMDİ EYLEM GEREKLİ!' : 'THE PLANET IS BURNING - ACTION IS NEEDED NOW!'}
              </p>
            </div>
            
            <p 
              className="text-lg md:text-xl mb-10 text-gray-300 max-w-4xl mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              {t('issues.heroDescription')}
            </p>
            
            {/* Crisis Statistics */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{t('issues.lastDecade')}</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">HOTTEST DECADE</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{t('issues.co2Level')}</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">CO₂ LEVELS</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-16 -left-16 w-24 h-24 bg-red-600 rounded-full opacity-30"></div>
      </section>

      {/* Issues Grid */}
      <section className="py-16 md:py-24 bg-black w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 
              className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white"
              data-aos="fade-up"
            >
              <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{language === 'tr' ? 'KRİTİK SORUNLAR' : 'CRITICAL ISSUES'}</span>
            </h2>
            <p 
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {language === 'tr' ? 'Gezegenimizin karşılaştığı en acil iklim zorluklarını anlamak' : 'Understanding the most urgent climate challenges facing our planet'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {issueCategories.map((issue, index) => (
              <div 
                key={issue.id} 
                className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <div className="text-5xl mr-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full">
                      {issue.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">
                      {issue.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    {issue.description}
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-black rounded-lg border border-gray-800">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">{t('issues.currentStatus')}</div>
                      <div className="text-xl font-bold text-primary-400">{issue.stats.current}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">{t('issues.target')}</div>
                      <div className="text-xl font-bold text-green-400">{issue.stats.target}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">{t('issues.trend')}</div>
                      <div className={`text-xl font-bold ${
                        issue.stats.trend === 'Artış' || issue.stats.trend === 'Increasing' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {issue.stats.trend}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">{t('issues.urgency')}</div>
                      <div className={`text-xl font-bold ${
                        issue.stats.urgency === 'Kritik' || issue.stats.urgency === 'Critical' ? 'text-red-400' : 
                        issue.stats.urgency === 'Yüksek' || issue.stats.urgency === 'High' ? 'text-orange-400' : 'text-amber-400'
                      }`}>
                        {issue.stats.urgency}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Impacts */}
                    <div className="bg-red-900 bg-opacity-20 p-6 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-bold text-red-400 mb-4 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {t('issues.impacts')}
                      </h4>
                      <ul className="space-y-2">
                        {issue.impacts.map((impact, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Solutions */}
                    <div className="bg-green-900 bg-opacity-20 p-6 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-bold text-green-400 mb-4 flex items-center">
                        <span className="mr-2">💡</span>
                        {t('issues.solutions')}
                      </h4>
                      <ul className="space-y-2">
                        {issue.solutions.map((solution, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div 
              className="bg-gradient-to-r from-primary-500 to-red-600 rounded-2xl p-8 max-w-4xl mx-auto shadow-xl border border-red-700"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <h3 className="font-montserrat font-bold text-3xl mb-4 text-white">
                {language === 'tr' ? '🚨 ZAMAN TÜKENIYOR' : '🚨 TIME IS RUNNING OUT'}
              </h3>
              <p className="text-white mb-6 text-lg opacity-90">
                {language === 'tr' ? 'Bu sorunlar acil eylem gerektiriyor. Harekete katılın ve bugün fark yaratın.' : 'These issues require immediate action. Join the movement and make a difference today.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/take-action" 
                  className="bg-white text-primary-500 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {language === 'tr' ? 'ŞİMDİ HAREKETE GEÇ' : 'TAKE ACTION NOW'}
                </a>
                <a 
                  href="/impact-map" 
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-500 transition-all duration-300"
                >
                  {language === 'tr' ? 'ÇÖZÜMLERİ KEŞFET' : 'EXPLORE SOLUTIONS'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IssuesPage;
