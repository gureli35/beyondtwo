import { useState, useEffect } from 'react';

// Youth Voice içeriğini temsil eden arayüz
export interface YouthVoice {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  featuredImage?: string;
  authorName: string;
  authorAge?: number;
  authorLocation?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  viewCount: number;
  updatedAt: string;
}

// Demo youth voices verileri
const initialYouthVoices: Record<string, YouthVoice> = {
  '1': {
    id: '1',
    title: 'İklim Değişikliği ile Mücadelemiz',
    slug: 'iklim-degisikligi-ile-mucadelemiz',
    content: `# İklim Değişikliği ile Mücadelemiz

Şehrimizde iklim değişikliği konusunda farkındalık yaratmak için birçok etkinlik düzenledik. Bu yazıda, bu deneyimlerimi ve öğrendiklerimi paylaşmak istiyorum.

## Okul Kulübümüz

Okulumuzda, bir iklim kulübü kurduk ve her hafta iklim değişikliği hakkında bilgilendirici seminerler düzenliyoruz. Ayrıca, yerel parklarda ağaç dikme etkinlikleri organize ediyoruz.

## Yerel Yönetimlerle İşbirliği

Belediyemizle işbirliği yaparak, plastik kullanımını azaltmak için bir kampanya başlattık. Kampanyamız kapsamında, yerel işletmelere yeniden kullanılabilir malzemeler kullanmaları için teşvikler sunuldu.`,
    excerpt: 'Genç bir aktivist olarak iklim değişikliği konusunda şehrimizde farkındalık yaratmak için yaptığımız çalışmaları anlatıyorum.',
    category: 'activism',
    tags: 'iklim değişikliği, gençlik, aktivizm, farkındalık, okul kulübü',
    featuredImage: 'https://images.unsplash.com/photo-1557599443-2071a2df9c19',
    authorName: 'Ayşe Yılmaz',
    authorAge: 17,
    authorLocation: 'İstanbul',
    status: 'published',
    publishedAt: '2023-07-20T10:00:00Z',
    viewCount: 723,
    updatedAt: '2023-07-20T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Geri Dönüşüm Projemiz',
    slug: 'geri-donusum-projemiz',
    content: `# Geri Dönüşüm Projemiz

Mahallemizde atıkların ayrıştırılması ve geri dönüşümü konusunda bir proje başlattık. Bu projede, hem mahallemizi temiz tutmayı hem de sürdürülebilir bir yaşam tarzını teşvik etmeyi amaçlıyoruz.

## Proje Detayları

Projemiz kapsamında, her sokağa geri dönüşüm kutuları yerleştirdik ve mahalle sakinlerine atıkları nasıl ayrıştıracakları konusunda eğitimler verdik. Ayrıca, geri dönüşümden elde edilen geliri, mahallemizde ağaç dikimi ve çevre düzenlemesi için kullanıyoruz.

## Eğitim Çalışmaları

Mahallemizde yaşayan çocuklara ve gençlere, geri dönüşümün önemini anlatmak için interaktif atölyeler düzenliyoruz. Bu atölyelerde, geri dönüştürülebilir malzemelerden sanat eserleri yaparak hem eğlenceli hem de öğretici bir deneyim sunuyoruz.`,
    excerpt: 'Mahallemizde başlattığımız geri dönüşüm projesi ve bu projenin toplumumuza olan olumlu etkileri hakkında bilgi veriyorum.',
    category: 'projects',
    tags: 'geri dönüşüm, çevre, sürdürülebilirlik, proje, gençlik',
    featuredImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
    authorName: 'Mehmet Kaya',
    authorAge: 19,
    authorLocation: 'Ankara',
    status: 'published',
    publishedAt: '2023-06-15T14:30:00Z',
    viewCount: 456,
    updatedAt: '2023-06-15T14:30:00Z',
  },
  '3': {
    id: '3',
    title: 'İklim Kampımız',
    slug: 'iklim-kampimiz',
    content: `# İklim Kampımız

Bu yaz, arkadaşlarımla birlikte bir iklim kampı düzenledik. Kampımızın amacı, gençleri iklim değişikliği konusunda bilinçlendirmek ve onlara sürdürülebilir yaşam becerileri kazandırmaktı.

## Kamp Programı

Kampımızda, uzmanlar tarafından verilen seminerler, interaktif atölyeler ve doğa yürüyüşleri gibi etkinlikler düzenledik. Ayrıca, katılımcılar kendi ekolojik ayak izlerini hesaplamayı ve bunu nasıl azaltabileceklerini öğrendiler.

## Gelecek Planları

Kampımızın başarılı olması üzerine, gelecek yıl daha büyük bir kamp düzenlemeyi planlıyoruz. Ayrıca, kamp programımızı diğer şehirlerdeki gençlik gruplarıyla paylaşarak, benzer kampların farklı yerlerde düzenlenmesini teşvik etmeyi hedefliyoruz.`,
    excerpt: 'Arkadaşlarımla birlikte düzenlediğimiz iklim kampı hakkında bilgi veriyor ve bu kampın gençler üzerindeki olumlu etkilerini anlatıyorum.',
    category: 'events',
    tags: 'iklim kampı, eğitim, gençlik, sürdürülebilirlik, doğa',
    featuredImage: '',
    authorName: 'Zeynep Demir',
    authorAge: 20,
    authorLocation: 'İzmir',
    status: 'draft',
    publishedAt: undefined,
    viewCount: 0,
    updatedAt: '2023-08-10T16:45:00Z',
  }
};

