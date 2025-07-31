import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gradient-red-black text-white relative overflow-hidden py-16 md:py-24 w-full min-h-screen flex items-center">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Critical Threshold Banner - exactly like in out folder */}
          <div className="bg-primary-600 text-white px-4 py-2 rounded-md inline-block mb-6 text-sm font-medium" data-aos="fade-down">
            CRITICAL THRESHOLD: 2°C
          </div>
          
          {/* Main Title - exactly like in out folder */}
          <h1 
            className="font-montserrat font-black text-4xl md:text-6xl mb-6 tracking-tight leading-tight" 
            data-aos="fade-up"
          >
            <span className="text-primary-500">BEYOND</span>
            <span className="text-white">2C</span>
          </h1>
          
          {/* Tomorrow Message - exactly like in out folder */}
          <div 
            className="bg-secondary-600 p-3 mb-6 inline-block rounded-md border-l-4 border-primary-500" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <p className="text-lg md:text-xl font-bold text-white">
              TOMORROW MAY BE TOO LATE!
            </p>
          </div>
          
          {/* Description */}
          <p 
            className="text-base md:text-lg mb-8 text-gray-300 max-w-2xl mx-auto" 
            data-aos="fade-up" 
            data-aos-delay="400"
          >
            It's time to act on the climate crisis. Before we surpass the critical 2°C threshold, let's work together to protect the future of our planet.
          </p>
          
          {/* Action Buttons - exactly like in out folder */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8" 
            data-aos="fade-up" 
            data-aos-delay="600"
          >
            <Link href="/take-action" className="w-full sm:w-auto max-w-xs mx-auto sm:mx-0">
              <button 
                className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded w-full transition-colors duration-200"
              >
                Take Action
              </button>
            </Link>
            
            <Link href="/impact-map" className="w-full sm:w-auto max-w-xs mx-auto sm:mx-0">
              <button 
                className="border border-white text-white hover:bg-white hover:text-gray-900 font-medium py-2 px-6 rounded w-full transition-colors duration-200"
              >
                Impact Map
              </button>
            </Link>
          </div>
          
          {/* Enhanced Statistics Cards */}
          <div 
            className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8" 
            data-aos="fade-up" 
            data-aos-delay="800"
          >
            {/* Critical Threshold Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative text-center bg-black border-2 border-primary-500 px-6 py-4 rounded-xl min-w-[120px] hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-primary-500 mb-1 font-mono">2°C</div>
                <div className="text-xs md:text-sm uppercase font-bold tracking-wider text-white">Critical</div>
                <div className="text-xs md:text-sm uppercase font-bold tracking-wider text-white">Threshold</div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
            
            {/* Years Left Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative text-center bg-black border-2 border-red-500 px-6 py-4 rounded-xl min-w-[120px] hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="text-3xl md:text-4xl font-black text-red-500 mb-1 font-mono animate-pulse">7</div>
                <div className="text-xs md:text-sm uppercase font-bold tracking-wider text-white">Years</div>
                <div className="text-xs md:text-sm uppercase font-bold tracking-wider text-white">Left</div>
                <div className="absolute top-1 right-1 text-orange-400">⚠️</div>
              </div>
            </div>
            
            {/* Generation Z Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative text-center bg-black border-2 border-primary-500 px-6 py-4 rounded-xl min-w-[120px] hover:scale-105 transition-all duration-300 shadow-xl overflow-hidden">
                <div className="text-3xl md:text-4xl font-black text-primary-500 mb-1 font-mono">Z</div>
                <div className="text-xs md:text-sm uppercase font-bold tracking-wider text-white">Generation</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
                <div className="absolute top-1 left-1 text-yellow-400">⚡</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - exactly like in out folder */}
        <div 
          className="text-center mt-8" 
          data-aos="fade-up" 
          data-aos-delay="800"
        >
          <div className="animate-bounce">
            <svg 
              className="w-5 h-5 mx-auto text-white opacity-60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
