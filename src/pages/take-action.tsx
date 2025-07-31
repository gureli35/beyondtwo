import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLanguage } from '@/context/LanguageContext';

const TakeActionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('individual');
  const { language, t } = useLanguage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Layout
      title={t('takeAction.title')}
      description={t('takeAction.description')}
    >
      <Head>
        <title>{t('takeAction.title')}</title>
        <meta name="description" content={t('takeAction.description')} />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-red-black text-white py-16 md:py-24 relative overflow-hidden w-full min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Banner */}
            <div className="bg-primary-600 text-white px-6 py-3 rounded-md inline-block mb-8 text-sm font-medium animate-pulse" data-aos="fade-down">
              {t('takeAction.bannerText')}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight"
              data-aos="fade-up"
            >
              <span className="text-primary-500">{t('takeAction.heroTitle')}</span>
            </h1>
            
            <div 
              className="bg-gradient-to-r from-red-900 to-black p-6 mb-8 inline-block rounded-lg border-l-4 border-primary-500"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {t('takeAction.heroDescription')}
              </p>
            </div>
            
            {/* Stats */}
            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">3</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">{language === 'tr' ? 'Eylem Seviyesi' : 'Action Levels'}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">∞</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">{language === 'tr' ? 'Etki Potansiyeli' : 'Impact Potential'}</div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-center border-2 border-gray-800 hover:border-primary-500 transition-colors duration-300">
                <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">NOW</div>
                <div className="text-sm text-gray-300 uppercase tracking-wide font-semibold">{language === 'tr' ? 'Başlama Zamanı' : 'Time to Start'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Categories */}
      <section className="py-16 md:py-24 bg-black w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white"
              data-aos="fade-up"
            >
              <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('takeAction.howToStart')}</span>
            </h2>
            <p 
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {t('takeAction.chooseYourPath')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-16" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-gray-900 rounded-xl p-2 border border-gray-800">
              {[
                { id: 'individual', label: t('takeAction.individual'), icon: '👤' },
                { id: 'community', label: t('takeAction.community'), icon: '👥' },
                { id: 'institutional', label: t('takeAction.institutional'), icon: '🏢' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 mx-1 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px] max-w-7xl mx-auto">
            {activeTab === 'individual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Individual Action Cards */}
                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={100}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      🌱
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.individual.lifestyle')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.individual.lifestyleDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.individual.lifestyleCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      📢
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.individual.advocacy')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.individual.advocacyDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.individual.advocacyCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={300}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      💚
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.individual.volunteer')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.individual.volunteerDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.individual.volunteerCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={100}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      👥
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.community.organize')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.community.organizeDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.community.organizeCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      🏛️
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.community.collaborate')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.community.collaborateDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.community.collaborateCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            )}

            {activeTab === 'institutional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={100}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      🏢
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.institutional.corporate')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.institutional.corporateDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.institutional.corporateCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>

                <div 
                  className="bg-gray-900 rounded-lg border-2 border-gray-800 hover:border-primary-500 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl"
                  data-aos="fade-up"
                  data-aos-delay={200}
                >
                  <div className="p-8">
                    <div className="text-5xl mb-6 p-3 bg-gradient-to-r from-primary-500 to-red-600 rounded-full w-fit">
                      🎓
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors">
                      {t('takeAction.institutional.educational')}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {t('takeAction.institutional.educationalDesc')}
                    </p>
                    <Link href="/contact">
                      <button className="w-full bg-gradient-to-r from-primary-500 to-red-600 text-white font-bold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-red-700 transition-all duration-300 shadow-lg">
                        {t('takeAction.institutional.educationalCta')}
                      </button>
                    </Link>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-500 to-red-600 py-16 w-full">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white">
            🚨 {t('takeAction.ready')}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white opacity-90 max-w-3xl mx-auto leading-relaxed">
            {t('takeAction.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/contact">
              <button className="bg-white text-primary-500 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                {t('common.contactUs')}
              </button>
            </Link>
            <Link href="/impact-map">
              <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-500 transition-all duration-300">
                {t('common.exploreMap')}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TakeActionPage;
