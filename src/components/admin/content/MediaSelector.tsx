import React, { useState } from 'react';
import { Modal } from '@/components/admin/ui/Modal';
import { MediaLibrary } from './MediaLibrary';

interface MediaSelectorProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function MediaSelector({ value, onChange, label = 'Görsel Seç', placeholder = 'Görsel URL' }: MediaSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMediaSelect = (media: any) => {
    onChange(media.url);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center space-x-2">
        <div className="flex-grow">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Kütüphaneden Seç
        </button>
      </div>

      {value && value.match(/\.(jpeg|jpg|gif|png)$/i) && (
        <div className="mt-2">
          <img 
            src={value} 
            alt="Seçilen görsel"
            className="h-32 object-contain border rounded-md" 
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Medya Kütüphanesi"
        size="xl"
      >
        <MediaLibrary 
          onSelect={handleMediaSelect}
          selectable={true}
        />
      </Modal>
    </div>
  );
}
