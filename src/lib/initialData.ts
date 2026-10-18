import { 
  Product, 
  Category, 
  StoreSettings, 
  Coupon, 
  ProductReview, 
  AnnouncementSettings,
  Banner,
  BannerSliderSettings,
  OccasionInfo,
  OccasionType
} from '../types';

export const STORE_OCCASIONS: OccasionInfo[] = [
  {
    id: 'birthday',
    name: 'أعياد الميلاد',
    nameEn: 'Birthdays',
    emoji: '🎂',
    description: 'باقات مبهجة وبالونات وشوكولاتة للاحتفال بيوم الميلاد',
    badge: 'الأكثر فرحاً',
    bgGradient: 'from-pink-500/15 via-rose-400/10 to-amber-200/15'
  },
  {
    id: 'wedding',
    name: 'الزواج والذكرى السنوية',
    nameEn: 'Weddings & Anniversaries',
    emoji: '💍',
    description: 'تنسيقات ملكية بالوردي والأبيض وأفخم زهور الجوري والبيوني',
    badge: 'فخامة ملكية',
    bgGradient: 'from-amber-500/15 via-pink-400/10 to-rose-200/15'
  },
  {
    id: 'graduation',
    name: 'التخرج والنجاح',
    nameEn: 'Graduation',
    emoji: '🎓',
    description: 'باقات النخبة مع مجسمات قبعات التخرج وشرائط مبارك التخرج',
    badge: 'مبروك النجاح',
    bgGradient: 'from-purple-500/15 via-pink-400/10 to-indigo-200/15'
  },
  {
    id: 'newborn',
    name: 'المواليد وهدايا الأطفال',
    nameEn: 'Newborns',
    emoji: '👶',
    description: 'ستاندات استقبال المواليد مع الورود الناعمة وتوزيعات الشوكولاتة',
    badge: 'أهلاً بالقمر',
    bgGradient: 'from-rose-500/15 via-pink-300/10 to-sky-200/15'
  },
  {
    id: 'apology',
    name: 'الاعتذار والمصالحة',
    nameEn: 'Apology & Reconciliation',
    emoji: '🕊️',
    description: 'ورود نقية بيضاء وزهرية تعبّر عن أصدق المشاعر وتذيب الجليد',
    badge: 'أصدق تعبير',
    bgGradient: 'from-teal-500/15 via-pink-400/10 to-emerald-200/15'
  },
  {
    id: 'gratitude',
    name: 'الشكر والتقدير',
    nameEn: 'Thank You & Gratitude',
    emoji: '🌸',
    description: 'هدايا راقية تعبّر عن الامتنان لمن كان لهم أثر جميل في حياتك',
    badge: 'شكراً من القلب',
    bgGradient: 'from-emerald-500/15 via-pink-400/10 to-amber-200/15'
  },
  {
    id: 'romantic',
    name: 'الهدايا الرومانسية',
    nameEn: 'Romantic Gifts',
    emoji: '💖',
    description: 'أرقى باقات الجوري الهولندي وبوكسات المخمل الوردي الفاخر',
    badge: 'مشاعر راقية',
    bgGradient: 'from-red-500/15 via-pink-500/10 to-rose-200/15'
  },
  {
    id: 'seasonal',
    name: 'المناسبات الموسمية والأعياد',
    nameEn: 'Seasonal & Holidays',
    emoji: '🌙',
    description: 'توزيعات وهدايا موسمية لعيد الفطر وعيد الأضحى وشهر رمضان',
    badge: 'مواسم الخير',
    bgGradient: 'from-amber-500/15 via-yellow-400/10 to-pink-200/15'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-pink-white',
    name: 'باقات الوردي والأبيض',
    nameEn: 'Pink & White Bouquets',
    slug: 'pink-white-bouquets',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    description: 'باقات استثنائية بتناغم اللون الوردي والأبيض الملكي',
    order: 1
  },
  {
    id: 'cat-natural',
    name: 'الورود الطبيعية الهولندية',
    nameEn: 'Natural Flowers',
    slug: 'natural-flowers',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    description: 'ورود قطف يومي منعشة ومختارة بعناية فائقة',
    order: 2
  },
  {
    id: 'cat-boxes',
    name: 'بوكسات الفخامة والجلد',
    nameEn: 'Luxury Boxes',
    slug: 'luxury-boxes',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    description: 'صناديق هدايا فاخرة بتنسيق ملكي مبهر',
    order: 3
  },
  {
    id: 'cat-chocolate',
    name: 'ورد وشوكولاتة فاخرة',
    nameEn: 'Flowers & Chocolate',
    slug: 'flowers-chocolate',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    description: 'أرقى أنواع الشوكولاتة البلجيكية مع عبير الزهور',
    order: 4
  },
  {
    id: 'cat-artificial',
    name: 'الورود الصناعية الفاخرة',
    nameEn: 'Artificial Flowers',
    slug: 'artificial-flowers',
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=800&q=80',
    description: 'تنسيقات حريرية دائمة بجمال لا يذبل أبدًا',
    order: 5
  },
  {
    id: 'cat-balloons',
    name: 'بالونات وتوزيعات هيليوم',
    nameEn: 'Balloons & Favors',
    slug: 'balloons-party',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    description: 'بالونات هيليوم أنيقة ومخصصة لجميع المناسبات السعيدة',
    order: 6
  },
  {
    id: 'cat-occasions',
    name: 'هدايا المناسبات والمواليد',
    nameEn: 'Occasions & Gifts',
    slug: 'occasions-gifts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    description: 'تنسيقات التخرج والزفاف والمواليد الجدد بتفاصيل ساحرة',
    order: 7
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-faten-royal',
    name: 'باقة فاتن الملكية | Royal Faten',
    nameEn: 'Royal Faten Pink & White Bouquet',
    description: 'تحفة فلورا فاتن الأيقونية. باقة فخمة تضم 35 جوري وردي وأبيض هولندي مع أغصان الأوكالبتوس العطرة وتغليف حريري بلون وردي ناعم وشريطة ساتان ذهبية.',
    price: 295,
    salePrice: 265,
    category: 'pink-white-bouquets',
    categoryName: 'باقات الوردي والأبيض',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 25,
    featured: true,
    isBestSeller: true,
    isNew: false,
    flowerType: 'natural',
    sizes: [
      { id: 's1', name: 'كلاسيك (25 وردة)', priceDelta: 0 },
      { id: 's2', name: 'كبير ملكي (40 وردة)', priceDelta: 85 },
      { id: 's3', name: 'سوبر فاخر VIP (60 وردة)', priceDelta: 170 }
    ],
    addons: [
      { id: 'a1', name: 'صندوق شوكولاتة بلجيكية فاخرة (16 قطعة)', price: 75, icon: '🍫' },
      { id: 'a2', name: 'بالون هيليوم وردي "ألف مبروك"', price: 35, icon: '🎈' },
      { id: 'a3', name: 'فازة زجاجية كريستالية', price: 45, icon: '🏺' }
    ],
    occasions: ['wedding', 'romantic', 'gratitude', 'birthday'],
    rating: 4.9,
    reviewsCount: 38,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-blush-box',
    name: 'بوكس بلش الوردي المخملي | Blush Velvet Box',
    nameEn: 'Blush Velvet Luxury Box',
    description: 'بوكس أسطواني من المخمل الوردي الفاخر مع لمسة ذهبية، مرصع بزهور البيوني الهولندية والبيبي روز الأبيض مع قطع شوكولاتة سويسرية.',
    price: 380,
    category: 'luxury-boxes',
    categoryName: 'بوكسات الفخامة والجلد',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 18,
    featured: true,
    isBestSeller: true,
    isNew: true,
    flowerType: 'natural',
    sizes: [
      { id: 'sb1', name: 'الحجم الوسط القياسي', priceDelta: 0 },
      { id: 'sb2', name: 'الحجم الكبير الملكي', priceDelta: 120 }
    ],
    addons: [
      { id: 'a1', name: 'شوكولاتة إضافية فاخرة', price: 65, icon: '🍫' },
      { id: 'a4', name: 'كرت إهداء بختم شمعي ذهبي', price: 20, icon: '💌' }
    ],
    occasions: ['birthday', 'wedding', 'romantic', 'seasonal'],
    rating: 5.0,
    reviewsCount: 22,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-choco-heaven',
    name: 'تنسيق قمة السعادة | Choco & Bloom Deluxe',
    nameEn: 'Luxury Chocolate and Fresh Flowers Stand',
    description: 'ستاند رخامي حديث يجمع بين باقة الورد الجوري الزهري الفاتح مع 24 قطعة من أجود أنواع الشوكولاتة البلجيكية المغلفة بلمسات ذهبية.',
    price: 340,
    salePrice: 310,
    category: 'flowers-chocolate',
    categoryName: 'ورد وشوكولاتة فاخرة',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 15,
    featured: true,
    isBestSeller: false,
    isNew: true,
    flowerType: 'natural',
    sizes: [
      { id: 'sc1', name: 'ستاند متوسط', priceDelta: 0 },
      { id: 'sc2', name: 'ستاند كبير فاخر', priceDelta: 90 }
    ],
    addons: [
      { id: 'a2', name: 'بالون هيليوم "يوم سعيد"', price: 30, icon: '🎈' }
    ],
    occasions: ['birthday', 'gratitude', 'apology', 'seasonal'],
    rating: 4.8,
    reviewsCount: 19,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-balloon-arch',
    name: 'تنسيق بالونات باستيل وهيليوم فلورا | Flora Balloon Bouquet',
    nameEn: 'Flora Pastel Helium Balloon Set',
    description: 'باقة بالونات هيليوم ناعمة بدرجات الوردي والأبيض والذهبي الكروم، تشمل بالون كبير شفاف مخصص بالاسم أو العبارة حسب اختيارك.',
    price: 190,
    category: 'balloons-party',
    categoryName: 'بالونات وتوزيعات هيليوم',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 30,
    featured: true,
    isBestSeller: false,
    isNew: true,
    flowerType: 'artificial',
    sizes: [
      { id: 'sb1', name: 'مجموعة 7 بالونات', priceDelta: 0 },
      { id: 'sb2', name: 'مجموعة 12 بالون فاخرة', priceDelta: 60 }
    ],
    addons: [
      { id: 'a5', name: 'إضافة اسم مطبوع بالذهب على البالون الكبير', price: 25, icon: '✨' }
    ],
    occasions: ['birthday', 'graduation', 'newborn', 'seasonal'],
    rating: 4.7,
    reviewsCount: 14,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-silk-eternity',
    name: 'فازة الورد الحريري الدائم | Silk Eternity Vase',
    nameEn: 'Permanent Silk Peony & Rose Vase',
    description: 'فازة سيراميك بيضاء أنيقة مع ورود صناعية فاخرة بملمس يحاكي الطبيعي 100% تدوم لسنوات دون بهتان أو ذبول. خيار مثالي للمكاتب والمنازل.',
    price: 260,
    category: 'artificial-flowers',
    categoryName: 'الورود الصناعية الفاخرة',
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 20,
    featured: false,
    isBestSeller: false,
    isNew: false,
    flowerType: 'artificial',
    sizes: [
      { id: 'se1', name: 'حجم متوسط', priceDelta: 0 },
      { id: 'se2', name: 'حجم كبير ممتلئ', priceDelta: 70 }
    ],
    addons: [
      { id: 'a6', name: 'عطر الفنادق لتعطير الزهور', price: 35, icon: '🌸' }
    ],
    occasions: ['apology', 'gratitude', 'seasonal', 'wedding'],
    rating: 4.9,
    reviewsCount: 16,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-newborn-pink',
    name: 'تنسيق استقبال مولودة "أهلاً بالقمر" | Baby Girl Welcome',
    nameEn: 'Baby Girl Flower & Gift Stand',
    description: 'تنسيق مبهج للمواليد يضم باقة جوري وردي وأبيض مع دب ناعم وبالون هيليوم وشوكولاتة مخصصة لاستقبال المواليد بأجمل حلة.',
    price: 420,
    salePrice: 385,
    category: 'occasions-gifts',
    categoryName: 'هدايا المناسبات والمواليد',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 12,
    featured: true,
    isBestSeller: true,
    isNew: true,
    flowerType: 'natural',
    sizes: [
      { id: 'sn1', name: 'التنسيق المتكامل', priceDelta: 0 },
      { id: 'sn2', name: 'التنسيق الملكي VIP مع قاعدة أكريليك', priceDelta: 150 }
    ],
    addons: [
      { id: 'a7', name: 'لوح أكريليك محفور باسم المولودة', price: 50, icon: '🎀' }
    ],
    occasions: ['newborn', 'birthday', 'gratitude'],
    rating: 5.0,
    reviewsCount: 29,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-white-pearl',
    name: 'باقة لؤلؤة البياض | White Pearl Pure Elegance',
    nameEn: 'White Pearl Pure Elegance Roses',
    description: 'باقة نقية من 30 وردة جوري بيضاء ناصعة مع لمسات الجيبسوفيلا الوردية وتغليف أبيض ثلجي بحواف ذهبية ساحرة.',
    price: 240,
    category: 'natural-flowers',
    categoryName: 'الورود الطبيعية الهولندية',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 22,
    featured: false,
    isBestSeller: true,
    isNew: false,
    flowerType: 'natural',
    sizes: [
      { id: 'sw1', name: '30 وردة كلاسيك', priceDelta: 0 },
      { id: 'sw2', name: '50 وردة فاخرة', priceDelta: 110 }
    ],
    addons: [
      { id: 'a1', name: 'شوكولاتة بلجيكية (16 قطعة)', price: 75, icon: '🍫' }
    ],
    occasions: ['wedding', 'apology', 'gratitude', 'romantic'],
    rating: 4.8,
    reviewsCount: 31,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-graduation-star',
    name: 'باقة تخرج النخبة الوردية | Pink Graduation Star',
    nameEn: 'Pink Graduation Star Bouquet with Cap',
    description: 'باقة تخرج راقية مع مجسم قبعة التخرج الأنيقة والورود الطبيعية المتألقة وشريطة مطرزة بعبارة "مبارك التخرج".',
    price: 275,
    category: 'occasions-gifts',
    categoryName: 'هدايا المناسبات والمواليد',
    image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1000&q=85',
    images: [
      'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=1000&q=85'
    ],
    stock: 14,
    featured: false,
    isBestSeller: false,
    isNew: true,
    flowerType: 'natural',
    sizes: [
      { id: 'sg1', name: 'باقة التخرج القياسية', priceDelta: 0 },
      { id: 'sg2', name: 'باقة التخرج الفاخرة الكبيرة', priceDelta: 75 }
    ],
    addons: [
      { id: 'a8', name: 'وشاح تخرج ساتان وردي مذهب', price: 45, icon: '🎓' }
    ],
    occasions: ['graduation', 'gratitude', 'birthday'],
    rating: 4.9,
    reviewsCount: 11,
    allowCardMessage: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  enabled: true,
  mode: 'marquee',
  speed: 'normal',
  durationSeconds: 5,
  direction: 'rtl',
  pauseOnHover: true,
  closable: true,
  showIcon: true,
  bgColorStart: '#AD647D',
  bgColorEnd: '#8C465F',
  textColor: '#FFFFFF',
  accentColor: '#FFE680',
  messages: [
    {
      id: 'ann-1',
      text: 'متجر Flora Faten بمكة المكرمة - حي الحمراء | التجهيز والتوصيل خلال 2 إلى 5 أيام',
      badge: 'توصيل مكة',
      icon: 'truck',
      linkType: 'page',
      linkValue: 'policy',
      linkText: 'تفاصيل التوصيل',
      isActive: true
    },
    {
      id: 'ann-2',
      text: 'استخدم كود الخصم FATEN10 واحصل على خصم 10% على باقات الورد والبوكسات',
      badge: 'كود خصم 10%',
      icon: 'tag',
      linkType: 'coupon',
      linkValue: 'FATEN10',
      linkText: 'نسخ الكود',
      isActive: true
    },
    {
      id: 'ann-3',
      text: 'تشكيلة راقية من بوكسات الورد المخملية والشوكولاتة البلجيكية لجميع مناسباتكم السعيدة',
      badge: 'جديدنا',
      icon: 'sparkles',
      linkType: 'category',
      linkValue: 'luxury-boxes',
      linkText: 'تصفح البوكسات',
      isActive: true
    },
    {
      id: 'ann-4',
      text: 'خدمة العملاء والطلبات المخصصة والتنسيق الخاص عبر الواتساب: 0501234567',
      badge: 'خدمة العملاء',
      icon: 'phone',
      linkType: 'page',
      linkValue: 'contact',
      linkText: 'تواصل معنا',
      isActive: true
    }
  ]
};

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Flora Faten | فلورا فاتن',
  storeNameEn: 'Flora Faten Boutique - Makkah',
  tagline: 'حيث تتفتح مشاعرك بأرقى باقات الورد والهدايا الفاخرة في مكة المكرمة',
  phone: '+966501234567',
  whatsapp: '+966501234567',
  email: 'floraf.aten1@gmail.com',
  address: 'مكة المكرمة - حي الحمراء، المملكة العربية السعودية',
  taxNumber: '310984562100003',
  deliveryFeeDefault: 20,
  freeDeliveryThreshold: 300,
  minOrderAmount: 50,
  announcementText: '🌸 متجر Flora Faten بمكة المكرمة - حي الحمراء | التجهيز والتوصيل خلال من 2 إلى 5 أيام | الدفع عند الاستلام فقط 💐',
  announcementActive: true,
  announcementSettings: DEFAULT_ANNOUNCEMENT_SETTINGS,
  bannerSliderSettings: {
    autoPlay: true,
    intervalSeconds: 3, // Default 3s per request
    pauseOnHover: true,
    showArrows: true,
    showDots: true,
    transitionEffect: 'slide',
    aspectRatioDesktop: '21/9',
    aspectRatioMobile: '16/9',
    containerMaxWidth: 'full'
  },
  cities: [
    { name: 'مكة المكرمة - حي الحمراء (المنطقة الرئيسية)', fee: 15, active: true },
    { name: 'مكة المكرمة - حي الحمراء وأم الجود', fee: 15, active: true },
    { name: 'مكة المكرمة - الرصيفة والزهراء', fee: 20, active: true },
    { name: 'مكة المكرمة - العوالي والنسيم', fee: 20, active: true },
    { name: 'مكة المكرمة - العزيزية والجامعة', fee: 20, active: true },
    { name: 'مكة المكرمة - الشوقية والكعكية', fee: 20, active: true },
    { name: 'مكة المكرمة - بطحاء قريش والهجرة', fee: 20, active: true },
    { name: 'مكة المكرمة - الشرائع والخضراء', fee: 25, active: true },
    { name: 'مكة المكرمة - النوارية والعمرة', fee: 25, active: true },
    { name: 'مكة المكرمة - الزاهر والعتيبية', fee: 20, active: true },
    { name: 'مكة المكرمة - التنعيم والشهداء', fee: 25, active: true },
    { name: 'مكة المكرمة - المنطقة المركزية والحرم', fee: 25, active: true }
  ],
  updatedAt: new Date().toISOString()
};

