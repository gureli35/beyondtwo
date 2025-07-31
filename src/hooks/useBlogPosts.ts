import { useState, useEffect } from 'react';

// Blog yazılarını temsil eden arayüz
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  author: string;
  viewCount: number;
  updatedAt: string;
}

// Demo blog post verileri
const initialBlogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'İklim Değişikliği ve Etkileri',
    slug: 'iklim-degisikligi-ve-etkileri',
    content: `# İklim Değişikliği ve Etkileri

İklim değişikliği, günümüzün en büyük çevresel, sosyal ve ekonomik tehdididir. Dünya genelinde artan sıcaklıklar, değişen yağış düzenleri, yükselen deniz seviyeleri ve daha sık ve şiddetli hava olayları, gezegenimizin ekolojik dengesini ve insan toplumlarını tehdit etmektedir.

## İklim Değişikliğinin Nedenleri

İklim değişikliğinin başlıca nedeni, insan faaliyetleri sonucu atmosfere salınan sera gazlarıdır. Bu gazlar arasında karbondioksit (CO2), metan (CH4) ve azot oksit (N2O) bulunur. Bu gazların ana kaynakları şunlardır:

- Fosil yakıtların yakılması (kömür, petrol, doğal gaz)
- Ormansızlaşma ve arazi kullanımındaki değişiklikler
- Endüstriyel süreçler
- Tarımsal faaliyetler
- Atık yönetimi

## İklim Değişikliğinin Etkileri

### Sıcaklık Artışı

Küresel ortalama sıcaklıklar, sanayi öncesi döneme göre yaklaşık 1°C artmıştır. Bu artış, dünyanın farklı bölgelerinde farklı şekillerde hissedilmektedir. Kutup bölgeleri, ekvatora göre çok daha hızlı ısınmaktadır.

### Deniz Seviyesi Yükselmesi

Buzulların erimesi ve okyanusların ısınmasıyla genleşmesi sonucu deniz seviyeleri yükselmektedir. Bu durum, kıyı şehirlerini ve alçak kıyı bölgelerini sel ve erozyona karşı savunmasız hale getirmektedir.`,
    excerpt: 'İklim değişikliği, günümüzün en büyük çevresel, sosyal ve ekonomik tehdididir. Bu yazıda, iklim değişikliğinin nedenleri, etkileri ve çözüm önerileri ele alınmaktadır.',
    category: 'iklim',
    tags: 'iklim değişikliği, küresel ısınma, çevre, sürdürülebilirlik',
    featuredImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce',
    status: 'published',
    publishedAt: '2023-06-15T10:00:00Z',
    author: 'Admin User',
    viewCount: 1245,
    updatedAt: '2023-06-15T10:00:00Z',
  },
  '2': {
    id: '2',
    title: 'Sürdürülebilir Enerji Kaynakları',
    slug: 'surdurulebilir-enerji-kaynaklari',
    content: `# Sürdürülebilir Enerji Kaynakları

Sürdürülebilir enerji kaynakları, dünya genelinde iklim değişikliğiyle mücadele ve temiz enerji geçişinde kilit rol oynamaktadır. Bu yazıda, farklı yenilenebilir enerji türlerini ve bunların avantajlarını inceleyeceğiz.

## Güneş Enerjisi

Güneş enerjisi, güneşten gelen ışınımın elektriğe dönüştürülmesi prensibiyle çalışır. Fotovoltaik paneller veya yoğunlaştırılmış güneş enerjisi sistemleri ile elektrik üretilir.

### Avantajları
- Sınırsız ve temiz bir enerji kaynağıdır
- Karbon emisyonu yoktur
- Bakım maliyetleri düşüktür
- Ev ve işyerlerine kurulabilir

## Rüzgar Enerjisi

Rüzgar enerjisi, rüzgarın kinetik enerjisinin türbinler aracılığıyla elektrik enerjisine dönüştürülmesi ile elde edilir.

### Avantajları
- Temiz ve yenilenebilir bir kaynaktır
- Arazi kullanımı esnektir (tarım arazileri ile birlikte kullanılabilir)
- Teknoloji geliştikçe maliyetler düşmektedir`,
    excerpt: 'Sürdürülebilir enerji kaynakları, fosil yakıtlara olan bağımlılığı azaltmak ve karbon emisyonlarını düşürmek için kritik öneme sahiptir. Bu yazıda farklı yenilenebilir enerji türlerini inceliyoruz.',
    category: 'enerji',
    tags: 'enerji, yenilenebilir, güneş, rüzgar, hidroelektrik',
    featuredImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    status: 'published',
    publishedAt: '2023-05-10T14:30:00Z',
    author: 'Editor User',
    viewCount: 890,
    updatedAt: '2023-05-12T09:15:00Z',
  },
  '3': {
    id: '3',
    title: 'Karbon Ayak İzini Azaltma Yöntemleri',
    slug: 'karbon-ayak-izini-azaltma-yontemleri',
    content: `# Karbon Ayak İzini Azaltma Yöntemleri

Karbon ayak izi, bir kişinin, kuruluşun veya ürünün doğrudan veya dolaylı olarak neden olduğu sera gazı emisyonlarının toplamıdır. Bu yazıda, günlük yaşamda karbon ayak izini azaltmanın pratik yollarını ele alacağız.

## Bireysel Düzeyde Alınabilecek Önlemler

### Ulaşım
- Toplu taşıma araçlarını tercih edin
- Bisiklet kullanın veya yürüyün
- Elektrikli araçlara geçiş yapın
- Gereksiz uçak seyahatlerinden kaçının

### Ev ve Enerji Kullanımı
- Enerji verimli ev aletleri kullanın
- Gereksiz enerji tüketiminden kaçının
- Evde yalıtımı iyileştirin
- Yenilenebilir enerji kaynaklarına geçiş yapın`,
    excerpt: 'Karbon ayak izinizi azaltarak iklim değişikliğiyle mücadeleye katkıda bulunabilirsiniz. Bu yazıda, günlük yaşamda uygulayabileceğiniz pratik yöntemleri paylaşıyoruz.',
    category: 'yasam',
    tags: 'karbon ayak izi, sürdürülebilirlik, yaşam tarzı, çevre',
    featuredImage: '',
    status: 'draft',
    publishedAt: undefined,
    author: 'Admin User',
    viewCount: 0,
    updatedAt: '2023-06-10T16:45:00Z',
  }
};

