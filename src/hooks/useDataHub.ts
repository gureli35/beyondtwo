import { useState, useEffect } from 'react';

// Data Hub öğesini temsil eden arayüz
export interface DataHubItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'dataset' | 'visualization' | 'report' | 'infographic';
  sourceUrl?: string;
  dataUrl?: string;
  embedCode?: string;
  thumbnailImage?: string;
  tags?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
  viewCount: number;
  downloadCount: number;
}

// Demo data hub verileri
const initialDataHubItems: Record<string, DataHubItem> = {
  '1': {
    id: '1',
    title: 'Türkiye Karbon Emisyonları (2000-2023)',
    slug: 'turkiye-karbon-emisyonlari-2000-2023',
    description: 'Bu veri seti, Türkiye\'nin 2000-2023 yılları arasındaki karbon emisyonlarını sektörlere göre detaylandırmaktadır. Veri, Türkiye İstatistik Kurumu ve Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından yayınlanan resmi raporlara dayanmaktadır.',
    category: 'dataset',
    sourceUrl: 'https://data.tuik.gov.tr/carbonemissions',
    dataUrl: 'https://beyond2c.org/data/turkey-carbon-emissions-2000-2023.xlsx',
    thumbnailImage: 'https://images.unsplash.com/photo-1598425237654-4fc758e50a93',
    tags: 'karbon emisyonları, Türkiye, iklim değişikliği, veri, TÜİK',
    status: 'published',
    publishedAt: '2023-08-10T09:30:00Z',
    updatedAt: '2023-09-15T11:45:00Z',
    viewCount: 578,
    downloadCount: 123,
  },
  '2': {
    id: '2',
    title: 'İklim Değişikliğinin Türkiye\'deki Tarım Üzerindeki Etkileri',
    slug: 'iklim-degisikliginin-turkiyedeki-tarim-uzerindeki-etkileri',
    description: 'Bu interaktif görselleştirme, Türkiye\'nin farklı bölgelerindeki tarım alanlarının iklim değişikliğinden nasıl etkilendiğini göstermektedir. Kullanıcılar, farklı iklim senaryolarına göre tahminleri inceleyebilir ve gelecekteki değişiklikleri görebilirler.',
    category: 'visualization',
    embedCode: '<iframe src="https://beyond2c.org/visualizations/climate-agriculture-impact" width="100%" height="600" frameborder="0"></iframe>',
    thumbnailImage: 'https://images.unsplash.com/photo-1626289535179-cf91219fb15f',
    tags: 'tarım, iklim değişikliği, Türkiye, görselleştirme, etkiler',
    status: 'published',
    publishedAt: '2023-07-05T14:20:00Z',
    updatedAt: '2023-07-22T09:10:00Z',
    viewCount: 912,
    downloadCount: 0,
  },
  '3': {
    id: '3',
    title: 'Yenilenebilir Enerji Kaynaklarının Türkiye\'deki Gelişimi',
    slug: 'yenilenebilir-enerji-kaynaklarinin-turkiyedeki-gelisimi',
    description: 'Bu rapor, Türkiye\'deki yenilenebilir enerji kaynaklarının 2010-2023 yılları arasındaki gelişimini incelemektedir. Güneş, rüzgar, hidroelektrik ve jeotermal enerji kapasitelerinin artışı, yatırımlar ve politik gelişmeler ele alınmaktadır.',
    category: 'report',
    dataUrl: 'https://beyond2c.org/reports/renewable-energy-turkey-2023.pdf',
    thumbnailImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    tags: 'yenilenebilir enerji, Türkiye, güneş enerjisi, rüzgar enerjisi, hidroelektrik, jeotermal',
    status: 'draft',
    updatedAt: '2023-10-18T16:40:00Z',
    viewCount: 0,
    downloadCount: 0,
  },
};

