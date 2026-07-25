import { GameAsset, LandContract } from '../types';

export const GAME_ASSETS: Record<string, GameAsset> = {
  // 1. جناح الدواجن والطيور
  chicken: {
    id: 'chicken',
    name: 'الفراخ البلدي',
    category: 'poultry',
    buyPriceGold: 10,
    feedType: 'علف حبوب + ماء',
    growthTimeMinutes: 15,
    productionCycleMinutes: 5,
    productName: 'بيض فرعوني طازج',
    mortalityHours: 12,
    image: '/assets/chicken.png',
    gridSize: { width: 1, height: 1 }
  },
  ostrich: {
    id: 'ostrich',
    name: 'النعام الملكي',
    category: 'poultry',
    buyPriceGold: 500,
    buyPricePi: 0.5,
    feedType: 'علف مركز + أرض واسعة',
    growthTimeMinutes: 240, // 4 hours
    productionCycleMinutes: 60,
    productName: 'ريش وجلد نعام فاخر',
    mortalityHours: 36,
    image: '/assets/chicken.png', // يتم استخدام صورة تقريبية لحين إضافة نعامة مخصصة
    gridSize: { width: 2, height: 2 }
  },

  // 2. جناح الثدييات والغزلان
  deer: {
    id: 'deer',
    name: 'الغزال الملكي',
    category: 'mammal',
    buyPriceGold: 1500,
    buyPricePi: 1.5,
    feedType: 'أعشاب برية نادرة',
    growthTimeMinutes: 360, // 6 hours
    productionCycleMinutes: 120,
    productName: 'مسك الغزال الطبيعي',
    mortalityHours: 48,
    image: '/assets/cow.png', // يمثل سلالة نادرة
    gridSize: { width: 2, height: 2 }
  },

  // 3. جناح المواشي الكبيرة
  cow: {
    id: 'cow',
    name: 'البقرة المقدسة',
    category: 'livestock',
    buyPriceGold: 1000,
    buyPricePi: 2.5,
    feedType: 'برسيم مكثف ومياه وفيرة',
    growthTimeMinutes: 480, // 8 hours
    productionCycleMinutes: 45,
    productName: 'حليب بقري وفير',
    mortalityHours: 48,
    image: '/assets/cow.png',
    gridSize: { width: 2, height: 2 }
  },

  // 4. المباني والمصانع الملكية
  dairy_factory: {
    id: 'dairy_factory',
    name: 'معمل ألبان البشوات',
    category: 'building',
    buyPriceGold: 800,
    feedType: 'حليب خام',
    growthTimeMinutes: 0,
    productionCycleMinutes: 30,
    productName: 'جبنة رومي معتقة وزبدة',
    mortalityHours: 999,
    image: '/assets/dairy_factory.png',
    gridSize: { width: 2, height: 2 }
  },
  bakery: {
    id: 'bakery',
    name: 'المخبز والمطعم الملكي',
    category: 'building',
    buyPriceGold: 600,
    feedType: 'قمح وتمر',
    growthTimeMinutes: 0,
    productionCycleMinutes: 20,
    productName: 'وجبات إطعام العمال',
    mortalityHours: 999,
    image: '/assets/bakery.png',
    gridSize: { width: 2, height: 2 }
  },
  market: {
    id: 'market',
    name: 'سوق الـ Web3 P2P',
    category: 'building',
    buyPriceGold: 1200,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 0,
    productName: 'مركز التداول العقودي',
    mortalityHours: 999,
    image: '/assets/market.png',
    gridSize: { width: 3, height: 3 }
  },
  diwan: {
    id: 'diwan',
    name: 'ديوان الأراضي الملكي',
    category: 'building',
    buyPriceGold: 1000,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 0,
    productName: 'إدارة عقود الـ Pi',
    mortalityHours: 999,
    image: '/assets/diwan.png',
    gridSize: { width: 2, height: 2 }
  },
  altar: {
    id: 'altar',
    name: 'مذبح القرابين والمباركة',
    category: 'building',
    buyPriceGold: 1500,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 0,
    productName: 'زيادة طاقة العمال',
    mortalityHours: 999,
    image: '/assets/altar.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true
  },
  statue_bastet: {
    id: 'statue_bastet',
    name: 'تمثال باستيت الأسطوري (NFT)',
    category: 'building',
    buyPriceGold: 5000,
    buyPricePi: 5.0,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 0,
    productName: 'مضاعفة إنتاج المزرعة 2x',
    mortalityHours: 999,
    image: '/assets/statue_bastet.png',
    gridSize: { width: 1, height: 1 },
    requiresPedestal: true
  },
  obelisk: {
    id: 'obelisk',
    name: 'المسلة الملكية',
    category: 'building',
    buyPriceGold: 3000,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 0,
    productName: 'رمز الهيبة البشواتية',
    mortalityHours: 999,
    image: '/assets/obelisk-removebg-preview.png',
    gridSize: { width: 1, height: 1 },
    requiresPedestal: true
  },
  windmill: {
    id: 'windmill',
    name: 'الطاحونة الهوائية الزراعية',
    category: 'building',
    buyPriceGold: 700,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 15,
    productName: 'دقيق القمح الفاخر',
    mortalityHours: 999,
    image: '/assets/windmill_anim.png',
    gridSize: { width: 2, height: 2 }
  },
  water_well: {
    id: 'water_well',
    name: 'بئر المياه الملكي',
    category: 'building',
    buyPriceGold: 400,
    feedType: '',
    growthTimeMinutes: 0,
    productionCycleMinutes: 10,
    productName: 'مياه الري العذبة',
    mortalityHours: 999,
    image: '/assets/water_well-removebg-preview.png',
    gridSize: { width: 2, height: 2 }
  },
  wheat_field: {
    id: 'wheat_field',
    name: 'حقل القمح الذهبي',
    category: 'building',
    buyPriceGold: 100,
    feedType: 'مياه البئر',
    growthTimeMinutes: 10,
    productionCycleMinutes: 10,
    productName: 'حزمة قمح',
    mortalityHours: 999,
    image: '/assets/wheat_field.png',
    gridSize: { width: 2, height: 2 }
  },
  palm_tree: {
    id: 'palm_tree',
    name: 'نخيل التمر الملكي',
    category: 'building',
    buyPriceGold: 250,
    feedType: 'مياه الري',
    growthTimeMinutes: 30,
    productionCycleMinutes: 20,
    productName: 'تمر سيوي فاخر',
    mortalityHours: 999,
    image: '/assets/palm_tree.png',
    gridSize: { width: 1, height: 1 }
  },
  fig_tree: {
    id: 'fig_tree',
    name: 'شجرة التين المقدسة',
    category: 'building',
    buyPriceGold: 200,
    feedType: 'مياه الري',
    growthTimeMinutes: 25,
    productionCycleMinutes: 18,
    productName: 'تين فرعوني طازج',
    mortalityHours: 999,
    image: '/assets/fig_tree.png',
    gridSize: { width: 1, height: 1 }
  }
};

export const LAND_CONTRACTS: LandContract[] = [
  {
    id: 'baladi',
    name: 'الحيز البلدي (مجاني للبواكير)',
    tier: 'baladi',
    costPi: 0,
    durationDays: 365,
    capacity: 6,
    unlocked: true
  },
  {
    id: 'ezba',
    name: 'عزبة المزارع البشواتي',
    tier: 'ezba',
    costPi: 1.0,
    durationDays: 7,
    capacity: 15,
    unlocked: false
  },
  {
    id: 'pasha',
    name: 'المزرعة البشواتية الكبرى',
    tier: 'pasha',
    costPi: 3.0,
    durationDays: 30,
    capacity: 35,
    unlocked: false
  },
  {
    id: 'royal',
    name: 'المحمية الملكية (حصري للـ NFTs)',
    tier: 'royal',
    costPi: 5.0,
    durationDays: 30,
    capacity: 60,
    unlocked: false
  }
];