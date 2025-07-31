import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  children,
  title,
  image,
  href,
  className = '',
}) => {
  const cardContent = (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl shadow-red-900/20 border border-gray-700 hover:border-primary-500 transition-all duration-500 group overflow-hidden hover:shadow-red-500/30 ${className}`}>
      {image && (
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={image}
            alt={title || 'Card image'}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated red accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-red-600 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          
          {/* Arrow icon */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-primary-500/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hover:bg-primary-600">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="p-6 relative">
        {/* Subtle red glow effect */}
        <div className="absolute top-0 left-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {title && (
          <h3 className="font-montserrat font-bold text-xl mb-4 text-white group-hover:text-primary-300 transition-colors duration-500 line-clamp-2 leading-tight">
            {title}
          </h3>
        )}
        
        <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
          {children}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-red-600 group-hover:w-full transition-all duration-700 ease-out"></div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-900/30 transform-gpu">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default Card;