// Blog yazılarını yönetmek için hook
export function useBlogPosts() {
  // Blog yazılarını localStorage'da sakla/getir
  const [blogPosts, setBlogPosts] = useState<Record<string, BlogPost>>({});
  const [isLoading, setIsLoading] = useState(true);

  // İlk yükleme
  useEffect(() => {
    const loadBlogPosts = () => {
      setIsLoading(true);
      try {
        // localStorage'dan blog yazılarını getir
        const savedPosts = localStorage.getItem('beyond2c_blog_posts');
        
        // Eğer kayıtlı veri yoksa, demo verileri kullan
        if (!savedPosts) {
          localStorage.setItem('beyond2c_blog_posts', JSON.stringify(initialBlogPosts));
          setBlogPosts(initialBlogPosts);
        } else {
          setBlogPosts(JSON.parse(savedPosts));
        }
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata oluştu:', error);
        // Hata durumunda demo verileri kullan
        setBlogPosts(initialBlogPosts);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Blog yazısı ekleme
  const addBlogPost = (blogPost: Omit<BlogPost, 'id' | 'updatedAt' | 'viewCount' | 'author'>) => {
    // Yeni ID oluştur
    const newId = Date.now().toString();
    
    // Yeni blog yazısı
    const newBlogPost: BlogPost = {
      ...blogPost,
      id: newId,
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      author: 'Admin User', // Gerçek uygulamada oturum açan kullanıcı
    };
    
    // State güncelle
    const updatedPosts = {
      ...blogPosts,
      [newId]: newBlogPost
    };
    
    setBlogPosts(updatedPosts);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_blog_posts', JSON.stringify(updatedPosts));
    
    return newId;
  };

  // Blog yazısı güncelleme
  const updateBlogPost = (id: string, blogPost: Partial<BlogPost>) => {
    // Blog yazısı var mı kontrol et
    if (!blogPosts[id]) {
      throw new Error(`${id} ID'li blog yazısı bulunamadı`);
    }
    
    // Güncellenmiş blog yazısı
    const updatedBlogPost: BlogPost = {
      ...blogPosts[id],
      ...blogPost,
      updatedAt: new Date().toISOString(),
    };
    
    // State güncelle
    const updatedPosts = {
      ...blogPosts,
      [id]: updatedBlogPost
    };
    
    setBlogPosts(updatedPosts);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_blog_posts', JSON.stringify(updatedPosts));
  };

  // Blog yazısı silme
  const deleteBlogPost = (id: string) => {
    // Blog yazısı var mı kontrol et
    if (!blogPosts[id]) {
      throw new Error(`${id} ID'li blog yazısı bulunamadı`);
    }
    
    // State güncelle (ilgili ID'yi çıkar)
    const updatedPosts = { ...blogPosts };
    delete updatedPosts[id];
    
    setBlogPosts(updatedPosts);
    
    // localStorage'a kaydet
    localStorage.setItem('beyond2c_blog_posts', JSON.stringify(updatedPosts));
  };

  // Blog yazısı getirme
  const getBlogPost = (id: string) => {
    return blogPosts[id];
  };

  // Tüm blog yazılarını liste olarak getirme
  const getAllBlogPosts = () => {
    return Object.values(blogPosts);
  };

  return {
    blogPosts,
    isLoading,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPost,
    getAllBlogPosts
  };
}
