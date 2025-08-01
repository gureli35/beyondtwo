import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import SEO from './SEO';
import LanguageSwitcher from './LanguageSwitcher';
import { ComponentProps, SEOProps } from '@/types';

interface LayoutProps extends ComponentProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  ogImage?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
  structuredData?: object;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Beyond2C", 
  description = "Beyond2C empowers Generation Z to drive urgent climate action by pressuring policymakers and corporations to prevent catastrophic global warming beyond 2 degrees Celsius.",
  keywords,
  image,
  ogImage,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  locale,
  alternateLocales,
  structuredData,
  className 
}) => {
  return (
    <>
      <SEO 
        title={title}
        description={description}
        keywords={keywords}
        image={ogImage || image}
        url={url}
        type={type}
        author={author}
        publishedTime={publishedTime}
        modifiedTime={modifiedTime}
        section={section}
        tags={tags}
        locale={locale}
        alternateLocales={alternateLocales}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navigation />
        <main className="flex-grow w-full">
          <div className="w-full">
            {children}
          </div>
        </main>
        <Footer />
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default Layout;
