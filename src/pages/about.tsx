import React from 'react';
import Layout from '@/components/Layout';
import AboutHero from '@/components/sections/about/AboutHero';
import Mission from '@/components/sections/about/Mission';
import FAQ from '@/components/sections/about/FAQ';
import Contact from '@/components/sections/about/Contact';
import { useLanguage } from '@/context/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
    
  return (
    <Layout
      title={t('nav.about')}
      description={t('about.description')}
    >
      <AboutHero />
      <Mission />
      <FAQ />
      <Contact />
    </Layout>
  );
};

export default AboutPage;
