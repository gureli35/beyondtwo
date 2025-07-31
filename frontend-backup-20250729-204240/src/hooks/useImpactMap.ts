import { useState, useEffect } from 'react';

// Harita noktasını temsil eden arayüz
export interface ImpactMapPoint {
  id: string;
  title: string;
  description: string;
  category: 'project' | 'event' | 'organization' | 'success-story' | 'risk-area';
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  country: string;
  imageUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'planned' | 'cancelled';
  impact?: string;
  tags?: string;
  updatedAt: string;
}

// Demo harita noktaları verileri
const initialMapPoints: Record<string, ImpactMapPoint> = {
  '1': {
    id: '1',
    title: 'İstanbul İklim Eylemi',
    description: 'İstanbul genelinde iklim farkındalığını artırmak için düzenlenen bir dizi etkinlik ve atölye çalışması.',
    category: 'project',
    latitude: 41.0082,
    longitude: 28.9784,
    address: 'Beyoğlu, İstanbul',
    city: 'İstanbul',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1527586888775-b8b2a7bc9caf',
    contactPerson: 'Ayşe Yılmaz',
    contactEmail: 'ayse@example.com',
    contactPhone: '+90 212 555 1234',
    websiteUrl: 'https://www.istanbuliklimeylemi.org',
    startDate: '2023-03-15',
    endDate: '2023-12-31',
    status: 'active',
    impact: '5000+ kişiye ulaşıldı, 25 okul ziyaret edildi, 10 topluluk bahçesi kuruldu.',
    tags: 'iklim eylemi, farkındalık, eğitim, topluluk bahçeleri',
    updatedAt: '2023-07-10T09:30:00Z',
  },
  '2': {
    id: '2',
    title: 'Ankara Yenilenebilir Enerji Kooperatifi',
    description: 'Topluluk temelli yenilenebilir enerji projeleri geliştiren ve yürüten bir kooperatif.',
    category: 'organization',
    latitude: 39.9334,
    longitude: 32.8597,
    address: 'Çankaya, Ankara',
    city: 'Ankara',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    contactPerson: 'Mehmet Kaya',
    contactEmail: 'mehmet@example.com',
    contactPhone: '+90 312 444 5678',
    websiteUrl: 'https://www.ankarayek.org',
    startDate: '2020-06-01',
    status: 'active',
    impact: '3 MW kurulu güneş enerjisi kapasitesi, 500 kooperatif üyesi, 2000 hanenin elektrik ihtiyacı karşılanıyor.',
    tags: 'yenilenebilir enerji, kooperatif, güneş enerjisi, topluluk enerjisi',
    updatedAt: '2023-08-15T14:45:00Z',
  },
  '3': {
    id: '3',
    title: 'İzmir Su Verimliliği Projesi',
    description: 'İzmir\'de su kaynaklarının sürdürülebilir yönetimi ve su verimliliğini artırmayı amaçlayan proje.',
    category: 'project',
    latitude: 38.4237,
    longitude: 27.1428,
    address: 'Konak, İzmir',
    city: 'İzmir',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1581022295087-35e593722b22',
    contactPerson: 'Zeynep Demir',
    contactEmail: 'zeynep@example.com',
    contactPhone: '+90 232 333 9876',
    websiteUrl: 'https://www.izmirsuverimlilik.org',
    startDate: '2022-09-01',
    endDate: '2025-08-31',
    status: 'active',
    impact: '%15 su tasarrufu sağlandı, 50 okula su verimliliği sistemleri kuruldu.',
    tags: 'su verimliliği, sürdürülebilir su yönetimi, kuraklık, adaptasyon',
    updatedAt: '2023-06-20T11:15:00Z',
  },
  '4': {
    id: '4',
    title: 'Antalya İklim Değişikliği Riski Değerlendirmesi',
    description: 'Antalya\'nın iklim değişikliğine bağlı riskleri ve savunmasızlığını değerlendiren kapsamlı bir çalışma.',
    category: 'risk-area',
    latitude: 36.8969,
    longitude: 30.7133,
    city: 'Antalya',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1531219572328-a0171b4448a3',
    websiteUrl: 'https://www.antalyaiklimriski.org',
    startDate: '2023-01-10',
    endDate: '2023-07-15',
    status: 'completed',
    impact: 'Şehir genelinde 10 yüksek riskli bölge belirlendi, uyum stratejileri geliştirildi.',
    tags: 'iklim riski, savunmasızlık, uyum, kıyı bölgeleri',
    updatedAt: '2023-07-20T16:30:00Z',
  },
  '5': {
    id: '5',
    title: 'Bursa Gençlik İklim Zirvesi',
    description: 'Gençlerin iklim değişikliği konusunda bilgi ve becerilerini geliştirmek için düzenlenen ulusal bir zirve.',
    category: 'event',
    latitude: 40.1885,
    longitude: 29.0610,
    address: 'Nilüfer, Bursa',
    city: 'Bursa',
    country: 'Türkiye',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    contactPerson: 'Ali Öztürk',
    contactEmail: 'ali@example.com',
    contactPhone: '+90 224 222 1111',
    websiteUrl: 'https://www.bursagenclikiklimzirvesi.org',
    startDate: '2023-11-15',
    endDate: '2023-11-17',
    status: 'planned',
    tags: 'gençlik, zirve, iklim değişikliği, eğitim',
    updatedAt: '2023-09-05T10:20:00Z',
  },
};

