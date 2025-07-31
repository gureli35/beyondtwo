import { useState, useEffect } from 'react';

// Kaynak öğesini temsil eden arayüz
export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category: 'document' | 'guide' | 'toolkit' | 'video' | 'webinar' | 'case-study';
  fileUrl?: string;
  externalUrl?: string;
  thumbnailImage?: string;
  tags?: string;
  author?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  updatedAt: string;
  viewCount: number;
  downloadCount: number;
}

// Demo kaynaklar verileri
const initialResources: Record<string, Resource> = {
  '1': {
    id: '1',
    title: 'İklim Değişikliği Eylem Planı Oluşturma Rehberi',
    slug: 'iklim-degisikligi-eylem-plani-olusturma-rehberi',
    description: 'Bu rehber, yerel yönetimler ve toplulukların iklim değişikliğiyle mücadele için kapsamlı eylem planları oluşturmasına yardımcı olmak için tasarlanmıştır.',
    content: `# İklim Değişikliği Eylem Planı Oluşturma Rehberi

Bu kapsamlı rehber, yerel yönetimler, okullar, şirketler ve toplulukların kendi iklim değişikliği eylem planlarını oluşturmaları için adım adım bir kılavuz sunmaktadır.

## İçindekiler

1. Giriş ve Temel Kavramlar
2. Mevcut Durum Analizi
3. Paydaş Katılımı
4. Hedef Belirleme
5. Eylem ve Stratejilerin Geliştirilmesi
6. Uygulama Planı
7. İzleme ve Değerlendirme
8. Raporlama ve İletişim

## Adım 1: Mevcut Durum Analizi

İlk adım, kurumunuz veya topluluğunuzun mevcut karbon ayak izini ve iklimle ilgili risklerini anlamaktır...`,
    category: 'guide',
    fileUrl: 'https://beyond2c.org/resources/climate-action-plan-guide.pdf',
    thumbnailImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    tags: 'iklim değişikliği, eylem planı, rehber, yerel yönetimler, topluluklar',
    author: 'Beyond2C Araştırma Ekibi',
    status: 'published',
    publishedAt: '2023-05-12T10:00:00Z',
    updatedAt: '2023-05-12T10:00:00Z',
    viewCount: 1256,
    downloadCount: 482,
  },
  '2': {
    id: '2',
    title: 'Sürdürülebilir Yaşam Araç Kiti',
    slug: 'surdurulebilir-yasam-arac-kiti',
    description: 'Günlük yaşamınızda sürdürülebilir uygulamaları benimsemenize yardımcı olacak kapsamlı bir araç kiti. Enerji tasarrufu, atık azaltma, sürdürülebilir beslenme ve daha fazlası için pratik ipuçları içerir.',
    category: 'toolkit',
    fileUrl: 'https://beyond2c.org/resources/sustainable-living-toolkit.pdf',
    thumbnailImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    tags: 'sürdürülebilir yaşam, araç kiti, pratik ipuçları, enerji tasarrufu, atık azaltma',
    author: 'Sürdürülebilir Yaşam Kolektifi',
    status: 'published',
    publishedAt: '2023-06-20T14:30:00Z',
    updatedAt: '2023-07-15T09:45:00Z',
    viewCount: 934,
    downloadCount: 367,
  },
  '3': {
    id: '3',
    title: 'İklim Değişikliği ve Biyoçeşitlilik Kaybı: Entegre Çözümler',
    slug: 'iklim-degisikligi-ve-biyocesitlilik-kaybi-entegre-cozumler',
    description: 'Bu vaka çalışması, iklim değişikliği ve biyoçeşitlilik kaybının birbirine bağlı krizlerini ele alan entegre çözümleri inceler ve dünya genelinden başarılı örnekler sunar.',
    category: 'case-study',
    content: `# İklim Değişikliği ve Biyoçeşitlilik Kaybı: Entegre Çözümler

Bu vaka çalışması, iklim değişikliği ve biyoçeşitlilik kaybı arasındaki ilişkiyi incelemekte ve bu iki krizi birlikte ele alan entegre çözümleri değerlendirmektedir.

## Özet

İklim değişikliği ve biyoçeşitlilik kaybı, insanlığın karşı karşıya olduğu en büyük iki çevresel krizdir. Bu çalışma, bu krizlerin nasıl birbirine bağlı olduğunu ve bunları birlikte ele alan çözümlerin nasıl daha etkili olabileceğini göstermektedir.

## Vaka Örnekleri

### 1. Mangrove Ormanlarının Restorasyonu, Endonezya

Endonezya'nın kıyı bölgelerinde yürütülen mangrove restorasyonu projeleri, hem karbon tutumu sağlayarak iklim değişikliğiyle mücadeleye katkıda bulunmakta hem de zengin biyoçeşitliliğe sahip ekosistemleri korumaktadır...`,
    fileUrl: 'https://beyond2c.org/resources/climate-biodiversity-case-study.pdf',
    thumbnailImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    tags: 'iklim değişikliği, biyoçeşitlilik, vaka çalışması, entegre çözümler, ekosistem',
    author: 'Dr. Ayşe Yılmaz ve Dr. Mehmet Kaya',
    status: 'draft',
    updatedAt: '2023-09-05T11:20:00Z',
    viewCount: 0,
    downloadCount: 0,
  },
};

