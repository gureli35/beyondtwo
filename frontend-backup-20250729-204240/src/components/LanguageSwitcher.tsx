import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label={t('language.switch')}
        >
          <span className="font-bold text-sm">{language.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div className="absolute bottom-14 right-0 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[120px]">
            <button
              onClick={() => { setLanguage('tr'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 transition-colors ${
                language === 'tr' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              🇹🇷 Türkçe
            </button>
            <button
              onClick={() => { setLanguage('en'); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 transition-colors ${
                language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
