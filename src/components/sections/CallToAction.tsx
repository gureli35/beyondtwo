import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const CallToAction: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-red-black text-white relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 
            className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-white text-shadow"
            data-aos="fade-up"
          >
            {t('cta.timeToAct')}
          </h2>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {t('cta.description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2 text-white">{t('cta.volunteer')}</h3>
              <p className="text-gray-300">{t('cta.volunteerDesc')}</p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2 text-white">{t('cta.share')}</h3>
              <p className="text-gray-300">{t('cta.shareDesc')}</p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2 text-white">{t('cta.influence')}</h3>
              <p className="text-gray-300">{t('cta.influenceDesc')}</p>
            </div>
          </div>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <Link href="/take-action">
              <Button variant="accent" size="large" className="w-full sm:w-auto">
                {t('common.getStarted')}
              </Button>
            </Link>
            
            <Link href="/about">
              <Button variant="outline" size="large" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-black">
                {t('common.moreInfo')}
              </Button>
            </Link>
          </div>

          <div 
            className="mt-12 text-center"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <p className="text-gray-300 text-lg mb-4">
              <strong className="text-primary-400">2,847</strong> {t('cta.peopleJoined')}
            </p>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 bg-primary-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-white font-semibold text-sm">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-gray-300 ml-4">{t('common.joinUs')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-500 rounded-full opacity-20"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-red-800 rounded-full opacity-20"></div>
    </section>
  );
};

export default CallToAction;