// Youth Voice içeriklerini yönetmek için hook
export function useYouthVoices() {
  // Youth Voice içeriklerini localStorage'da sakla/getir
  const [youthVoices, setYouthVoices] = useState<Record<string, YouthVoice>>({});
  const [isLoading, setIsLoading] = useState(true);

  // İlk yükleme
  useEffect(() => {
    const loadYouthVoices = () => {
      setIsLoading(true);
      try {
        // localStorage'dan youth voices içeriklerini getir
        const savedVoices = localStorage.getItem('beyond2c_youth_voices');
        
        // Eğer kayıtlı veri yoksa, demo verileri kullan
        if (!savedVoices) {
          localStorage.setItem('beyond2c_youth_voices', JSON.stringify(initialYouthVoices));
          setYouthVoices(initialYouthVoices);
        } else {
          setYouthVoices(JSON.parse(savedVoices));
        }
      } catch (error) {
        console.error('Youth voices içerikleri yüklenirken hata oluştu:', error);
        // Hata durumunda demo verileri kullan
        setYouthVoices(initialYouthVoices);
      } finally {
        setIsLoading(false);
      }
    };

    loadYouthVoices();
  }, []);

  // Youth Voice içeriği ekleme
  const addYouthVoice = (youthVoice: Omit<YouthVoice, 'id' | 'updatedAt' | 'viewCount'>) => {
    // Yeni ID oluştur
    const newId = Date.now().toString();
    
    // Yeni youth voice içeriği
    const newYouthVoice: YouthVoice = {
      ...youthVoice,
      id: newId,
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    };
    
    // State güncelle
    const updatedVoices = {
      ...youthVoices,
      [newId]: newYouthVoice
    };
    
    setYouthVoices(updatedVoices);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_youth_voices', JSON.stringify(updatedVoices));
    
    return newId;
  };

  // Youth Voice içeriği güncelleme
  const updateYouthVoice = (id: string, youthVoice: Partial<YouthVoice>) => {
    // Youth Voice içeriği var mı kontrol et
    if (!youthVoices[id]) {
      throw new Error(`${id} ID'li youth voice içeriği bulunamadı`);
    }
    
    // Güncellenmiş youth voice içeriği
    const updatedYouthVoice: YouthVoice = {
      ...youthVoices[id],
      ...youthVoice,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedVoices = {
      ...youthVoices,
      [id]: updatedYouthVoice
    };
    
    setYouthVoices(updatedVoices);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_youth_voices', JSON.stringify(updatedVoices));
  };

  // Youth Voice içeriği silme
  const deleteYouthVoice = (id: string) => {
    // Youth Voice içeriği var mı kontrol et
    if (!youthVoices[id]) {
      throw new Error(`${id} ID'li youth voice içeriği bulunamadı`);
    }
    
    // State güncelle (ilgili ID'yi çıkar)
    const updatedVoices = { ...youthVoices };
    delete updatedVoices[id];
    
    setYouthVoices(updatedVoices);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_youth_voices', JSON.stringify(updatedVoices));
  };

  // Youth Voice içeriği getirme
  const getYouthVoice = (id: string) => {
    return youthVoices[id];
  };

  // Tüm youth voice içeriklerini liste olarak getirme
  const getAllYouthVoices = () => {
    return Object.values(youthVoices);
  };

  return {
    youthVoices,
    isLoading,
    addYouthVoice,
    updateYouthVoice,
    deleteYouthVoice,
    getYouthVoice,
    getAllYouthVoices
  };
}