// Kaynakları yönetmek için hook
export function useResources() {
  // Kaynakları localStorage'da sakla/getir
  const [resources, setResources] = useState<Record<string, Resource>>({});
  const [isLoading, setIsLoading] = useState(true);

  // İlk yükleme
  useEffect(() => {
    const loadResources = () => {
      setIsLoading(true);
      try {
        // localStorage'dan kaynakları getir
        const savedResources = localStorage.getItem('beyond2c_resources');
        
        // Eğer kayıtlı veri yoksa, demo verileri kullan
        if (!savedResources) {
          localStorage.setItem('beyond2c_resources', JSON.stringify(initialResources));
          setResources(initialResources);
        } else {
          setResources(JSON.parse(savedResources));
        }
      } catch (error) {
        console.error('Kaynaklar yüklenirken hata oluştu:', error);
        // Hata durumunda demo verileri kullan
        setResources(initialResources);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);

  // Kaynak ekleme
  const addResource = (resource: Omit<Resource, 'id' | 'updatedAt' | 'viewCount' | 'downloadCount'>) => {
    // Yeni ID oluştur
    const newId = Date.now().toString();
    
    // Yeni kaynak
    const newResource: Resource = {
      ...resource,
      id: newId,
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
    };
    
    // State güncelle
    const updatedResources = {
      ...resources,
      [newId]: newResource
    };
    
    setResources(updatedResources);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_resources', JSON.stringify(updatedResources));
    
    return newId;
  };

  // Kaynak güncelleme
  const updateResource = (id: string, resource: Partial<Resource>) => {
    // Kaynak var mı kontrol et
    if (!resources[id]) {
      throw new Error(`${id} ID'li kaynak bulunamadı`);
    }
    
    // Güncellenmiş kaynak
    const updatedResource: Resource = {
      ...resources[id],
      ...resource,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedResources = {
      ...resources,
      [id]: updatedResource
    };
    
    setResources(updatedResources);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_resources', JSON.stringify(updatedResources));
  };

  // Kaynak silme
  const deleteResource = (id: string) => {
    // Kaynak var mı kontrol et
    if (!resources[id]) {
      throw new Error(`${id} ID'li kaynak bulunamadı`);
    }
    
    // State güncelle (ilgili ID'yi çıkar)
    const updatedResources = { ...resources };
    delete updatedResources[id];
    
    setResources(updatedResources);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_resources', JSON.stringify(updatedResources));
  };

  // Kaynak getirme
  const getResource = (id: string) => {
    return resources[id];
  };

  // Tüm kaynakları liste olarak getirme
  const getAllResources = () => {
    return Object.values(resources);
  };

  // İndirme sayısını artırma
  const incrementDownloadCount = (id: string) => {
    if (!resources[id]) {
      throw new Error(`${id} ID'li kaynak bulunamadı`);
    }
    
    const updatedResource = {
      ...resources[id],
      downloadCount: resources[id].downloadCount + 1,
    };
    
    const updatedResources = {
      ...resources,
      [id]: updatedResource
    };
    
    setResources(updatedResources);
    localStorage.setItem('beyond2c_resources', JSON.stringify(updatedResources));
  };

  return {
    resources,
    isLoading,
    addResource,
    updateResource,
    deleteResource,
    getResource,
    getAllResources,
    incrementDownloadCount
  };
}

export default useResources;
