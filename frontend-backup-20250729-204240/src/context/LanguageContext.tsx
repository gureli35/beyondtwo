import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create context with default values for null safety
const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translation dictionary
const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': {
    tr: 'Ana Sayfa',
    en: 'Home',
  },
  'nav.about': {
    tr: 'Hakkında',
    en: 'About',
  },
  'nav.issues': {
    tr: 'Sorunlar',
    en: 'Issues',
  },
  'nav.impactMap': {
    tr: 'Etki Haritası',
    en: 'Impact Map',
  },
  'nav.voices': {
    tr: 'Sesler',
    en: 'VOICES',
  },
  'nav.dataHub': {
    tr: 'Veri Merkezi',
    en: 'Data Hub',
  },
  'nav.blog': {
    tr: 'Blog',
    en: 'Blog',
  },
  'nav.resources': {
    tr: 'Kaynaklar',
    en: 'Resources',
  },
  'nav.contact': {
    tr: 'İletişim',
    en: 'Contact',
  },
  'nav.takeAction': {
    tr: 'Harekete Geç',
    en: 'Take Action',
  },
  'nav.events': {
    tr: 'Etkinlikler',
    en: 'Events',
  },
  'nav.faq': {
    tr: 'SSS',
    en: 'FAQ',
  },
  'nav.privacy': {
    tr: 'Gizlilik',
    en: 'Privacy',
  },
  
  // Common
  'common.readMore': {
    tr: 'DEVAMINI OKU',
    en: 'READ MORE',
  },
  'common.allRightsReserved': {
    tr: 'Tüm hakları saklıdır',
    en: 'All rights reserved',
  },
  'common.joinUs': {
    tr: 'Sen de katıl!',
    en: 'Join us!',
  },
  'common.getStarted': {
    tr: 'Başla',
    en: 'GET STARTED',
  },
  'common.moreInfo': {
    tr: 'Daha Fazla Bilgi',
    en: 'MORE INFORMATION',
  },
  'common.search': {
    tr: 'ARA',
    en: 'SEARCH',
  },
  'common.category': {
    tr: 'Kategori',
    en: 'Category',
  },
  'common.type': {
    tr: 'Tür',
    en: 'Type',
  },
  'common.pdf': {
    tr: 'PDF Doküman',
    en: 'PDF Document',
  },
  'common.video': {
    tr: 'Video',
    en: 'Video',
  },
  'common.article': {
    tr: 'Makale',
    en: 'Article',
  },
  'common.tool': {
    tr: 'İnteraktif Araç',
    en: 'INTERACTIVE TOOL',
  },
  'common.dataset': {
    tr: 'Veri Seti',
    en: 'Dataset',
  },
  'common.exploreMap': {
    tr: 'Haritayı Keşfet',
    en: 'EXPLORE THE MAP',
  },
  
  // Hero section
  'hero.criticalThreshold': {
    tr: 'KRİTİK EŞIK: 2°C',
    en: 'CRITICAL THRESHOLD: 2°C',
  },
  'hero.tomorrowTooLate': {
    tr: 'YARIN ÇOK GEÇ OLABİLİR!',
    en: 'TOMORROW MAY BE TOO LATE!',
  },
  'hero.description': {
    tr: 'İklim krizi için harekete geçmenin zamanı geldi. 2°C\'lik kritik eşiği aşmadan önce, gezegenimizin geleceğini korumak için birlikte çalışalım.',
    en: 'It\'s time to act on the climate crisis. Before we surpass the critical 2°C threshold, let\'s work together to protect the future of our planet.',
  },
  'hero.criticalThresholdLabel': {
    tr: 'Kritik Eşik',
    en: 'CRITICAL THRESHOLD',
  },
  'hero.yearsLeft': {
    tr: 'Yıl Kaldı',
    en: 'YEARS LEFT',
  },
  'hero.generation': {
    tr: 'Kuşağı',
    en: 'GENERATION',
  },
  
  // Call to Action
  'cta.timeToAct': {
    tr: 'Harekete Geçmenin Zamanı',
    en: 'TIME TO ACT',
  },
  'cta.description': {
    tr: '2°C eşiğini aşmadan önce iklim krizi ile mücadelede sen de yer al. Birlikte daha güçlüyüz!',
    en: 'Join the fight against climate crisis before we cross the 2°C threshold. Together we are stronger!',
  },
  'cta.volunteer': {
    tr: 'Gönüllü Ol',
    en: 'VOLUNTEER',
  },
  'cta.volunteerDesc': {
    tr: 'Yerel projelerde yer al, fark yarat',
    en: 'Participate in local projects, make a difference',
  },
  'cta.share': {
    tr: 'Paylaş',
    en: 'SHARE',
  },
  'cta.shareDesc': {
    tr: 'Hikayeni anlat, başkalarına ilham ver',
    en: 'Tell your story, inspire others',
  },
  'cta.influence': {
    tr: 'Etkileyici Ol',
    en: 'BE INFLUENTIAL',
  },
  'cta.influenceDesc': {
    tr: 'Yerel yönetimlerle bağlantı kur',
    en: 'Connect with local governments',
  },
  'cta.peopleJoined': {
    tr: 'kişi zaten harekete geçti',
    en: 'people have already taken action',
  },
  
  // Language Switcher
  'language.tr': {
    tr: 'Türkçe',
    en: 'Turkish',
  },
  'language.en': {
    tr: 'İngilizce',
    en: 'English',
  },
  'language.switch': {
    tr: 'Dil Değiştir',
    en: 'Change Language',
  },
  
  // FeaturedStories
  'featuredStories.title': {
    tr: 'Sesler & Hikayeler',
    en: 'Voices & Stories',
  },
  'featuredStories.description': {
    tr: 'Türkiye\'nin dört bir yanından gelen gerçek hikayeleri iklim değişikliği ile mücadelede öncü olan gençlerin kaleminden okuyun.',
    en: 'Read real stories from all over Turkey written by young people who are leading the fight against climate change.',
  },
  'featuredStories.viewAll': {
    tr: 'Tüm Hikayeleri Gör',
    en: 'View All Stories',
  },
  'featuredStories.shareYourStory': {
    tr: 'Kendi hikayeni paylaş →',
    en: 'Share your own story →',
  },
  
  // BlogPosts
  'blogPosts.title': {
    tr: 'Blog & Güncel İçerik',
    en: 'Blog & Latest Content',
  },
  'blogPosts.description': {
    tr: 'İklim bilimi, eylem planları ve gençler tarafından yazılan güncel makalelerle bilgini derinleştir.',
    en: 'Deepen your knowledge with current articles on climate science, action plans, and writings by youth.',
  },
  'blogPosts.readAll': {
    tr: 'Tüm Yazıları Oku',
    en: 'Read All Articles',
  },
  'blogPosts.writeArticle': {
    tr: 'Makale yazmak ister misin? →',
    en: 'Would you like to write an article? →',
  },
  
  // Blog
  'blog.latestDevelopments': {
    tr: 'Son Gelişmeler',
    en: 'Latest Developments',
  },
  'blog.description': {
    tr: 'İklim değişikliği konusunda son bilimsel gelişmeler, politika değişiklikleri ve topluluk eylemleri hakkında güncel bilgiler.',
    en: 'Up-to-date information on the latest scientific developments, policy changes, and community actions on climate change.',
  },
  'blog.featuredPosts': {
    tr: 'Öne Çıkan Yazılar',
    en: 'Featured Posts',
  },
  'blog.allPosts': {
    tr: 'Tüm Yazılar',
    en: 'All Posts',
  },
  'blog.searchPlaceholder': {
    tr: 'Yazı veya konu ara...',
    en: 'Search for posts or topics...',
  },
  'blog.newsletterTitle': {
    tr: 'Bültenimize Abone Olun',
    en: 'Subscribe to Our Newsletter',
  },
  'blog.newsletterDesc': {
    tr: 'İklim kriziyle ilgili en son gelişmeleri ve etkinlikleri almak için bültenimize kayıt olun.',
    en: 'Sign up for our newsletter to receive the latest developments and events related to the climate crisis.',
  },
  'blog.privacyNotice': {
    tr: 'Gizlilik politikamızı kabul ediyorsunuz.',
    en: 'You accept our privacy policy.',
  },
  'blog.suggestPost': {
    tr: 'Bir konu öner',
    en: 'Suggest a topic',
  },
  
  // Blog categories
  'blog.categories.science': {
    tr: 'Bilim',
    en: 'Science',
  },
  'blog.categories.lifestyle': {
    tr: 'Yaşam',
    en: 'Lifestyle',
  },
  'blog.categories.technology': {
    tr: 'Teknoloji',
    en: 'Technology',
  },
  'blog.categories.politics': {
    tr: 'Politika',
    en: 'Politics',
  },
  'blog.categories.activism': {
    tr: 'Aktivizm',
    en: 'Activism',
  },
  'blog.categories.sustainability': {
    tr: 'SÜRDÜRÜLEBİLİRLİK',
    en: 'SUSTAINABILITY',
  },
  'blog.categories.climateChange': {
    tr: 'İKLİM DEĞİŞİKLİĞİ',
    en: 'CLIMATE CHANGE',
  },
  'blog.categories.climate': {
    tr: 'CLİMATE',
    en: 'CLIMATE',
  },
  'blog.categories.environmentalProtection': {
    tr: 'ÇEVRE KORUMA',
    en: 'ENVIRONMENTAL PROTECTION',
  },
  'blog.categories.all': {
    tr: 'ALL',
    en: 'All',
  },
  
  // DataSnapshot
  'dataSnapshot.title': {
    tr: 'İklim Krizi',
    en: 'Climate Crisis',
  },
  'dataSnapshot.titleHighlight': {
    tr: 'Şu Anda',
    en: 'Now',
  },
  'dataSnapshot.description': {
    tr: 'Gerçek ve güncel verilerle iklim krizinin ne boyutta birlikte bakalım',
    en: 'Let\'s look at the scale of the climate crisis with real and up-to-date data',
  },
  'dataSnapshot.globalTemperature': {
    tr: 'Küresel Sıcaklık Artışı',
    en: 'Global Temperature Rise',
  },
  'dataSnapshot.comparedTo': {
    tr: '1850-1900 ortalamasına göre',
    en: 'Compared to 1850-1900 average',
  },
  'dataSnapshot.annualCO2': {
    tr: 'Yıllık CO₂ Emisyonu',
    en: 'Annual CO₂ Emissions',
  },
  'dataSnapshot.globalTotal': {
    tr: '2023 küresel toplam',
    en: '2023 global total',
  },
  'dataSnapshot.timeRemaining': {
    tr: '2°C İçin Kalan Süre',
    en: 'Time Remaining for 2°C',
  },
  'dataSnapshot.atCurrentRate': {
    tr: 'Mevcut emisyon hızında',
    en: 'At current emission rate',
  },
  'dataSnapshot.communityActions': {
    tr: 'Topluluk Eylemleri',
    en: 'Community Actions',
  },
  'dataSnapshot.registeredOnPlatform': {
    tr: 'Platformumuzda kayıtlı',
    en: 'Registered on our platform',
  },
  'dataSnapshot.emergency': {
    tr: '🚨 Acil Durum',
    en: '🚨 Emergency',
  },
  'dataSnapshot.parisAgreement': {
    tr: 'Paris Anlaşması\'nın 2°C hedefini aşmamak için emisyonları %45 azaltmamız gerekiyor.',
    en: 'We need to reduce emissions by 45% to avoid exceeding the Paris Agreement\'s 2°C target.',
  },
  'dataSnapshot.exploreData': {
    tr: 'Detaylı verileri incele →',
    en: 'Explore detailed data →',
  },
  
  // Partners
  'partners.title': {
    tr: 'Ortaklarımız',
    en: 'Our Partners',
  },
  'partners.description': {
    tr: 'İklim değişikliği ile mücadelede güçlerimizi birleştirdiğimiz organizasyonlar ve kurumlar.',
    en: 'Organizations and institutions with whom we join forces in the fight against climate change.',
  },
  'partners.becomePartner': {
    tr: '🤝 Ortaklık Yapmak İster misiniz?',
    en: '🤝 Would You Like to Partner With Us?',
  },
  'partners.partnershipDescription': {
    tr: 'İklim değişikliği ile mücadelede bizimle güçlerinizi birleştirmek için iletişime geçin. Birlikte daha fazla etkiye sahip olalım.',
    en: 'Get in touch to join forces with us in the fight against climate change. Together we can have a greater impact.',
  },
  'partners.contactUs': {
    tr: 'İletişime Geç',
    en: 'Contact Us',
  },
  'partners.partnershipInfo': {
    tr: 'Ortaklık Bilgileri',
    en: 'Partnership Information',
  },
  
  // Common additional
  'common.contactUs': {
    tr: 'İletişime Geç',
    en: 'Contact Us',
  },
  'common.learnMore': {
    tr: 'Daha Fazla Bilgi',
    en: 'Learn More',
  },
  'common.submit': {
    tr: 'Gönder',
    en: 'Submit',
  },
  'common.viewAll': {
    tr: 'Tümünü Gör',
    en: 'VIEW ALL',
  },
  'common.all': {
    tr: 'Tümü',
    en: 'All',
  },
  'common.email': {
    tr: 'E-posta',
    en: 'Email',
  },
  'common.subscribe': {
    tr: 'Abone Ol',
    en: 'Subscribe',
  },
  'footer.platform': {
    tr: 'Platform',
    en: 'Platform',
  },
  'footer.community': {
    tr: 'Topluluk',
    en: 'Community',
  },
  'footer.resources': {
    tr: 'Kaynaklar',
    en: 'Resources',
  },
  'footer.description': {
    tr: 'İklim krizi için harekete geçmek — çok geç olmadan önce. Z kuşağını yerel yönetimlerle buluşturan platform.',
    en: 'Take action for the climate crisis — before it is too late. A platform connecting Generation Z with local governments.',
  },
  'footer.builtBy': {
    tr: 'İklim nesli tarafından ve için inşa edildi.',
    en: 'Built by and for the climate generation.',
  },
  'socialMedia.title': {
    tr: 'Sosyal Medya',
    en: 'Social Media',
  },
  'socialMedia.description': {
    tr: 'Sosyal medya hesaplarımızı takip ederek en güncel iklim haberleri, etkinlikler ve kampanyalardan haberdar olabilirsiniz.',
    en: 'Follow our social media accounts to stay updated on the latest climate news, events, and campaigns.',
  },
  
  // Voices page
  'voices.title': {
    tr: 'Sesler',
    en: 'Voices',
  },
  'voices.description': {
    tr: 'Türkiye genelinden gelen gerçek iklim hikayelerini keşfedin. Gençlerin çevre mücadelesindeki deneyimlerini okuyun.',
    en: 'Discover real climate stories from all over Turkey. Read about young people\'s experiences in environmental activism.',
  },
  'voices.bannerText': {
    tr: '2°C SINIRI AŞILMADAN',
    en: 'BEFORE THE 2°C THRESHOLD',
  },
  'voices.heroTitle': {
    tr: 'GENÇLERİN SESİ',
    en: 'YOUTH VOICES',
  },
  'voices.heroSubtitle': {
    tr: 'İKLİM MÜCADELESİNDE ÖN SAFTA',
    en: 'AT THE FOREFRONT OF CLIMATE ACTION',
  },
  'voices.heroDescription': {
    tr: 'GERÇEK hikayeler ve deneyimler ile iklim mücadelesine GÜÇ katıyoruz. Sesini duyur, değişimi hızlandır.',
    en: 'We empower the climate movement with REAL stories and experiences. Make your voice heard, accelerate change.',
  },
  'voices.featuredStories': {
    tr: 'ÖNE ÇIKAN HİKAYELER',
    en: 'FEATURED STORIES',
  },
  'voices.allStories': {
    tr: 'TÜM HİKAYELER',
    en: 'ALL STORIES',
  },
  'voices.shareStoryTitle': {
    tr: 'SEN DE HİKAYENİ PAYLAŞ',
    en: 'SHARE YOUR STORY TOO',
  },
  'voices.shareStoryDescription': {
    tr: 'İklim değişikliği ile mücadelendeki deneyimlerini bizimle paylaş. HİKAYENE BAŞKALARINI İLHAM VEREBİLİR.',
    en: 'Share your experiences in the fight against climate change. YOUR STORY CAN INSPIRE OTHERS.',
  },
  'voices.loadMoreStories': {
    tr: 'DAHA FAZLA HİKAYE YÜKLE',
    en: 'LOAD MORE STORIES',
  },
  'voices.exploreAllStories': {
    tr: 'TÜM HİKAYELERİ KEŞFET',
    en: 'EXPLORE ALL STORIES',
  },
  'voices.submitStory': {
    tr: 'HİKAYE GÖNDER',
    en: 'SUBMIT STORY',
  },
  'voices.readStory': {
    tr: 'HİKAYEYİ OKU',
    en: 'READ STORY',
  },
  'voices.allCategory': {
    tr: 'Tümü',
    en: 'All',
  },
  'voices.categoryYouth': {
    tr: 'Gençlik',
    en: 'Youth',
  },
  'voices.categoryEnergy': {
    tr: 'Enerji',
    en: 'Energy',
  },
  'voices.categoryTransportation': {
    tr: 'Ulaşım',
    en: 'Transportation',
  },
  'voices.categoryEducation': {
    tr: 'Eğitim',
    en: 'Education',
  },
  'voices.categoryTechnology': {
    tr: 'Teknoloji',
    en: 'Technology',
  },
  'voices.categoryMunicipality': {
    tr: 'Belediye',
    en: 'Municipality',
  },
  'voices.categoryRural': {
    tr: 'Kırsal',
    en: 'Rural',
  },
  'voices.categorySolar': {
    tr: 'Güneş',
    en: 'Solar',
  },
  'voices.categorySchool': {
    tr: 'Okul',
    en: 'School',
  },
  'voices.categoryOrganic': {
    tr: 'Organik',
    en: 'Organic',
  },
  'voices.categoryAwareness': {
    tr: 'Farkındalık',
    en: 'Awareness',
  },
  'voices.story1Title': {
    tr: 'İstanbul\'da Genç İklim Aktivistleri',
    en: 'Young Climate Activists in Istanbul',
  },
  'voices.story1Excerpt': {
    tr: 'Beyoğlu\'nda bir grup üniversite öğrencisi, yerel belediye ile işbirliği yaparak çevre dostu ulaşım projesi başlattı.',
    en: 'A group of university students in Beyoglu started an eco-friendly transportation project in collaboration with the local municipality.',
  },
  'voices.story2Title': {
    tr: 'Köyde Güneş Enerjisi Devrimi',
    en: 'Solar Energy Revolution in the Village',
  },
  'voices.story2Excerpt': {
    tr: 'Anadolu\'nun küçük bir köyünde başlayan güneş enerjisi projesi, tüm bölgeye ilham veriyor.',
    en: 'A solar energy project started in a small Anatolian village is inspiring the whole region.',
  },
  'voices.story3Title': {
    tr: 'Okul Bahçesinden Küresel Değişim',
    en: 'Global Change from a School Garden',
  },
  'voices.story3Excerpt': {
    tr: 'Lise öğrencileri kurdukları organik bahçe ile hem beslenme alışkanlıklarını değiştirdi hem de farkındalık yarattı.',
    en: 'High school students changed their eating habits and raised awareness with the organic garden they created.',
  },
  'voices.locationTurkey': {
    tr: 'Türkiye',
    en: 'Turkey',
  },
  
  // Data Hub page
  'dataHub.title': {
    tr: 'Veri Merkezi - Beyond2C',
    en: 'Data Hub - Beyond2C',
  },
  'dataHub.description': {
    tr: 'Güncel iklim verileri ve istatistikleri',
    en: 'Current climate data and statistics',
  },
  'dataHub.bannerText': {
    tr: 'VERİLERLE İKLİM KRİZİ',
    en: 'CLIMATE CRISIS WITH DATA',
  },
  'dataHub.heroTitle': {
    tr: 'GERÇEKLER KONUŞUYOR',
    en: 'FACTS ARE SPEAKING',
  },
  'dataHub.heroDescription': {
    tr: 'Bilimsel veriler gösteriyor: HAREKET ETMEK İÇİN SON ŞANSIMIZ!',
    en: 'Scientific data shows: OUR LAST CHANCE TO ACT!',
  },
  'dataHub.lastUpdate': {
    tr: 'Son güncelleme',
    en: 'Last update',
  },
  'dataHub.all': {
    tr: 'Tümü',
    en: 'All',
  },
  'dataHub.temperatureData': {
    tr: 'Sıcaklık Verileri',
    en: 'Temperature Data',
  },
  'dataHub.emissionData': {
    tr: 'Emisyon Verileri',
    en: 'Emission Data',
  },
  'dataHub.energyData': {
    tr: 'Enerji Verileri',
    en: 'Energy Data',
  },
  'dataHub.oceanData': {
    tr: 'Okyanus Verileri',
    en: 'Ocean Data',
  },
  'dataHub.globalTemperature': {
    tr: 'Küresel Ortalama Sıcaklık',
    en: 'Global Average Temperature',
  },
  'dataHub.co2Levels': {
    tr: 'Atmosferik CO₂ Seviyeleri',
    en: 'Atmospheric CO₂ Levels',
  },
  'dataHub.renewableEnergy': {
    tr: 'Yenilenebilir Enerji Payı',
    en: 'Renewable Energy Share',
  },
  'dataHub.seaLevelRise': {
    tr: 'Deniz Seviyesi Yükselişi',
    en: 'Sea Level Rise',
  },
  'dataHub.arcticSeaIce': {
    tr: 'Arktik Deniz Buzları',
    en: 'Arctic Sea Ice',
  },
  'dataHub.carbonBudget': {
    tr: 'Kalan Karbon Bütçesi',
    en: 'Remaining Carbon Budget',
  },
  'dataHub.importantFindings': {
    tr: 'Önemli Bulgular',
    en: 'Important Findings',
  },
  'dataHub.criticalThreshold': {
    tr: 'Kritik Eşik',
    en: 'CRITICAL THRESHOLD',
  },
  'dataHub.positiveDevelopment': {
    tr: 'Olumlu Gelişme',
    en: 'Positive Development',
  },
  'dataHub.source': {
    tr: 'Kaynak',
    en: 'Source',
  },
  'dataHub.millionKm2': {
    tr: 'milyon km²',
    en: 'million km²',
  },
  'dataHub.decade': {
    tr: 'dekad',
    en: 'decade',
  },
  'dataHub.year': {
    tr: 'yıl',
    en: 'year',
  },
  'dataHub.globalTemperatureRise': {
    tr: 'Küresel sıcaklık artışı',
    en: 'Global temperature rise',
  },
  'dataHub.noDataFound': {
    tr: 'Aradığınız kriterlere uygun veri bulunamadı.',
    en: 'No data found matching your criteria.',
  },
  'dataHub.searchPlaceholder': {
    tr: 'Veri ara...',
    en: 'Search data...',
  },
  'dataHub.current': {
    tr: 'Mevcut',
    en: 'Current',
  },
  'dataHub.target': {
    tr: 'Hedef',
    en: 'Target',
  },
  'dataHub.temperatureReached': {
    tr: 'ulaştı',
    en: 'reached',
  },
  'dataHub.temperatureOnly': {
    tr: 'eşiğine sadece',
    en: 'only',
  },
  'dataHub.temperatureLeft': {
    tr: 'kaldı',
    en: 'left to',
  },
  'dataHub.renewableEnergyReached': {
    tr: 'ulaştı ve her yıl',
    en: 'reached and',
  },
  'dataHub.renewableEnergyIncreasing': {
    tr: 'artış gösteriyor',
    en: 'increasing annually',
  },
  'dataHub.takeAction': {
    tr: 'Harekete Geç',
    en: 'Take Action',
  },
  'dataHub.exploreIssues': {
    tr: 'Sorunları Keşfet',
    en: 'Explore Issues',
  },
  'dataHub.dataSpeaks': {
    tr: 'Veriler Konuşuyor',
    en: 'Data Speaks',
  },
  'dataHub.dataDescription': {
    tr: 'Bilimsel veriler iklim krizinin gerçekliğini gösteriyor. Harekete geçmek için daha fazla beklemeyelim!',
    en: 'Scientific data shows the reality of the climate crisis. Let\'s not wait any longer to take action!',
  },
  
  // Resources page
  'resources.title': {
    tr: 'Kaynaklar - Beyond2C',
    en: 'Resources - Beyond2C',
  },
  'resources.description': {
    tr: 'İklim değişikliği ve sürdürülebilirlik konusunda kapsamlı kaynaklar, araçlar, rehberler ve veri setleri.',
    en: 'Comprehensive resources, tools, guides, and datasets on climate change and sustainability.',
  },
  'resources.bannerText': {
    tr: 'BİLGİ GÜÇ DEMEKTİR',
    en: 'KNOWLEDGE IS POWER',
  },
  'resources.heroTitle': {
    tr: 'İKLİM KAYNAKLARI',
    en: 'CLIMATE RESOURCES',
  },
  'resources.heroSubtitle': {
    tr: 'ETKİLİ EYLEM İÇİN GÜÇLÜ BİLGİ',
    en: 'STRONG KNOWLEDGE FOR EFFECTIVE ACTION',
  },
  'resources.heroDescription': {
    tr: 'İklim kriziyle mücadele için ihtiyacınız olan tüm araçlar, rehberler, veri setleri ve eğitim kaynakları. BİLGİLEN ve HAREKETE GEÇ.',
    en: 'All the tools, guides, datasets, and educational resources you need to fight the climate crisis. GET INFORMED and TAKE ACTION.',
  },
  'resources.searchPlaceholder': {
    tr: 'Kaynakları ara...',
    en: 'Search resources...',
  },
  'resources.searchAriaLabel': {
    tr: 'Kaynaklarda arama yap',
    en: 'Search in resources',
  },
  'resources.loading': {
    tr: 'Kaynaklar yükleniyor...',
    en: 'Loading resources...',
  },
  'resources.searching': {
    tr: 'Aranıyor...',
    en: 'Searching...',
  },
  'resources.viewResource': {
    tr: 'KAYNAĞI GÖRÜNTÜLE',
    en: 'VIEW RESOURCE',
  },
  'resources.noResults': {
    tr: 'Seçtiğiniz filtrelere uygun kaynak bulunamadı.',
    en: 'No resources found matching your selected filters.',
  },
  'resources.clearFilters': {
    tr: 'Tüm kaynakları göster',
    en: 'Show all resources',
  },
  'resources.suggestResourceTitle': {
    tr: 'KAYNAK ÖNERİN',
    en: 'SUGGEST A RESOURCE',
  },
  'resources.suggestResourceDescription': {
    tr: 'Paylaşmak istediğiniz yararlı bir kaynak mı var? İklim krizi ile ilgili herkesin erişebileceği içerikler önererek katkıda bulunabilirsiniz.',
    en: 'Do you have a useful resource you\'d like to share? You can contribute by suggesting accessible content related to the climate crisis.',
  },
  'resources.suggestResource': {
    tr: 'KAYNAK ÖNER',
    en: 'SUGGEST RESOURCE',
  },
  
  // Issues page
  'issues.title': {
    tr: 'İklim Sorunları - Beyond2C',
    en: 'Climate Issues - Beyond2C',
  },
  'issues.description': {
    tr: 'Dünyanın karşı karşıya olduğu en acil iklim sorunları ve çözüm önerileri',
    en: 'The most urgent climate issues the world faces and solution proposals',
  },
  'issues.heroTitle': {
    tr: 'İklim Krizi Gerçekleri',
    en: 'Climate Crisis Facts',
  },
  'issues.heroDescription': {
    tr: '2°C sınırını aşmadan önce acil eylem gerektiren kritik sorunlar',
    en: 'Critical issues requiring urgent action before crossing the 2°C threshold',
  },
  'issues.lastDecade': {
    tr: 'Son 10 Yıl: En Sıcak Dönem',
    en: 'Last 10 Years: Hottest Period',
  },
  'issues.co2Level': {
    tr: 'CO₂ Seviyesi: 421 ppm',
    en: 'CO₂ Level: 421 ppm',
  },
  'issues.currentStatus': {
    tr: 'Mevcut Durum',
    en: 'Current Status',
  },
  'issues.target': {
    tr: 'Hedef',
    en: 'Target',
  },
  'issues.trend': {
    tr: 'Trend',
    en: 'Trend',
  },
  'issues.urgency': {
    tr: 'Aciliyet',
    en: 'Urgency',
  },
  'issues.impacts': {
    tr: 'Etkiler',
    en: 'Impacts',
  },
  'issues.solutions': {
    tr: 'Çözümler',
    en: 'Solutions',
  },
  
  // Issue categories
  'issues.temperature.title': {
    tr: 'Artan Sıcaklık',
    en: 'Rising Temperature',
  },
  'issues.temperature.description': {
    tr: 'Küresel ortalama sıcaklık her geçen yıl artmaya devam ediyor',
    en: 'Global average temperature continues to rise each year',
  },
  'issues.temperature.trend': {
    tr: 'Artış',
    en: 'Increasing',
  },
  'issues.temperature.urgency': {
    tr: 'Yüksek',
    en: 'High',
  },
  'issues.emissions.title': {
    tr: 'Karbon Emisyonları',
    en: 'Carbon Emissions',
  },
  'issues.emissions.description': {
    tr: 'Atmosferdeki sera gazı konsantrasyonları tehlikeli seviyelere ulaştı',
    en: 'Greenhouse gas concentrations in the atmosphere have reached dangerous levels',
  },
  'issues.emissions.trend': {
    tr: 'Artış',
    en: 'Increasing',
  },
  'issues.emissions.urgency': {
    tr: 'Kritik',
    en: 'Critical',
  },
  'issues.biodiversity.title': {
    tr: 'Biyoçeşitlilik Kaybı',
    en: 'Biodiversity Loss',
  },
  'issues.biodiversity.description': {
    tr: 'Türler hızla yok olurken ekosistemlerin dengesi bozuluyor',
    en: 'As species disappear at an alarming rate, the balance of ecosystems is disrupted',
  },
  'issues.biodiversity.target': {
    tr: 'Koruma',
    en: 'Protection',
  },
  'issues.biodiversity.trend': {
    tr: 'Azalış',
    en: 'Declining',
  },
  'issues.biodiversity.urgency': {
    tr: 'Kritik',
    en: 'Critical',
  },
  'issues.water.title': {
    tr: 'Su Kaynakları',
    en: 'Water Resources',
  },
  'issues.water.description': {
    tr: 'Temiz su kaynaklarına erişim giderek zorlaşıyor',
    en: 'Access to clean water sources is becoming increasingly difficult',
  },
  'issues.water.target': {
    tr: 'Evrensel erişim',
    en: 'Universal access',
  },
  'issues.water.trend': {
    tr: 'Azalış',
    en: 'Declining',
  },
  'issues.water.urgency': {
    tr: 'Yüksek',
    en: 'High',
  },
  
  // Take Action page
  'takeAction.title': {
    tr: 'Harekete Geç - Beyond2C',
    en: 'Take Action - Beyond2C',
  },
  'takeAction.description': {
    tr: 'İklim değişikliğiyle mücadelede harekete geçin. Bireysel eylemler, topluluk katılımı ve yerel yönetimlerle işbirliği için adımlar.',
    en: 'Take action in the fight against climate change. Steps for individual actions, community involvement, and collaboration with local governments.',
  },
  'takeAction.bannerText': {
    tr: 'DEĞİŞİM SENİNLE BAŞLAR',
    en: 'CHANGE STARTS WITH YOU',
  },
  'takeAction.heroTitle': {
    tr: 'HAREKETE GEÇ',
    en: 'TAKE ACTION',
  },
  'takeAction.heroDescription': {
    tr: 'İklim krizini durdurmak için her birimizin yapabileceği şeyler var. Bireysel, topluluk veya kurumsal düzeyde ŞİMDİ harekete geçebilirsiniz.',
    en: 'There are things each of us can do to stop the climate crisis. You can take action NOW at the individual, community, or institutional level.',
  },
  'takeAction.howToStart': {
    tr: 'Nasıl Başlayabilirsin?',
    en: 'How Can You Start?',
  },
  'takeAction.chooseYourPath': {
    tr: 'Kendi yolunu seç ve iklim değişikliğiyle mücadelede etkili adımlar at.',
    en: 'Choose your path and take effective steps in the fight against climate change.',
  },
  'takeAction.individual': {
    tr: 'Bireysel',
    en: 'Individual',
  },
  'takeAction.community': {
    tr: 'Topluluk',
    en: 'Community',
  },
  'takeAction.institutional': {
    tr: 'Kurumsal',
    en: 'Institutional',
  },
  'takeAction.ready': {
    tr: 'Harekete Geçmeye Hazır mısın?',
    en: 'Ready to Take Action?',
  },
  'takeAction.readyDesc': {
    tr: 'Senden başlayacak değişim zincirine katıl ve geleceği birlikte şekillendirmek için harekete geç.',
    en: 'Join the chain of change that starts with you and take action to shape the future together.',
  },
  
  // Individual actions
  'takeAction.individual.lifestyle': {
    tr: 'Yaşam Tarzı Değişimi',
    en: 'Lifestyle Change',
  },
  'takeAction.individual.lifestyleDesc': {
    tr: 'Günlük alışkanlıklarınızı değiştirerek karbon ayak izinizi azaltın.',
    en: 'Reduce your carbon footprint by changing your daily habits.',
  },
  'takeAction.individual.lifestyleCta': {
    tr: 'Rehberi İncele',
    en: 'View Guide',
  },
  'takeAction.individual.advocacy': {
    tr: 'Savunuculuk',
    en: 'Advocacy',
  },
  'takeAction.individual.advocacyDesc': {
    tr: 'Sosyal medyada ve çevrenizde iklim farkındalığı yaratın.',
    en: 'Create climate awareness on social media and in your environment.',
  },
  'takeAction.individual.advocacyCta': {
    tr: 'Kampanyalara Katıl',
    en: 'Join Campaigns',
  },
  'takeAction.individual.volunteer': {
    tr: 'Gönüllülük',
    en: 'Volunteering',
  },
  'takeAction.individual.volunteerDesc': {
    tr: 'Yerel iklim projelerinde gönüllü olarak yer alın.',
    en: 'Volunteer in local climate projects.',
  },
  'takeAction.individual.volunteerCta': {
    tr: 'Gönüllü Ol',
    en: 'Become a Volunteer',
  },
  
  // Community actions
  'takeAction.community.organize': {
    tr: 'Organize Et',
    en: 'Organize',
  },
  'takeAction.community.organizeDesc': {
    tr: 'Topluluk etkinlikleri düzenleyin ve farkındalık yaratın.',
    en: 'Organize community events and create awareness.',
  },
  'takeAction.community.organizeCta': {
    tr: 'Etkinlik Başlat',
    en: 'Start an Event',
  },
  'takeAction.community.collaborate': {
    tr: 'İşbirliği Yap',
    en: 'Collaborate',
  },
  'takeAction.community.collaborateDesc': {
    tr: 'Yerel yönetimlerle işbirliği yaparak projeleri hayata geçirin.',
    en: 'Collaborate with local governments to implement projects.',
  },
  'takeAction.community.collaborateCta': {
    tr: 'Belediye İşbirliği',
    en: 'Municipality Collaboration',
  },
  
  // Institutional actions
  'takeAction.institutional.corporate': {
    tr: 'Kurumsal',
    en: 'Corporate',
  },
  'takeAction.institutional.corporateDesc': {
    tr: 'Şirketinizde sürdürülebilirlik programları başlatın.',
    en: 'Start sustainability programs in your company.',
  },
  'takeAction.institutional.corporateCta': {
    tr: 'Program Başlat',
    en: 'Start Program',
  },
  'takeAction.institutional.educational': {
    tr: 'Eğitim',
    en: 'Educational',
  },
  'takeAction.institutional.educationalDesc': {
    tr: 'Okullarda ve üniversitelerde iklim eğitimi verin.',
    en: 'Provide climate education in schools and universities.',
  },
  'takeAction.institutional.educationalCta': {
    tr: 'Eğitim Ver',
    en: 'Provide Education',
  },
  'takeAction.collaboration': {
    tr: 'YEREL YÖNETİM İŞBİRLİĞİ',
    en: 'MUNICIPALITY COLLABORATION',
  },
  // Impact Map page
  'impactMap.title': {
    tr: 'Etki Haritası - Beyond2C',
    en: 'Impact Map - Beyond2C',
  },
  'impactMap.description': {
    tr: 'Türkiye genelinde gerçekleştirilen iklim eylemlerini keşfedin ve siz de katkıda bulunun.',
    en: 'Discover climate actions taking place across Turkey and contribute yourself.',
  },
  'impactMap.heroTitle': {
    tr: 'İKLİM EYLEMİ ETKİ HARİTASI',
    en: 'CLIMATE ACTION IMPACT MAP',
  },
  'impactMap.heroSubtitle': {
    tr: 'KATIL • İZLE • HAREKETE GEÇ',
    en: 'JOIN • WATCH • TAKE ACTION',
  },
  'impactMap.heroDescription': {
    tr: 'Türkiye\'nin dört bir yanında, iklim eylemleri büyüyor, SİZ DE KATILMALISINIZ! Başarı hikayelerini görün, eylemlere katılın ve yeni projeler başlatın.',
    en: 'Climate actions are growing all over Turkey, YOU SHOULD JOIN TOO! See success stories, participate in actions, and start new projects.',
  },
  'impactMap.mapView': {
    tr: 'Harita Görünümü',
    en: 'Map View',
  },
  'impactMap.listView': {
    tr: 'Liste Görünümü',
    en: 'List View',
  },
  // Map components
  'map.climateActions': {
    tr: 'İklim Eylemleri',
    en: 'Climate Actions',
  },
  'map.totalActions': {
    tr: 'Toplam',
    en: 'Total',
  },
  'map.actionsFound': {
    tr: 'eylem bulundu',
    en: 'actions found',
  },
  'map.active': {
    tr: 'Aktif',
    en: 'Active',
  },
  'map.completed': {
    tr: 'Tamamlandı',
    en: 'Completed',
  },
  'map.planned': {
    tr: 'Planlanıyor',
    en: 'Planned',
  },
  'map.participants': {
    tr: 'katılımcı',
    en: 'participants',
  },
  'map.noActionsFound': {
    tr: 'Seçilen filtrelere uygun eylem bulunamadı.',
    en: 'No actions found matching the selected filters.',
  },
  'map.mapIndicators': {
    tr: 'Harita Göstergeleri',
    en: 'Map Indicators',
  },
  'map.loading': {
    tr: 'Türkiye genelindeki iklim eylemlerini görüntülemek için harita yükleniyor...',
    en: 'Loading map to view climate actions across Turkey...',
  },
  'map.activeProjects': {
    tr: 'Aktif iklim projeleri',
    en: 'Active climate projects',
  },
  'mapPreview.title': {
    tr: 'İnteraktif Etki Haritası',
    en: 'INTERACTIVE IMPACT MAP',
  },
  'mapPreview.description': {
    tr: 'Türkiye genelinde gerçekleştirilen eylemleri keşfedin. Yerel toplulukların mücadelesine siz de destek olun.',
    en: 'Discover actions being taken throughout Turkey. Support local communities in their fight.',
  },
  'mapPreview.interactiveMap': {
    tr: 'İnteraktif Harita',
    en: 'INTERACTIVE MAP',
  },
  'mapPreview.mapStats': {
    tr: '2,847+ eylem, 156 şehir, 1 hedef',
    en: '2,847+ actions, 156 cities, 1 goal',
  },
  'mapPreview.exploreMap': {
    tr: 'Haritayı Keşfet',
    en: 'Explore the Map',
  },
  'mapPreview.addAction': {
    tr: 'Eylem Ekle',
    en: 'Add Action',
  },
  'map.upcomingEvents': {
    tr: 'Yaklaşan etkinlikler',
    en: 'Upcoming events',
  },
  'map.loadingTitle': {
    tr: 'İnteraktif Harita Yükleniyor',
    en: 'Loading Interactive Map',
  },
  'map.completedProjects': {
    tr: 'Tamamlanan projeler',
    en: 'Completed projects',
  },
  'map.addAction': {
    tr: 'Eylem Ekle',
    en: 'Add Action',
  },
  'map.reportIssue': {
    tr: 'Sorun Bildir',
    en: 'Report Issue',
  },
  
  // Map filters
  'map.filters': {
    tr: 'Filtreler',
    en: 'Filters',
  },
  'map.location': {
    tr: 'Konum',
    en: 'Location',
  },
  'map.category': {
    tr: 'Kategori',
    en: 'Category',
  },
  'map.status': {
    tr: 'Durum',
    en: 'Status',
  },
  'map.energy': {
    tr: 'Enerji',
    en: 'Energy',
  },
  'map.transportation': {
    tr: 'Ulaşım',
    en: 'Transportation',
  },
  'map.wasteManagement': {
    tr: 'Atık Yönetimi',
    en: 'Waste Management',
  },
  'map.waterConservation': {
    tr: 'Su Tasarrufu',
    en: 'Water Conservation',
  },
  'map.greenSpaces': {
    tr: 'Yeşil Alanlar',
    en: 'Green Spaces',
  },
  'map.education': {
    tr: 'Eğitim',
    en: 'Education',
  },
  'map.awareness': {
    tr: 'Farkındalık',
    en: 'Awareness',
  },
  'map.policy': {
    tr: 'Politika',
    en: 'Policy',
  },
  
  // Blog page
  'blogPage.title': {
    tr: 'Blog',
    en: 'Blog',
  },
  'blogPage.description': {
    tr: 'İklim değişikliği ile ilgili en son haberler, makaleler ve kaynaklar.',
    en: 'The latest news, articles, and resources on climate change.',
  },
  'blogPage.readMore': {
    tr: 'Devamını Oku',
    en: 'Read More',
  },
  'blogPage.allPosts': {
    tr: 'Tüm Yazılar',
    en: 'All Posts',
  },
  'blogPage.featuredPosts': {
    tr: 'Öne Çıkan Yazılar',
    en: 'Featured Posts',
  },
  'blogPage.subscribe': {
    tr: 'Abone Ol',
    en: 'Subscribe',
  },
  'blogPage.subscribeDescription': {
    tr: 'İklim kriziyle ilgili en son güncellemeleri almak için bültenimize abone olun.',
    en: 'Subscribe to our newsletter to receive the latest updates on the climate crisis.',
  },
  'blogPage.privacyPolicy': {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
  },
  'blogPage.acceptCookies': {
    tr: 'Çerez politikamızı kabul ediyorsunuz.',
    en: 'You accept our cookie policy.',
  },
  
  // About page
  'about.mission': {
    tr: 'MİSYONUMUZ',
    en: 'OUR MISSION',
  },
  'about.whoAreWe': {
    tr: 'BİZ KİMİZ?',
    en: 'WHO ARE WE?',
  },
  'about.subtitle': {
    tr: 'İKLİM KRİZİNE KARŞI MÜCADELE EDEN GENÇLERİZ',
    en: 'WE ARE YOUNG PEOPLE FIGHTING AGAINST THE CLIMATE CRISIS',
  },
  'about.missionStatement': {
    tr: '"2°C eşiğini aşmadan önce İKLİM KRİZİNE KARŞI gençlerin sesini duyurmak ve yönetenlere sesimizi duyurabilmek için HAREKETE GEÇTİK!"',
    en: '"We TOOK ACTION to make young people\'s voices heard AGAINST THE CLIMATE CRISIS and to make our voices heard by those in power before crossing the 2°C threshold!"',
  },
  'about.contact': {
    tr: 'İletişim',
    en: 'Contact',
  },
  'about.cityScope': {
    tr: 'İl Kapsamı',
    en: 'City Coverage',
  },
  'about.globalMovement': {
    tr: 'Küresel İklim Hareketi',
    en: 'Global Climate Movement',
  },
  'about.globalMovementDescription': {
    tr: 'Dünyanın her yerinden iklim aktivistleri ve organizasyonlarla bağlantı kurmak için sosyal medya hesaplarımızı takip edin.',
    en: 'Follow our social media accounts to connect with climate activists and organizations from around the world.',
  },
  'about.followOnInstagram': {
    tr: 'Instagram\'da Takip Et',
    en: 'Follow on Instagram',
  },
  'about.followOnTwitter': {
    tr: 'Twitter\'da Takip Et',
    en: 'Follow on Twitter',
  },
  'about.teamTitle': {
    tr: 'Ekibimiz',
    en: 'Our Team',
  },
  'about.teamDescription': {
    tr: 'İklim değişikliği ile mücadelede öncü olan genç aktivistler ve uzmanlardan oluşan ekibimiz.',
    en: 'Our team consists of young activists and experts leading the fight against climate change.',
  },
  'about.visionTitle': {
    tr: 'Vizyonumuz',
    en: 'Our Vision',
  },
  'about.visionDescription': {
    tr: '2°C eşiğini aşmadan önce iklim krizini durdurmak ve sürdürülebilir bir gelecek inşa etmek.',
    en: 'To stop the climate crisis and build a sustainable future before crossing the 2°C threshold.',
  },
  'about.valuesTitle': {
    tr: 'Değerlerimiz',
    en: 'Our Values',
  },
  'about.valuesDescription': {
    tr: 'Şeffaflık, dayanışma, bilimsel yaklaşım ve gençlerin sesini duyurma.',
    en: 'Transparency, solidarity, scientific approach, and amplifying young voices.',
  },
  'about.description': {
    tr: "Beyond2C'nin hikayesi, vizyonu ve iklim değişikliği ile mücadelede öncü olan ekibimiz.",
    en: "The story of Beyond2C, our vision, and our team leading the fight against climate change.",
  },
  'about.missionDescription': {
    tr: 'İklim krizi karşısında gençlerin sesini duyurmak ve 2°C eşiğini aşmadan önce etkili eylemler gerçekleştirmek için kurulduk.',
    en: 'We were founded to amplify young voices against the climate crisis and take effective action before crossing the 2°C threshold.',
  },
  'about.goal1.title': {
    tr: 'Farkındalık Yaratmak',
    en: 'Create Awareness',
  },
  'about.goal1.description': {
    tr: 'İklim krizi konusunda toplumsal farkındalık yaratmak ve bilimsel gerçekleri paylaşmak.',
    en: 'Create social awareness about the climate crisis and share scientific facts.',
  },
  'about.goal2.title': {
    tr: 'Gençleri Mobilize Etmek',
    en: 'Mobilize Youth',
  },
  'about.goal2.description': {
    tr: 'Z kuşağını iklim eylemi için organize etmek ve yerel yönetimlerle buluşturmak.',
    en: 'Organize Generation Z for climate action and connect them with local governments.',
  },
  'about.goal3.title': {
    tr: 'Etkili Çözümler Üretmek',
    en: 'Generate Effective Solutions',
  },
  'about.goal3.description': {
    tr: 'Sürdürülebilir ve ölçeklenebilir iklim çözümleri geliştirmek ve uygulamak.',
    en: 'Develop and implement sustainable and scalable climate solutions.',
  },
  'about.stats.criticalThreshold': {
    tr: 'Kritik Eşik',
    en: 'CRITICAL THRESHOLD',
  },
  'about.stats.targetYear': {
    tr: 'Hedef Yıl',
    en: 'Target Year',
  },
  'about.stats.targetAudience': {
    tr: 'Hedef Kitle',
    en: 'Target Audience',
  },
  'about.stats.cityScope': {
    tr: 'Şehir Kapsamı',
    en: 'City Scope',
  },
  'about.joinTeam': {
    tr: 'TAKIMIZA KATILIN',
    en: 'JOIN OUR TEAM',
  },
  'about.joinTeamDescription': {
    tr: 'İklim değişikliği ile mücadelede bize katılın. Birlikte daha güçlü bir gelecek inşa edelim.',
    en: 'Join us in the fight against climate change. Together we can build a stronger future.',
  },
  'about.openPositions': {
    tr: 'AÇIK POZİSYONLAR',
    en: 'OPEN POSITIONS',
  },
  'about.contactDescription': {
    tr: 'İklim değişikliği ile mücadelede bize katılmak için iletişime geçin. Birlikte daha büyük etkiye sahip olabiliriz.',
    en: 'Get in touch to join us in the fight against climate change. Together we can have a greater impact.',
  },
  
  // FAQ section
  'faq.title': {
    tr: 'Sık Sorulan Sorular',
    en: 'Frequently Asked Questions',
  },
  'faq.subtitle': {
    tr: 'Merak ettiğiniz her şey',
    en: 'Everything you want to know',
  },
  'faq.question1': {
    tr: 'Beyond2C nedir ve nasıl ortaya çıktı?',
    en: 'What is Beyond2C and how did it emerge?',
  },
  'faq.answer1': {
    tr: 'Beyond2C, 2°C kritik eşiğini aşmadan önce iklim krizi ile mücadele etmek amacıyla kurulan bir gençlik hareketidir. Türkiye\'deki Z kuşağı gençlerini yerel yönetimlerle buluşturarak etkili iklim eylemlerini destekliyoruz.',
    en: 'Beyond2C is a youth movement founded to fight the climate crisis before crossing the critical 2°C threshold. We support effective climate actions by connecting Generation Z youth in Turkey with local governments.',
  },
  'faq.question2': {
    tr: 'Platformunuza nasıl katkıda bulunabilirim?',
    en: 'How can I contribute to your platform?',
  },
  'faq.answer2': {
    tr: 'Hikayenizi paylaşabilir, yerel iklim eylemlerine katılabilir, gönüllü olarak çalışabilir veya sosyal medyada farkındalık yaratabilirsiniz. Ayrıca kaynak önerileri ve işbirliği teklifleri de memnuniyetle karşılanır.',
    en: 'You can share your story, participate in local climate actions, volunteer, or create awareness on social media. Resource suggestions and collaboration proposals are also welcome.',
  },
  'faq.question3': {
    tr: 'Yerel yönetimlerle nasıl işbirliği yapıyorsunuz?',
    en: 'How do you collaborate with local governments?',
  },
  'faq.answer3': {
    tr: 'Gençlerin sesini yerel yönetimlere duyurmak için köprü görevi üstleniyoruz. Etki haritamız üzerinden başarılı projeleri paylaşıyor, yeni işbirlikleri için zemin hazırlıyoruz.',
    en: 'We act as a bridge to make young people\'s voices heard by local governments. We share successful projects on our impact map and prepare the ground for new collaborations.',
  },
  'faq.question4': {
    tr: 'Etki haritasında yer almak için ne yapmalıyım?',
    en: 'What should I do to be included in the impact map?',
  },
  'faq.answer4': {
    tr: 'İklim değişikliği ile ilgili bir proje yürütüyorsanız veya etkinlik düzenliyorsanız, bizimle iletişime geçerek projenizi etki haritamızda paylaşabilirsiniz. Doğrulanmış projeler haritada görüntülenir.',
    en: 'If you are running a climate change project or organizing an event, you can contact us to share your project on our impact map. Verified projects are displayed on the map.',
  },
  'faq.question5': {
    tr: 'Hangi yaş grubuna hitap ediyorsunuz?',
    en: 'What age group do you target?',
  },
  'faq.answer5': {
    tr: 'Öncelikle Z kuşağı (1997-2012 doğumlular) gençlerine odaklanıyoruz, ancak iklim değişikliği ile mücadelede tüm yaş gruplarından destek alıyoruz ve veriyoruz.',
    en: 'We primarily focus on Generation Z youth (born 1997-2012), but we receive and provide support from all age groups in the fight against climate change.',
  },
  'faq.question6': {
    tr: 'Verileriniz nereden geliyor?',
    en: 'Where does your data come from?',
  },
  'faq.answer6': {
    tr: 'Veri merkezimizde NASA, IPCC, Meteoroloji Genel Müdürlüğü gibi güvenilir bilimsel kaynaklardan alınan güncel iklim verileri yer alır. Tüm veriler kaynaklarıyla birlikte şeffaf şekilde paylaşılır.',
    en: 'Our data hub features current climate data from reliable scientific sources such as NASA, IPCC, and the General Directorate of Meteorology. All data is shared transparently with their sources.',
  },
  'faq.ctaTitle': {
    tr: 'Sorunuz mu var?',
    en: 'Have a question?',
  },
  'faq.ctaDescription': {
    tr: 'Aklınıza takılan başka sorular varsa bizimle iletişime geçin. Size yardımcı olmaktan mutluluk duyarız!',
    en: 'If you have other questions on your mind, contact us. We would be happy to help you!',
  },
  // Contact page
  'contact.title': {
    tr: 'İletişim - Beyond2C',
    en: 'Contact - Beyond2C',
  },
  'contact.description': {
    tr: 'Beyond2C ile iletişime geçin. Sorularınız, önerileriniz veya işbirliği teklifleriniz için bize yazın.',
    en: 'Contact Beyond2C. Write to us for your questions, suggestions, or collaboration offers.',
  },
  'contact.bannerText': {
    tr: 'BİZİMLE İLETİŞİME GEÇİN',
    en: 'CONTACT US',
  },
  'contact.heroTitle': {
    tr: 'İLETİŞİM',
    en: 'CONTACT',
  },
  'contact.heroDescription': {
    tr: 'Sorularınız, önerileriniz, kaynak paylaşımlarınız veya işbirliği teklifleriniz için bizimle iletişime geçin. BİRLİKTE daha güçlüyüz.',
    en: 'Contact us for your questions, suggestions, resource sharing, or collaboration offers. TOGETHER we are stronger.',
  },
  'contact.formTitle': {
    tr: 'İletişim Formu',
    en: 'Contact Form',
  },
  'contact.contactInfo': {
    tr: 'İletişim Bilgilerimiz',
    en: 'Our Contact Information',
  },
  'contact.responseTime': {
    tr: 'Yanıt Süresi',
    en: 'Response Time',
  },
  'contact.responseTimeDescription': {
    tr: 'Tüm mesajlarınıza genellikle 24-48 saat içinde yanıt veriyoruz.',
    en: 'We usually respond to all messages within 24-48 hours.',
  },
  'contact.name': {
    tr: 'Adınız Soyadınız',
    en: 'Your Name',
  },
  'contact.email': {
    tr: 'E-posta Adresiniz',
    en: 'Your Email',
  },
  'contact.subject': {
    tr: 'Konu',
    en: 'Subject',
  },
  'contact.message': {
    tr: 'Mesajınız',
    en: 'Your Message',
  },
  'contact.namePlaceholder': {
    tr: 'Adınızı ve soyadınızı girin',
    en: 'Enter your full name',
  },
  'contact.emailPlaceholder': {
    tr: 'E-posta adresinizi girin',
    en: 'Enter your email address',
  },
  'contact.messagePlaceholder': {
    tr: 'Mesajınızı buraya yazın...',
    en: 'Write your message here...',
  },
  'contact.selectSubject': {
    tr: 'Bir konu seçin',
    en: 'Select a subject',
  },
  'contact.subjects.general': {
    tr: 'Genel Bilgi',
    en: 'General Information',
  },
  'contact.subjects.collaboration': {
    tr: 'İşbirliği Teklifi',
    en: 'Collaboration Proposal',
  },
  'contact.subjects.resource': {
    tr: 'Kaynak Önerisi',
    en: 'Resource Suggestion',
  },
  'contact.subjects.story': {
    tr: 'Hikaye Paylaşımı',
    en: 'Story Sharing',
  },
  'contact.subjects.media': {
    tr: 'Medya ve Basın',
    en: 'Media & Press',
  },
  'contact.subjects.volunteer': {
    tr: 'Gönüllülük',
    en: 'Volunteering',
  },
  'contact.subjects.feedback': {
    tr: 'Geri Bildirim',
    en: 'Feedback',
  },
  'contact.sendMessage': {
    tr: 'MESAJ GÖNDER',
    en: 'SEND MESSAGE',
  },
  'contact.sending': {
    tr: 'Gönderiliyor...',
    en: 'Sending...',
  },
  'contact.successMessage': {
    tr: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
    en: 'Your message has been sent successfully! We will get back to you as soon as possible.',
  },
  'contact.emailDescription': {
    tr: 'Genel sorularınız için:',
    en: 'For general inquiries:',
  },
  'contact.headquarters': {
    tr: 'Merkez',
    en: 'Headquarters',
  },
  'contact.location': {
    tr: 'Türkiye',
    en: 'Turkey',
  },
  'contact.locationDescription': {
    tr: '(bağımsız bir grup iklim aktivisti)',
    en: '(an independent group of climate activists)',
  },
  'contact.validation.nameRequired': {
    tr: 'İsim alanı gereklidir',
    en: 'Name is required',
  },
  'contact.validation.emailRequired': {
    tr: 'E-posta alanı gereklidir',
    en: 'Email is required',
  },
  'contact.validation.emailInvalid': {
    tr: 'Geçerli bir e-posta adresi giriniz',
    en: 'Please enter a valid email address',
  },
  'contact.validation.subjectRequired': {
    tr: 'Konu seçimi gereklidir',
    en: 'Subject is required',
  },
  'contact.validation.messageRequired': {
    tr: 'Mesaj alanı gereklidir',
    en: 'Message is required',
  },
  'contact.successTitle': {
    tr: 'Mesajınız Gönderildi!',
    en: 'Your message has been sent!',
  },
  'contact.successDescription': {
    tr: 'En kısa sürede size dönüş yapacağız.',
    en: 'We will get back to you as soon as possible.',
  },
  'contact.subjects.technical': {
    tr: 'Teknik Destek',
    en: 'Technical Support',
  },
  'contact.subjects.other': {
    tr: 'Diğer',
    en: 'Other',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Varsayılan dili İngilizce yapıyoruz
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
