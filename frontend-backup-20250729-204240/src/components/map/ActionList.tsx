import React from 'react';
import { FilterOptions } from '@/types';
import Card from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

// Helper function for consistent date formatting
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface ClimateAction {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    region: string;
    coordinates: [number, number];
  };
  type: 'renewable' | 'conservation' | 'education' | 'policy' | 'community';
  status: 'active' | 'completed' | 'planned';
  participants: number;
  impact: string;
  organizer: string;
  startDate: string;
  endDate?: string;
  image: string;
  tags: string[];
}

interface ActionListProps {
  filters: FilterOptions;
}

const ActionList: React.FC<ActionListProps> = ({ filters }) => {
  const { language, t } = useLanguage();
  
  // Mock data for climate actions with language support
  const actions: ClimateAction[] = [
    {
      id: '1',
      title: language === 'tr' ? 'İstanbul Güneş Enerjisi Projesi' : 'Istanbul Solar Energy Project',
      description: language === 'tr' 
        ? 'Şehir genelinde binalara güneş paneli kurulumu' 
        : 'Solar panel installation on buildings throughout the city',
      location: {
        city: language === 'tr' ? 'İstanbul' : 'Istanbul',
        region: language === 'tr' ? 'Marmara' : 'Marmara',
        coordinates: [41.0082, 28.9784]
      },
      type: 'renewable',
      status: 'active',
      participants: 245,
      impact: language === 'tr' ? '2.5 MW enerji üretimi' : '2.5 MW energy production',
      organizer: language === 'tr' ? 'İstanbul Büyükşehir Belediyesi' : 'Istanbul Metropolitan Municipality',
      startDate: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80',
      tags: language === 'tr' ? ['Güneş Enerjisi', 'Belediye'] : ['Solar Energy', 'Municipality'],
    },
    {
      id: '2',
      title: language === 'tr' ? 'Ankara Yeşil Koridor Projesi' : 'Ankara Green Corridor Project',
      description: language === 'tr' 
        ? 'Şehir merkezinde bisiklet yolları ve yeşil alanlar' 
        : 'Bicycle paths and green spaces in the city center',
      location: {
        city: 'Ankara',
        region: language === 'tr' ? 'İç Anadolu' : 'Central Anatolia',
        coordinates: [39.9334, 32.8597]
      },
      type: 'conservation',
      status: 'completed',
      participants: 180,
      impact: language === 'tr' ? '15 km bisiklet yolu' : '15 km bicycle path',
      organizer: language === 'tr' ? 'Ankara Büyükşehir Belediyesi' : 'Ankara Metropolitan Municipality',
      startDate: '2023-06-01',
      endDate: '2024-03-30',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80',
      tags: language === 'tr' ? ['Ulaşım', 'Yeşil Alan'] : ['Transportation', 'Green Space'],
    },
    // Add more mock actions...
  ];

  // Filter actions based on filters prop
  const filteredActions = actions.filter(action => {
    if (filters.category && filters.category.length > 0 && !filters.category.includes(action.type)) return false;
    if (filters.status && filters.status.length > 0 && !filters.status.includes(action.status)) return false;
    if (filters.location && !action.location.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => action.tags.includes(tag))) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return t(`map.${status}`);
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h2 className="font-montserrat font-bold text-3xl mb-4 text-neutral-900">
          {t('map.climateActions')}
        </h2>
        <p className="text-neutral-600">
          {t('map.totalActions')} {filteredActions.length} {t('map.actionsFound')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActions.map((action) => (
          <Card
            key={action.id}
            title={action.title}
            image={action.image}
            href={`/actions/${action.id}`}
            className="h-full"
          >
            <div className="p-4">
              <p className="text-sm text-neutral-600 mb-3">
                {action.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(action.status)}`}>
                  {getStatusText(action.status)}
                </span>
                <span className="text-sm text-neutral-500">
                  {action.location.city}
                </span>
              </div>
              
              <div className="text-xs text-neutral-500 space-y-1">
                <p>{action.organizer}</p>
                <p>{action.participants} {t('map.participants')}</p>
                <p>{action.impact}</p>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {action.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-lg mb-4">
            {t('map.noActionsFound')}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary-500 font-semibold hover:underline"
          >
            {t('common.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionList;
