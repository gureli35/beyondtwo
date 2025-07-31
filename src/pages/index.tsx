import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '@/components/Layout';
import Hero from '@/components/sections/Hero';
import FeaturedStories from '@/components/sections/FeaturedStories';
import DataSnapshot from '@/components/sections/DataSnapshot';
import MapPreview from '@/components/sections/MapPreview';
import BlogPosts from '@/components/sections/BlogPosts';
import CallToAction from '@/components/sections/CallToAction';
import Partners from '@/components/sections/Partners';
import { useLanguage } from '@/context/LanguageContext';

const HomePage: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const description = language === 'tr' 
    ? "İklim krizi için harekete geçmek — çok geç olmadan önce. Z kuşağını yerel yönetimlerle buluşturan platform."
    : "Acting on the climate crisis — before it's too late. A platform connecting Gen Z with local governments.";

  const keywords = language === 'tr'
    ? ['iklim değişikliği', 'çevre koruma', 'sürdürülebilirlik', 'iklim krizi', 'yeşil yaşam', 'çevre aktivizmi', 'gençlik hareketi', 'yerel yönetim']
    : ['climate change', 'environmental protection', 'sustainability', 'climate crisis', 'green living', 'environmental activism', 'youth movement', 'local government'];

  return (
    <Layout
      title="Beyond2C"
      description={description}
      keywords={keywords}
      type="website"
      locale={language === 'tr' ? 'tr_TR' : 'en_US'}
      alternateLocales={language === 'tr' ? ['en_US'] : ['tr_TR']}
    >
      <Hero />
      <DataSnapshot />
      <FeaturedStories />
      <MapPreview />
      <BlogPosts />
      <CallToAction />
      <Partners />
    </Layout>
  );
};

export default HomePage;
