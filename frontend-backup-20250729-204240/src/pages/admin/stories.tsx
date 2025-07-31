import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useLanguage } from '@/context/LanguageContext';

interface UserStory {
  id: string;
  title: string;
  content: string;
  author: string;
  email: string;
  age: number;
  location: string;
  category: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  tags: string[];
}

const StoriesManagement: React.FC = () => {
  const { t } = useLanguage();
  const [stories, setStories] = useState<UserStory[]>([
    {
      id: '1',
      title: 'Okul Projemizle Enerji Tasarrufu Sağladık',
      content: 'Lisede arkadaşlarımla birlikte okulumuzda enerji tasarrufu projesi başlattık. Öğretmenlerimizin desteğiyle tüm sınıflarda LED ampul kullanımına geçtik ve hareket sensörlü ışık sistemleri kurduk. 6 ayda %30 enerji tasarrufu sağladık ve bu para ile okul bahçesine ağaç diktik.',
      author: 'Zeynep Kaya',
      email: 'zeynep@email.com',
      age: 17,
      location: 'İstanbul',
      category: 'Okul Projesi',
      submitDate: '2024-06-09',
      status: 'pending',
      featured: false,
      tags: ['enerji', 'tasarruf', 'okul', 'genç']
    },
    {
      id: '2',
      title: 'Mahallede Geri Dönüşüm Kampanyası',
      content: 'Ailemle birlikte mahallemizde geri dönüşüm bilinci oluşturmak için kampanya düzenledik. Kapı kapı dolaşarak komşularımızı bilgilendirdik ve geri dönüşüm kutularının doğru kullanımını anlattık. Şimdi mahallemizde geri dönüşüm oranı %80 arttı.',
      author: 'Mehmet Demir',
      email: 'mehmet@email.com',
      age: 19,
      location: 'Ankara',
      category: 'Toplum Projesi',
      submitDate: '2024-06-08',
      status: 'approved',
      featured: true,
      tags: ['geri dönüşüm', 'toplum', 'mahalle']
    },
    {
      id: '3',
      title: 'Plastik Kullanımını Azaltma Deneyimim',
      content: 'Bir yıl boyunca plastik kullanımımı minimize etmeye çalıştım. Cam şişeler, bez çantalar kullandım ve ambalajsız ürünler tercih ettim. Bu süreçte çok şey öğrendim ve ailem de bu konuda daha bilinçli olmaya başladı.',
      author: 'Ayşe Yılmaz',
      email: 'ayse@email.com',
      age: 16,
      location: 'İzmir',
      category: 'Kişisel Deneyim',
      submitDate: '2024-06-07',
      status: 'approved',
      featured: false,
      tags: ['plastik', 'sıfır atık', 'sürdürülebilirlik']
    },
    {
      id: '4',
      title: 'İklim Grevine Katılım Deneyimim',
      content: 'Geçen hafta şehrimizdeki iklim grevine katıldım. Binlerce genç bir araya gelip iklim adaleti için sesimizi yükselttik. Bu deneyim bana kolektif hareketin gücünü gösterdi.',
      author: 'Can Özkan',
      email: 'can@email.com',
      age: 18,
      location: 'Bursa',
      category: 'Aktivizm',
      submitDate: '2024-06-06',
      status: 'rejected',
      featured: false,
      tags: ['aktivizm', 'grev', 'toplumsal hareket']
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    featured: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Okul Projesi',
    'Toplum Projesi', 
    'Kişisel Deneyim',
    'Aktivizm',
    'Teknoloji',
    'Yaşam Tarzı'
  ];

  const filteredStories = stories.filter(story => {
    const matchesStatus = filter.status === 'all' || story.status === filter.status;
    const matchesCategory = filter.category === 'all' || story.category === filter.category;
    const matchesFeatured = filter.featured === 'all' || 
      (filter.featured === 'featured' && story.featured) ||
      (filter.featured === 'not-featured' && !story.featured);
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesFeatured && matchesSearch;
  });

  const handleApprove = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, status: 'approved' } : story
    ));
  };

  const handleReject = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, status: 'rejected' } : story
    ));
  };

  const toggleFeatured = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, featured: !story.featured } : story
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'pending': return 'Beklemede';
      default: return status;
    }
  };

  return (
    <AdminLayout title="Kullanıcı Hikayeleri Yönetimi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Hikayeleri</h1>
            <p className="text-gray-600">{filteredStories.length} hikaye bulundu</p>
          </div>
          <div className="flex gap-2">
            <span className="admin-badge warning">
              {stories.filter(s => s.status === 'pending').length} Beklemede
            </span>
            <span className="admin-badge success">
              {stories.filter(s => s.status === 'approved').length} Onaylandı
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
          
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Hikaye başlığı, yazar veya içerik ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-form-input w-full max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="admin-form-label">Durum</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({...filter, status: e.target.value})}
                className="admin-form-select"
              >
                <option value="all">Tümü</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylandı</option>
                <option value="rejected">Reddedildi</option>
              </select>
            </div>

            <div>
              <label className="admin-form-label">Kategori</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value})}
                className="admin-form-select"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-form-label">Öne Çıkan</label>
              <select
                value={filter.featured}
                onChange={(e) => setFilter({...filter, featured: e.target.value})}
                className="admin-form-select"
              >
                <option value="all">Tümü</option>
                <option value="featured">Öne Çıkan</option>
                <option value="not-featured">Normal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stories List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredStories.map(story => (
              <div 
                key={story.id}
                className={`admin-card cursor-pointer transition-all hover:shadow-lg ${
                  selectedStory?.id === story.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedStory(story)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 flex-1">{story.title}</h3>
                  <div className="flex items-center space-x-2 ml-4">
                    {story.featured && (
                      <span className="text-yellow-500" title="Öne çıkan">⭐</span>
                    )}
                    <span className={`admin-badge ${getStatusColor(story.status)}`}>
                      {getStatusText(story.status)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {story.content}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{story.author}</span>
                    <span>{story.location}</span>
                    <span>{story.age} yaş</span>
                  </div>
                  <span>{new Date(story.submitDate).toLocaleDateString('tr-TR')}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {story.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {filteredStories.length === 0 && (
              <div className="admin-card text-center py-8">
                <p className="text-gray-500">Hiç hikaye bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Story Detail */}
          <div className="space-y-6">
            {selectedStory ? (
              <div className="admin-card">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  {selectedStory.title}
                  {selectedStory.featured && <span className="ml-2 text-yellow-500">⭐</span>}
                </h3>
                
                <div className="space-y-3 text-sm mb-4">
                  <div><span className="font-medium">Yazar:</span> {selectedStory.author}</div>
                  <div><span className="font-medium">E-posta:</span> {selectedStory.email}</div>
                  <div><span className="font-medium">Yaş:</span> {selectedStory.age}</div>
                  <div><span className="font-medium">Konum:</span> {selectedStory.location}</div>
                  <div><span className="font-medium">Kategori:</span> {selectedStory.category}</div>
                  <div><span className="font-medium">Tarih:</span> {new Date(selectedStory.submitDate).toLocaleDateString('tr-TR')}</div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Hikaye İçeriği:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedStory.content}
                  </p>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Etiketler:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedStory.tags.map(tag => (
                      <span key={tag} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-6 space-y-3">
                  {selectedStory.status === 'pending' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApprove(selectedStory.id)}
                        className="admin-btn-success flex-1"
                      >
                        ✅ Onayla
                      </button>
                      <button 
                        onClick={() => handleReject(selectedStory.id)}
                        className="admin-btn-danger flex-1"
                      >
                        ❌ Reddet
                      </button>
                    </div>
                  )}
                  
                  {selectedStory.status === 'approved' && (
                    <button
                      onClick={() => toggleFeatured(selectedStory.id)}
                      className={`w-full ${selectedStory.featured ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                    >
                      {selectedStory.featured ? '⭐ Öne Çıkarmayı Kaldır' : '⭐ Öne Çıkar'}
                    </button>
                  )}

                  {selectedStory.status === 'rejected' && (
                    <button 
                      onClick={() => handleApprove(selectedStory.id)}
                      className="admin-btn-success w-full"
                    >
                      ✅ Tekrar Onayla
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="admin-card text-center py-8">
                <p className="text-gray-500">Detayları görmek için bir hikaye seçin</p>
              </div>
            )}

            {/* İstatistikler */}
            <div className="admin-card">
              <h3 className="font-semibold text-lg mb-4">İstatistikler</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Hikaye:</span>
                  <span className="font-medium">{stories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bekleyen:</span>
                  <span className="font-medium text-yellow-600">{stories.filter(s => s.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Onaylanan:</span>
                  <span className="font-medium text-green-600">{stories.filter(s => s.status === 'approved').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Öne Çıkan:</span>
                  <span className="font-medium text-blue-600">{stories.filter(s => s.featured).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StoriesManagement;
