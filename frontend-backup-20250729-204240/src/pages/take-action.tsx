import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

// Type definitions for action categories and forms
interface ActionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
  color: string;
}

const TakeActionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('individual');
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { language, t } = useLanguage();

  return (
    <Layout
      title={t('takeAction.title')}
      description={t('takeAction.description')}
    >
      {/* Hero Section */}
      <section className="hero-gradient text-white section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="propaganda-banner mb-8 inline-block" data-aos="fade-down">
              {t('takeAction.bannerText')}
            </div>
            
            <h1 
              className="font-montserrat font-black text-5xl md:text-7xl mb-8 text-shadow-red tracking-tight leading-tight uppercase"
              data-aos="fade-up"
            >
              {t('takeAction.heroTitle')}
            </h1>
            
            <p 
              className="text-lg md:text-xl mb-10 text-accent-500 max-w-3xl mx-auto"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {t('takeAction.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Action Categories */}
      <section className="section-padding bg-secondary-700">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-accent-500">
              <span className="text-gradient">{t('takeAction.howToStart')}</span>
            </h2>
            <p className="text-lg md:text-xl text-accent-500 max-w-3xl mx-auto">
              {t('takeAction.chooseYourPath')}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 bg-secondary-600 rounded-lg p-2">
            {[
              { id: 'individual', label: t('takeAction.individual') },
              { id: 'community', label: t('takeAction.community') },
              { id: 'institutional', label: t('takeAction.institutional') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-accent-500 hover:bg-secondary-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'individual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Individual Action Cards */}
                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.individual.lifestyle')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.individual.lifestyleDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.individual.lifestyleCta')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">📢</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.individual.advocacy')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.individual.advocacyDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.individual.advocacyCta')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">💚</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.individual.volunteer')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.individual.volunteerDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.individual.volunteerCta')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'community' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.community.organize')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.community.organizeDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.community.organizeCta')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">🏛️</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.community.collaborate')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.community.collaborateDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.community.collaborateCta')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'institutional' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.institutional.corporate')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.institutional.corporateDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.institutional.corporateCta')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="card bg-secondary-600 border-l-4 border-primary-500">
                  <div className="p-6">
                    <div className="text-4xl mb-4">🎓</div>
                    <h3 className="text-xl font-bold text-accent-500 mb-3">
                      {t('takeAction.institutional.educational')}
                    </h3>
                    <p className="text-accent-500 mb-4">
                      {t('takeAction.institutional.educationalDesc')}
                    </p>
                    <Link href="/contact">
                      <Button variant="primary" className="w-full">
                        {t('takeAction.institutional.educationalCta')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="font-montserrat font-bold text-4xl mb-6">
            {t('takeAction.ready')}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {t('takeAction.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-500">
                {t('common.contactUs')}
              </Button>
            </Link>
            <Link href="/impact-map">
              <Button variant="secondary">
                {t('common.exploreMap')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TakeActionPage;
