import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Partner {
  name: string;
  logo: string;
  url: string;
  type: 'ngo' | 'government' | 'academic' | 'corporate';
}

const Partners: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Mock data - gerçek uygulamada API'den gelecek
  const partners: Partner[] = [
    {
      name: language === 'tr' ? 'Türkiye İklim Değişikliği Vakfı' : 'Turkish Climate Change Foundation',
      logo: 'https://via.placeholder.com/120x60/2D7D46/FFFFFF?text=TIKDV',
      url: '#',
      type: 'ngo',
    },
    {
      name: language === 'tr' ? 'Boğaziçi Üniversitesi' : 'Bogazici University',
      logo: 'https://via.placeholder.com/120x60/1A5276/FFFFFF?text=BOUN',
      url: '#',
      type: 'academic',
    },
    {
      name: language === 'tr' ? 'WWF Türkiye' : 'WWF Turkey',
      logo: 'https://via.placeholder.com/120x60/2D7D46/FFFFFF?text=WWF',
      url: '#',
      type: 'ngo',
    },
    {
      name: language === 'tr' ? 'Çevre Şehircilik ve İklim Bakanlığı' : 'Ministry of Environment, Urbanization and Climate',
      logo: 'https://via.placeholder.com/120x60/1A5276/FFFFFF?text=ÇŞIB',
      url: '#',
      type: 'government',
    },
    {
      name: language === 'tr' ? 'Sabancı Vakfı' : 'Sabanci Foundation',
      logo: 'https://via.placeholder.com/120x60/F39C12/FFFFFF?text=SABANCI',
      url: '#',
      type: 'corporate',
    },
    {
      name: language === 'tr' ? 'İTÜ İklim Değişikliği Enstitüsü' : 'ITU Climate Change Institute',
      logo: 'https://via.placeholder.com/120x60/2D7D46/FFFFFF?text=ITU',
      url: '#',
      type: 'academic',
    },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white"
            data-aos="fade-up"
          >
            <span className="bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent">{t('partners.title')}</span>
          </h2>
          <p 
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('partners.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              data-aos="fade-up"
              data-aos-delay={200 + index * 100}
              className="flex items-center justify-center"
            >
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-60 hover:opacity-100 transition-opacity duration-300 p-4"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full h-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div 
            className="bg-gradient-to-r from-red-800 to-black border border-red-700 rounded-lg p-8 max-w-4xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <h3 className="font-montserrat font-semibold text-2xl mb-4 text-white">
              {t('partners.becomePartner')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('partners.partnershipDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:ortaklik@beyond2c.org" 
                className="btn-gradient inline-block px-6 py-3 rounded-md font-medium text-white transition-all duration-300 hover:scale-105"
              >
                {t('partners.contactUs')}
              </a>
              <a 
                href="/partnerships" 
                className="border border-white text-white hover:bg-white hover:text-black inline-block px-6 py-3 rounded-md font-medium transition-all duration-300"
              >
                {t('partners.partnershipInfo')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
