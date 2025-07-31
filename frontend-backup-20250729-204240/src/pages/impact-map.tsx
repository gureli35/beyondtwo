import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

const ImpactMapPage: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Layout
      title={t('impactMap.title')}
      description={t('impactMap.description')}
    >
      <Head>
        <title>{t('impactMap.title')}</title>
        <meta name="description" content={t('impactMap.description')} />
      </Head>
      
      <div className="min-h-screen bg-black w-full">
        {/* Hero Section */}
        <section className="bg-gradient-red-black text-white py-20 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center" data-aos="fade-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                Impact Map
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Discover climate projects and initiatives happening around the world
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="bg-gray-900 border-2 border-red-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-red-600/10" 
              style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}
              data-aos="fade-up"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://maphub.net/embed_h/V4pDJFnUfwLiqcxu?panel=1&panel_closed=1"
                frameBorder="0"
                title="Beyond2C Impact Map"
                className="w-full h-full rounded-2xl"
                style={{ border: 'none' }}
              />
            </div>
            
            {/* Map Description */}
            <div className="mt-8 text-center" data-aos="fade-up" data-aos-delay="200">
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Explore climate action projects, renewable energy initiatives, and sustainability efforts 
                making a real impact on our planet's future.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-black-red py-16 w-full">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Be Part of the Change
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the global movement for climate action and help create a sustainable future
            </p>
            <Link href="/contact">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/25">
                Get Involved
              </button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ImpactMapPage;
