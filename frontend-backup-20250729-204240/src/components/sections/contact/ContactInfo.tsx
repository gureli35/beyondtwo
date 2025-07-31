import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ContactInfo: React.FC = () => {
  const { language } = useLanguage();
  return (
    <div className="card bg-secondary-900" data-aos="fade-left">
      <h3 className="font-montserrat font-bold text-2xl mb-6 text-accent-500">
        {language === 'tr' ? 'İletişim Bilgilerimiz' : 'Contact Information'}
      </h3>
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-2 text-accent-500">
              {language === 'tr' ? 'E-posta' : 'Email'}
            </h4>
            <p className="text-accent-500 mb-2">
              {language === 'tr' ? 'Genel sorularınız için:' : 'For general inquiries:'}
            </p>
            <a 
              href="mailto:info@beyond2c.org" 
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              info@beyond2c.org
            </a>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-2 text-accent-500">
              {language === 'tr' ? 'Merkez' : 'Headquarters'}
            </h4>
            <p className="text-accent-500">
              {language === 'tr' ? 'Türkiye' : 'Turkey'}<br />
              {language === 'tr' ? '(bağımsız bir grup iklim aktivisti)' : '(an independent group of climate activists)'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-2 text-accent-500">
              {language === 'tr' ? 'Yanıt Süresi' : 'Response Time'}
            </h4>
            <p className="text-accent-500">
              {language === 'tr' ? 'Tüm mesajlarınıza genellikle' : 'We usually respond to all messages within'}<br />
              <strong>24-48 {language === 'tr' ? 'saat içinde' : 'hours'} </strong>{language === 'tr' ? 'yanıt veriyoruz.' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