// Harita noktalarını yönetmek için hook
export function useImpactMap() {
  // Harita noktalarını localStorage'da sakla/getir
  const [mapPoints, setMapPoints] = useState<Record<string, ImpactMapPoint>>({});
  const [isLoading, setIsLoading] = useState(true);

  // İlk yükleme
  useEffect(() => {
    const loadMapPoints = () => {
      setIsLoading(true);
      try {
        // localStorage'dan harita noktalarını getir
        const savedPoints = localStorage.getItem('beyond2c_impact_map');
        
        // Eğer kayıtlı veri yoksa, demo verileri kullan
        if (!savedPoints) {
          localStorage.setItem('beyond2c_impact_map', JSON.stringify(initialMapPoints));
          setMapPoints(initialMapPoints);
        } else {
          setMapPoints(JSON.parse(savedPoints));
        }
      } catch (error) {
        console.error('Harita noktaları yüklenirken hata oluştu:', error);
        // Hata durumunda demo verileri kullan
        setMapPoints(initialMapPoints);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapPoints();
  }, []);

  // Harita noktası ekleme
  const addMapPoint = (mapPoint: Omit<ImpactMapPoint, 'id' | 'updatedAt'>) => {
    // Yeni ID oluştur
    const newId = Date.now().toString();
    
    // Yeni harita noktası
    const newMapPoint: ImpactMapPoint = {
      ...mapPoint,
      id: newId,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedPoints = {
      ...mapPoints,
      [newId]: newMapPoint
    };
    
    setMapPoints(updatedPoints);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_impact_map', JSON.stringify(updatedPoints));
    
    return newId;
  };

  // Harita noktası güncelleme
  const updateMapPoint = (id: string, mapPoint: Partial<ImpactMapPoint>) => {
    // Harita noktası var mı kontrol et
    if (!mapPoints[id]) {
      throw new Error(`${id} ID'li harita noktası bulunamadı`);
    }
    
    // Güncellenmiş harita noktası
    const updatedMapPoint: ImpactMapPoint = {
      ...mapPoints[id],
      ...mapPoint,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedPoints = {
      ...mapPoints,
      [id]: updatedMapPoint
    };
    
    setMapPoints(updatedPoints);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_impact_map', JSON.stringify(updatedPoints));
  };

  // Harita noktası silme
  const deleteMapPoint = (id: string) => {
    // Harita noktası var mı kontrol et
    if (!mapPoints[id]) {
      throw new Error(`${id} ID'li harita noktası bulunamadı`);
    }
    
    // State güncelle (ilgili ID'yi çıkar)
    const updatedPoints = { ...mapPoints };
    delete updatedPoints[id];
    
    setMapPoints(updatedPoints);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_impact_map', JSON.stringify(updatedPoints));
  };

  // Harita noktası getirme
  const getMapPoint = (id: string) => {
    return mapPoints[id];
  };

  // Tüm harita noktalarını liste olarak getirme
  const getAllMapPoints = () => {
    return Object.values(mapPoints);
  };

  // Kategoriye göre harita noktalarını getirme
  const getMapPointsByCategory = (category: ImpactMapPoint['category']) => {
    return Object.values(mapPoints).filter(point => point.category === category);
  };

  // Duruma göre harita noktalarını getirme
  const getMapPointsByStatus = (status: ImpactMapPoint['status']) => {
    return Object.values(mapPoints).filter(point => point.status === status);
  };

  return {
    mapPoints,
    isLoading,
    addMapPoint,
    updateMapPoint,
    deleteMapPoint,
    getMapPoint,
    getAllMapPoints,
    getMapPointsByCategory,
    getMapPointsByStatus
  };
}

export default useImpactMap;
