import React from 'react';
import Layout from '@/components/Layout';
import ContactForm from '../components/sections/contact/ContactForm';
import ContactInfo from '../components/sections/contact/ContactInfo';
import SocialMedia from '../components/sections/contact/SocialMedia';
import { useLanguage } from '@/context/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Layout
      title={t('contact.title')}
      description={t('contact.description')}
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
              {t('contact.bannerText')}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase"
              data-aos="fade-up"
            >
              {t('contact.heroTitle')}
            </h1>
            
            <p 
              className="text-lg md:text-xl mb-10 text-accent-500 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {t('contact.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-montserrat font-bold text-3xl mb-8 text-accent-500">
                {t('contact.formTitle')}
              </h2>
              <ContactForm />
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="font-montserrat font-bold text-3xl mb-8 text-accent-500">
                {t('contact.contactInfo')}
              </h2>
              <ContactInfo />
              <div className="mt-12">
                <SocialMedia />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