// Data Hub öğelerini yönetmek için hook
export function useDataHub() {
  // Data Hub öğelerini localStorage'da sakla/getir
  const [dataHubItems, setDataHubItems] = useState<Record<string, DataHubItem>>({});
  const [isLoading, setIsLoading] = useState(true);

  // İlk yükleme
  useEffect(() => {
    const loadDataHubItems = () => {
      setIsLoading(true);
      try {
        // localStorage'dan data hub öğelerini getir
        const savedItems = localStorage.getItem('beyond2c_data_hub');
        
        // Eğer kayıtlı veri yoksa, demo verileri kullan
        if (!savedItems) {
          localStorage.setItem('beyond2c_data_hub', JSON.stringify(initialDataHubItems));
          setDataHubItems(initialDataHubItems);
        } else {
          setDataHubItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Data hub öğeleri yüklenirken hata oluştu:', error);
        // Hata durumunda demo verileri kullan
        setDataHubItems(initialDataHubItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadDataHubItems();
  }, []);

  // Data Hub öğesi ekleme
  const addDataHubItem = (dataHubItem: Omit<DataHubItem, 'id' | 'updatedAt' | 'viewCount' | 'downloadCount'>) => {
    // Yeni ID oluştur
    const newId = Date.now().toString();
    
    // Yeni data hub öğesi
    const newDataHubItem: DataHubItem = {
      ...dataHubItem,
      id: newId,
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
    };
    
    // State güncelle
    const updatedItems = {
      ...dataHubItems,
      [newId]: newDataHubItem
    };
    
    setDataHubItems(updatedItems);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_data_hub', JSON.stringify(updatedItems));
    
    return newId;
  };

  // Data Hub öğesi güncelleme
  const updateDataHubItem = (id: string, dataHubItem: Partial<DataHubItem>) => {
    // Data Hub öğesi var mı kontrol et
    if (!dataHubItems[id]) {
      throw new Error(`${id} ID'li data hub öğesi bulunamadı`);
    }
    
    // Güncellenmiş data hub öğesi
    const updatedDataHubItem: DataHubItem = {
      ...dataHubItems[id],
      ...dataHubItem,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedItems = {
      ...dataHubItems,
      [id]: updatedDataHubItem
    };
    
    setDataHubItems(updatedItems);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_data_hub', JSON.stringify(updatedItems));
  };

  // Data Hub öğesi silme
  const deleteDataHubItem = (id: string) => {
    // Data Hub öğesi var mı kontrol et
    if (!dataHubItems[id]) {
      throw new Error(`${id} ID'li data hub öğesi bulunamadı`);
    }
    
    // State güncelle (ilgili ID'yi çıkar)
    const updatedItems = { ...dataHubItems };
    delete updatedItems[id];
    
    setDataHubItems(updatedItems);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_data_hub', JSON.stringify(updatedItems));
  };

  // Data Hub öğesi getirme
  const getDataHubItem = (id: string) => {
    return dataHubItems[id];
  };

  // Tüm data hub öğelerini liste olarak getirme
  const getAllDataHubItems = () => {
    return Object.values(dataHubItems);
  };

  // İndirme sayısını artırma
  const incrementDownloadCount = (id: string) => {
    if (!dataHubItems[id]) {
      throw new Error(`${id} ID'li data hub öğesi bulunamadı`);
    }
    
    const updatedItem = {
      ...dataHubItems[id],
      downloadCount: dataHubItems[id].downloadCount + 1,
    };
    
    const updatedItems = {
      ...dataHubItems,
      [id]: updatedItem
    };
    
    setDataHubItems(updatedItems);
    localStorage.setItem('beyond2c_data_hub', JSON.stringify(updatedItems));
  };

  return {
    dataHubItems,
    isLoading,
    addDataHubItem,
    updateDataHubItem,
    deleteDataHubItem,
    getDataHubItem,
    getAllDataHubItems,
    incrementDownloadCount
  };
}

export default useDataHub;