export const DEFAULT_BANNER_SLIDER_SETTINGS: BannerSliderSettings = {
  autoPlay: true,
  intervalSeconds: 3,
  pauseOnHover: true,
  showArrows: true,
  showDots: true,
  transitionEffect: 'slide',
  aspectRatioDesktop: '21/9',
  aspectRatioMobile: '16/9',
  containerMaxWidth: 'full'
};

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-royal-pink',
    title: 'تشكيلة الوردي والأبيض الملكية',
    subtitle: 'أرقى باقات الجوري والبيوني الهولندي بتغليف شمعي فاخر وبطاقات إهداء مخصصة',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1920&q=85',
    mobileImageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85',
    altText: 'باقات الورد الملكية باللون الوردي والأبيض من متجر فلورا فاتن',
    linkType: 'category',
    linkValue: 'pink-white-bouquets',
    buttonText: 'تسوق التشكيلة الملكية',
    isActive: true,
    order: 1,
    objectFit: 'cover',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'banner-occasions-luxury',
    title: 'تنسيقات المناسبات والشوكولاتة الفاخرة',
    subtitle: 'هدايا استثنائية لحفلات التخرج، الزفاف، والمواليد مع قوالب الشوكولاتة البلجيكية',
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=1920&q=85',
    mobileImageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=85',
    altText: 'بوكسات الهدايا وتنسيقات المناسبات السعيدة',
    linkType: 'category',
    linkValue: 'occasions-gifts',
    buttonText: 'تصفح هدايا المناسبات',
    isActive: true,
    order: 2,
    objectFit: 'cover',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'banner-balloons-vip',
    title: 'بالونات الهيليوم وكروت الإهداء الشمعية',
    subtitle: 'توزيعات حفلات وبالونات مخصصة بالاسم وتوصيل مجدول لأحياء مكة المكرمة',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1920&q=85',
    mobileImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85',
    altText: 'بالونات الهيليوم وتوزيعات المناسبات في مكة',
    linkType: 'category',
    linkValue: 'balloons-party',
    buttonText: 'اكتشف البالونات والتوزيعات',
    isActive: true,
    order: 3,
    objectFit: 'cover',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-faten10',
    code: 'FATEN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 150,
    isActive: true,
    usageCount: 14
  },
  {
    id: 'coup-welcome',
    code: 'WELCOME',
    discountType: 'fixed',
    discountValue: 25,
    minOrderAmount: 200,
    isActive: true,
    usageCount: 32
  },
  {
    id: 'coup-love',
    code: 'LOVE',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 300,
    isActive: true,
    usageCount: 8
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-faten-royal',
    userName: 'نورة العصيمي',
    rating: 5,
    comment: 'ما شاء الله تبارك الله، الباقة وصلت أرقى وأفخم من الصور بكثير! الورد فريش ورائحته تملأ المكان والتغليف قمة في الأناقة والختم الشمعي زاد الهدية فخامة.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-faten-royal',
    userName: 'سلطان الحربي',
    rating: 5,
    comment: 'توصيل سريع داخل مكة في نفس الوقت المحدد، وخدمة العملاء متعاونين جداً. الوالدة انبسطت جداً بالباقة، شكراً فلورا فاتن على هذا التميز.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-faten-royal',
    userName: 'رهف الشريف',
    rating: 5,
    comment: 'أجمل متجر ورد في مكة بلا منازع! تنسيق متقن وألوان الوردي والأبيض متناسقة بشكل ملكي مبهج.',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'prod-blush-box',
    userName: 'أميرة بافقيه',
    rating: 5,
    comment: 'البوكس المخملي روعة والورود نضرة وجميلة جداً، والشوكولاتة طازجة ولذيذة. تجربة إهداء متكاملة.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'prod-blush-box',
    userName: 'محمد القحطاني',
    rating: 4,
    comment: 'بوكس أنيق وفخم ويصلح للمناسبات الخاصة. الورد منسق بذوق عالي والتعامل ممتاز.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-6',
    productId: 'prod-choc-deluxe',
    userName: 'خلود الزهراني',
    rating: 5,
    comment: 'هدية راقية جداً لصديقتي بمناسبة ترقيتها، انبهرت بالتغليف وجودة الشوكولاتة والورد. شكراً لكم!',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    verifiedPurchase: true
  },
  {
    id: 'rev-7',
    productId: 'prod-orchid-everlasting',
    userName: 'دانية فلمبان',
    rating: 5,
    comment: 'الأوركيد الصناعي يبدو طبيعياً تماماً وجودته عالية جداً، وضعته في صالون البيت والكل يسأل عنه.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    verifiedPurchase: true
  }
];
