import React, { useState } from 'react';
import { FilterOptions } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface MapFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ filters, onFiltersChange }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: 'energy', label: t('map.energy') },
    { value: 'transportation', label: t('map.transportation') },
    { value: 'wasteManagement', label: t('map.wasteManagement') },
    { value: 'waterConservation', label: t('map.waterConservation') },
    { value: 'greenSpaces', label: t('map.greenSpaces') },
    { value: 'education', label: t('map.education') },
    { value: 'awareness', label: t('map.awareness') },
    { value: 'policy', label: t('map.policy') },
  ];

  const statuses = [
    { value: 'active', label: t('map.active') },
    { value: 'completed', label: t('map.completed') },
    { value: 'planned', label: t('map.planned') },
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleLocationChange = (location: string) => {
    onFiltersChange({
      ...filters,
      location: location || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined
  );

  return (
    <div className="bg-secondary-600 border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-montserrat font-semibold text-lg text-accent-500">
          {t('map.filters')}
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent-500 hover:text-accent-700"
            >
              {t('resources.clearFilters')}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-accent-500 hover:text-accent-700"
          >
            <svg 
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden'} lg:block`}>
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-accent-500 mb-2">
            {t('map.location')}
          </label>
          <input
            type="text"
            placeholder={t('map.location')}
            value={filters.location || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="form-input w-full"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-accent-500 mb-3">
            {t('map.category')}
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <label key={category.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category?.includes(category.value) || false}
                  onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-accent-500">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-accent-500 mb-3">
            {t('map.status')}
          </label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <label key={status.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status.value) || false}
                  onChange={(e) => handleStatusChange(status.value, e.target.checked)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-accent-500">{status.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
