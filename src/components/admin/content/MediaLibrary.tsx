import React, { useState } from 'react';
import { Modal } from '@/components/admin/ui/Modal';

// Demo media items
const demoMediaItems = [
  {
    id: '1',
    title: 'İklim Değişikliği Protesto',
    filename: 'climate-protest.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1612345485523-e837c085b05f',
    size: '234 KB',
    dimensions: '1200 × 800',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-05-10T14:30:00Z',
  },
  {
    id: '2',
    title: 'Yenilenebilir Enerji',
    filename: 'renewable-energy.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d',
    size: '546 KB',
    dimensions: '2400 × 1600',
    uploadedBy: 'Editor User',
    uploadedAt: '2023-04-22T09:15:00Z',
  },
  {
    id: '3',
    title: 'Aktivist Portre',
    filename: 'activist-portrait.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
    size: '312 KB',
    dimensions: '1800 × 1200',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-06-05T11:45:00Z',
  },
  {
    id: '4',
    title: 'Beyond2C Logo',
    filename: '2Clogo.png',
    type: 'image',
    url: '/2Clogo.png',
    size: '48 KB',
    dimensions: '400 × 200',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-03-15T08:20:00Z',
  },
  {
    id: '5',
    title: 'İklim Raporu',
    filename: 'climate-report-2023.pdf',
    type: 'document',
    url: '#',
    size: '1.2 MB',
    dimensions: 'N/A',
    uploadedBy: 'Editor User',
    uploadedAt: '2023-05-28T16:10:00Z',
  },
  {
    id: '6',
    title: 'Deniz Seviyesi Yükselme Grafiği',
    filename: 'sea-level-rise.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581093458791-9a6195cb9ea7',
    size: '425 KB',
    dimensions: '2000 × 1333',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-05-18T13:25:00Z',
  },
  {
    id: '7',
    title: 'Sürdürülebilir Tarım',
    filename: 'sustainable-farming.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17',
    size: '567 KB',
    dimensions: '2200 × 1467',
    uploadedBy: 'Editor User',
    uploadedAt: '2023-04-12T10:05:00Z',
  },
  {
    id: '8',
    title: 'İklim Değişikliği Sunum',
    filename: 'climate-change-presentation.pptx',
    type: 'document',
    url: '#',
    size: '3.4 MB',
    dimensions: 'N/A',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-06-01T15:40:00Z',
  },
];

interface MediaLibraryProps {
  onSelect?: (media: any) => void;
  selectable?: boolean;
}

export function MediaLibrary({ onSelect, selectable = false }: MediaLibraryProps) {
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter media items
  const filteredMedia = demoMediaItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === null || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleSelect = (media: any) => {
    setSelectedMedia(media);
    if (onSelect) {
      onSelect(media);
    } else {
      setDetailsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log('Delete media item:', id);
    setDetailsModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Medya Kütüphanesi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Görsel ve dokümanlarınızı yönetin
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          Dosya Yükle
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Dosya ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Filtrele:</span>
          <select
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterType || ''}
            onChange={(e) => setFilterType(e.target.value || null)}
          >
            <option value="">Tümü</option>
            <option value="image">Görseller</option>
            <option value="document">Dokümanlar</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                selectedMedia?.id === media.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => handleSelect(media)}
            >
              {media.type === 'image' ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={media.url}
                    alt={media.title}
                    className="object-cover w-full h-32"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-100">
                  <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate" title={media.title}>
                  {media.title}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {media.filename}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Dosya bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun dosya bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Media Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Medya Detayları"
        size="lg"
      >
        {selectedMedia && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                {selectedMedia.type === 'image' ? (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="object-contain w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                    <svg className="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Başlık</label>
                    <input
                      type="text"
                      value={selectedMedia.title}
                      onChange={(e) => setSelectedMedia({ ...selectedMedia, title: e.target.value })}
                      className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosya Adı</label>
                      <p className="mt-1 text-sm text-gray-500">{selectedMedia.filename}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosya Boyutu</label>
                      <p className="mt-1 text-sm text-gray-500">{selectedMedia.size}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Boyutlar</label>
                      <p className="mt-1 text-sm text-gray-500">{selectedMedia.dimensions}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dosya Türü</label>
                      <p className="mt-1 text-sm text-gray-500">
                        {selectedMedia.type === 'image' ? 'Görsel' : 'Doküman'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={selectedMedia.url}
                        readOnly
                        className="flex-1 min-w-0 block w-full sm:text-sm border-gray-300 rounded-none rounded-l-md"
                      />
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(selectedMedia.url)}
                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                      >
                        Kopyala
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yükleyen</label>
                      <p className="mt-1 text-sm text-gray-500">{selectedMedia.uploadedBy}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yüklenme Tarihi</label>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(selectedMedia.uploadedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleDelete(selectedMedia.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sil
              </button>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log('Save media:', selectedMedia);
                  setDetailsModalOpen(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Kaydet
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Dosya Yükle"
        size="md"
      >
        <div className="space-y-6">
          <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              Dosyaları buraya sürükleyip bırakın ya da
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Dosya Seç
            </button>
            <p className="mt-2 text-xs text-gray-500">
              PNG, JPG, GIF, PDF, DOCX, XLSX, PPTX dosyaları desteklenir (max. 10MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Dosya başlığı"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={() => {
                console.log('Upload file');
                setUploadModalOpen(false);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Yükle
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
