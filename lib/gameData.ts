export type AssetCategory = 'crop' | 'tree' | 'animal' | 'aquaculture' | 'building' | 'decoration' | 'equipment' | 'soil' | 'seed';
export type BuffType = 'yield_boost' | 'time_reduction' | 'cost_reduction' | 'quality_boost' | 'worker_blessing';

export interface AuraBuff {
  type: BuffType;
  value: number;
  radius: number;
  targetCategories: AssetCategory[];
  description: string;
}

export interface GameAsset {
  id: string;
  name: string;
  category: AssetCategory;
  image: string;
  productName: string;
  gridSize: { width: number; height: number };
  requiresPedestal?: boolean;
  buyPriceGold: number;
  buyPricePi?: number;
  requiredLevel: number;
  xpReward: number;
  productionTimeSec: number;
  outputQuantity: number;
  maintenanceCostGold?: number;
  auraBuff?: AuraBuff;
  yieldAmount?: number;
  sellPriceGold?: number;
  quantity?: number;
}

export interface LandContract {
  id: string;
  name: string;
  requiredLevel: number;
  priceGold?: number;
  pricePi?: number;
  gridDimensions: { rows: number; cols: number };
  storageBonus: number;
  marketFeeDiscount: number;
}

export const LAND_CONTRACTS: LandContract[] = [
  { 
    id: 'contract_1', 
    name: 'عقد حوض النيل الصغير', 
    requiredLevel: 1, 
    pricePi: 5.0, 
    priceGold: 0,
    gridDimensions: { rows: 8, cols: 8 },
    storageBonus: 20,
    marketFeeDiscount: 0
  },
  { 
    id: 'contract_2', 
    name: 'عقد أراضي الوادي الملكي', 
    requiredLevel: 2, 
    pricePi: 15.0, 
    priceGold: 1000,
    gridDimensions: { rows: 10, cols: 10 },
    storageBonus: 45,
    marketFeeDiscount: 5
  },
  { 
    id: 'contract_3', 
    name: 'عقد واحة آمون الكبرى', 
    requiredLevel: 4, 
    pricePi: 35.0, 
    priceGold: 2500,
    gridDimensions: { rows: 12, cols: 12 },
    storageBonus: 80,
    marketFeeDiscount: 10
  },
  { 
    id: 'contract_4', 
    name: 'عقد إمبراطورية باي الفرعونية', 
    requiredLevel: 6, 
    pricePi: 100.0, 
    priceGold: 5000,
    gridDimensions: { rows: 16, cols: 16 },
    storageBonus: 200,
    marketFeeDiscount: 20
  }
];

export const GAME_ASSETS: Record<string, GameAsset> = {
  // === التربة الزراعية الأساسية (نظام حقول الطين التفاعلي) ===
  soil_plot: {
    id: 'soil_plot',
    name: 'مربع طين زراعي',
    category: 'soil',
    image: '/soil_plot.png',
    productName: 'أرض صالحة للزراعة',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 10,
    buyPricePi: 0.05,
    requiredLevel: 1,
    xpReward: 2,
    productionTimeSec: 0,
    outputQuantity: 1
  },

  // === المباني الأساسية والإنتاجية ===
  altar: {
    id: 'altar',
    name: 'المذبح الملكي الفرعوني',
    category: 'building',
    image: '/altar.png',
    productName: 'بركات ومضاعفة إنتاج',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    buyPriceGold: 500,
    buyPricePi: 2.5,
    requiredLevel: 1,
    xpReward: 100,
    productionTimeSec: 86400,
    outputQuantity: 1
  },
  water_well: {
    id: 'water_well',
    name: 'بئر المياه الفرعوني',
    category: 'building',
    image: '/water_well-removebg-preview.png',
    productName: 'مياه عذبة للري',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 150,
    requiredLevel: 1,
    xpReward: 15,
    productionTimeSec: 120,
    outputQuantity: 5
  },
  melter: {
    id: 'melter',
    name: 'مسبك الذهب والمعادن',
    category: 'building',
    image: '/melter.png',
    productName: 'سبائك ذهبية صافية',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    buyPriceGold: 1500,
    buyPricePi: 6.0,
    requiredLevel: 15,
    xpReward: 150,
    productionTimeSec: 3600,
    outputQuantity: 1,
    maintenanceCostGold: 50
  },
  bakery: {
    id: 'bakery',
    name: 'مخبز العيش الفرعوني',
    category: 'building',
    image: '/bakery.png',
    productName: 'خبز طازج للعمال',
    gridSize: { width: 2, height: 2 },
    buyPriceGold: 350,
    buyPricePi: 1.5,
    requiredLevel: 3,
    xpReward: 30,
    productionTimeSec: 300,
    outputQuantity: 2,
    maintenanceCostGold: 10
  },
  dairy_factory: {
    id: 'dairy_factory',
    name: 'معمل الأجبان والألبان',
    category: 'building',
    image: '/dairy_factory.png',
    productName: 'جبن فاخر وتجارة',
    gridSize: { width: 2, height: 2 },
    buyPriceGold: 700,
    buyPricePi: 3.0,
    requiredLevel: 5,
    xpReward: 50,
    productionTimeSec: 600,
    outputQuantity: 3,
    maintenanceCostGold: 15
  },
  windmill: {
    id: 'windmill',
    name: 'طاحونة النيل الهوائية',
    category: 'building',
    image: '/windmill_anim.png',
    productName: 'دقيق وأعلاف زراعية',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    buyPriceGold: 450,
    buyPricePi: 2.0,
    requiredLevel: 4,
    xpReward: 40,
    productionTimeSec: 450,
    outputQuantity: 4
  },
  wool_factory: {
    id: 'wool_factory',
    name: 'مغزل الصوف والجلود',
    category: 'building',
    buyPriceGold: 500,
    buyPricePi: 0.6,
    image: '/wool_factory.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'خيوط ومعاطف',
    requiredLevel: 7,
    xpReward: 60,
    productionTimeSec: 900,
    outputQuantity: 2,
    maintenanceCostGold: 20
  },
  perfume_lab: {
    id: 'perfume_lab',
    name: 'معمل العطور والنعام الملكي',
    category: 'building',
    buyPriceGold: 800,
    buyPricePi: 1.0,
    image: '/perfume_lab.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'عطور ومسك غزال',
    requiredLevel: 12,
    xpReward: 120,
    productionTimeSec: 1800,
    outputQuantity: 1,
    maintenanceCostGold: 30
  },
  fish_cannery: {
    id: 'fish_cannery',
    name: 'مملحة ومصنع تعليب الأسماك',
    category: 'building',
    buyPriceGold: 600,
    buyPricePi: 0.7,
    image: '/fish_cannery.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'كافيار وتونة',
    requiredLevel: 8,
    xpReward: 80,
    productionTimeSec: 1200,
    outputQuantity: 5,
    maintenanceCostGold: 25
  },
  jewel_workshop: {
    id: 'jewel_workshop',
    name: 'ورشة الجواهرجية الملكية',
    category: 'building',
    buyPriceGold: 1500,
    buyPricePi: 2.0,
    image: '/jewel_workshop.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'مجوهرات نادرة',
    requiredLevel: 14,
    xpReward: 200,
    productionTimeSec: 7200,
    outputQuantity: 1,
    maintenanceCostGold: 100
  },
  royal_stable: {
    id: 'royal_stable',
    name: 'إسطبل الخيول والغزلان',
    category: 'building',
    buyPriceGold: 1200,
    buyPricePi: 1.5,
    image: '/royal_stable.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'محمية حيوانات',
    requiredLevel: 9,
    xpReward: 90,
    productionTimeSec: 1500,
    outputQuantity: 1
  },
  ostrich_ranch: {
    id: 'ostrich_ranch',
    name: 'ملعب النعام الملكي',
    category: 'building',
    buyPriceGold: 500,
    buyPricePi: 0.5,
    image: '/ostrich_ranch.png',
    gridSize: { width: 2, height: 2 },
    requiresPedestal: true,
    productName: 'ريش نعام',
    requiredLevel: 10,
    xpReward: 100,
    productionTimeSec: 1800,
    outputQuantity: 3
  },
  diwan: {
    id: 'diwan',
    name: 'ديوان الإدارة الزراعية',
    category: 'building',
    image: '/diwan.png',
    productName: 'توثيق العقود',
    gridSize: { width: 2, height: 2 },
    buyPriceGold: 800,
    buyPricePi: 3.5,
    requiredLevel: 2,
    xpReward: 20,
    productionTimeSec: 0,
    outputQuantity: 0
  },
  market: {
    id: 'market',
    name: 'السوق الملكي الكبير',
    category: 'building',
    image: '/market.png',
    productName: 'تبادل تجاري',
    gridSize: { width: 2, height: 2 },
    buyPriceGold: 1000,
    buyPricePi: 4.5,
    requiredLevel: 2,
    xpReward: 20,
    productionTimeSec: 0,
    outputQuantity: 0
  },

  // === المعدات والتجهيزات ===
  poultry_incubator: {
    id: 'poultry_incubator',
    name: 'حاضنات الدواجن',
    category: 'equipment',
    image: '/poultry_incubator.png',
    productName: 'كتاكيت',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 250,
    buyPricePi: 0.25,
    requiredLevel: 6,
    xpReward: 25,
    productionTimeSec: 300,
    outputQuantity: 10
  },
  rabbit_battery: {
    id: 'rabbit_battery',
    name: 'بطاريات الأرانب',
    category: 'equipment',
    image: '/rabbit_battery.png',
    productName: 'أرانب صغيرة',
    gridSize: { width: 1, height: 2 },
    buyPriceGold: 350,
    buyPricePi: 0.35,
    requiredLevel: 7,
    xpReward: 35,
    productionTimeSec: 400,
    outputQuantity: 5
  },

  // === المواشي والحيوانات الملكية ===
  chicken: {
    id: 'chicken',
    name: 'دجاج الوادي الصغير',
    category: 'animal',
    image: '/chicken.png',
    productName: 'بيض طازج',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 60,
    requiredLevel: 1,
    xpReward: 5,
    productionTimeSec: 60,
    outputQuantity: 1
  },
  duck: {
    id: 'duck',
    name: 'بط النيل الدمياطي',
    category: 'animal',
    image: '/duck.png',
    productName: 'لحوم وريش فاخر',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 90,
    requiredLevel: 3,
    xpReward: 10,
    productionTimeSec: 120,
    outputQuantity: 1
  },
  rabbit: {
    id: 'rabbit',
    name: 'أرانب الوادي الخصب',
    category: 'animal',
    image: '/rabbit.png',
    productName: 'تَكاثُر سريع وفراء',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 110,
    requiredLevel: 4,
    xpReward: 12,
    productionTimeSec: 90,
    outputQuantity: 2
  },
  pigeon: {
    id: 'pigeon',
    name: 'حمام برج ملكي',
    category: 'animal',
    image: '/pigeon.png',
    productName: 'زغاليل وسماد',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 50,
    requiredLevel: 5,
    xpReward: 8,
    productionTimeSec: 150,
    outputQuantity: 2
  },
  sheep: {
    id: 'sheep',
    name: 'أغنام سيناء المباركة',
    category: 'animal',
    image: '/sheep.png',
    productName: 'صوف وحليب دسم',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 180,
    requiredLevel: 6,
    xpReward: 18,
    productionTimeSec: 240,
    outputQuantity: 1
  },
  goat: {
    id: 'goat',
    name: 'ماعز بلدي',
    category: 'animal',
    image: '/goat.png',
    productName: 'حليب وجلود',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 100,
    buyPricePi: 5,
    requiredLevel: 7,
    xpReward: 15,
    productionTimeSec: 200,
    outputQuantity: 1
  },
  cow: {
    id: 'cow',
    name: 'البقرة الفرعونية المقدسة',
    category: 'animal',
    image: '/cow.png',
    productName: 'حليب نقي ومخصبات',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 250,
    requiredLevel: 8,
    xpReward: 25,
    productionTimeSec: 300,
    outputQuantity: 2
  },
  horse: {
    id: 'horse',
    name: 'الخيل العربي الفرعوني',
    category: 'animal',
    image: '/horse.png',
    productName: 'هيبة وتسريع النقل',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 600,
    buyPricePi: 2.0,
    requiredLevel: 11,
    xpReward: 50,
    productionTimeSec: 600,
    outputQuantity: 1
  },
  gazelle: {
    id: 'gazelle',
    name: 'غزال الصحراء الملكي',
    category: 'animal',
    image: '/gazelle.png',
    productName: 'مسك نادر وجلود',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 850,
    buyPricePi: 3.5,
    requiredLevel: 13,
    xpReward: 70,
    productionTimeSec: 1200,
    outputQuantity: 1
  },
  ostrich: {
    id: 'ostrich',
    name: 'نعام النوبة العملاق',
    category: 'animal',
    image: '/ostrich.png',
    productName: 'بيض ملكي ضخم',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 1100,
    buyPricePi: 4.0,
    requiredLevel: 10,
    xpReward: 85,
    productionTimeSec: 900,
    outputQuantity: 1
  },
  falcon: {
    id: 'falcon',
    name: 'صقر حورس الحارس',
    category: 'animal',
    image: '/falcon.png',
    productName: 'حماية المزرعة',
    gridSize: { width: 1, height: 1 },
    requiresPedestal: true,
    buyPriceGold: 2000,
    buyPricePi: 8.0,
    requiredLevel: 15,
    xpReward: 150,
    productionTimeSec: 3600,
    outputQuantity: 1
  },

  // === جناح الأسماك والمأكولات البحرية ===
  tilapia: {
    id: 'tilapia',
    name: 'سمك بلطي',
    category: 'aquaculture',
    image: '/tilapia.png',
    productName: 'أسماك طازجة',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 15,
    requiredLevel: 2,
    xpReward: 4,
    productionTimeSec: 90,
    outputQuantity: 3
  },
  mullet: {
    id: 'mullet',
    name: 'سمك بوري',
    category: 'aquaculture',
    image: '/mullet.png',
    productName: 'لحم وكافيار',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 35,
    requiredLevel: 5,
    xpReward: 10,
    productionTimeSec: 180,
    outputQuantity: 2
  },
  shrimp: {
    id: 'shrimp',
    name: 'جمبري جامبو',
    category: 'aquaculture',
    image: '/shrimp.png',
    productName: 'جمبري للتصدير',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 80,
    requiredLevel: 7,
    xpReward: 15,
    productionTimeSec: 240,
    outputQuantity: 5
  },
  tuna: {
    id: 'tuna',
    name: 'سمك تونة ضخم',
    category: 'aquaculture',
    image: '/tuna.png',
    productName: 'تونة للتعليب',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 800,
    buyPricePi: 0.8,
    requiredLevel: 12,
    xpReward: 60,
    productionTimeSec: 900,
    outputQuantity: 1
  },
  oyster: {
    id: 'oyster',
    name: 'محار ملكي',
    category: 'aquaculture',
    image: '/oyster.png',
    productName: 'لؤلؤ طبيعي',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 2000,
    buyPricePi: 2.0,
    requiredLevel: 14,
    xpReward: 120,
    productionTimeSec: 1800,
    outputQuantity: 1
  },

  // === المحاصيل الزراعية والبذور الكاملة لضمان استهلاك الباي (Crops & Seeds) ===
  seed_wheat: {
    id: 'seed_wheat',
    name: 'بذور القمح الذهبي',
    category: 'seed',
    image: '/seed_wheat.png',
    productName: 'سنابل قمح',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 10,
    requiredLevel: 1,
    xpReward: 5,
    productionTimeSec: 60,
    outputQuantity: 2
  },
  seed_barley: {
    id: 'seed_barley',
    name: 'بذور الشعير الفرعوني',
    category: 'seed',
    image: '/seed_barley.png',
    productName: 'حبوب الشعير',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 20,
    requiredLevel: 2,
    xpReward: 8,
    productionTimeSec: 120,
    outputQuantity: 2
  },
  seed_flax: {
    id: 'seed_flax',
    name: 'بذور الكتان الملكي',
    category: 'seed',
    image: '/seed_flax.png',
    productName: 'خيوط الكتان الخام',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 35,
    buyPricePi: 0.1,
    requiredLevel: 3,
    xpReward: 12,
    productionTimeSec: 180,
    outputQuantity: 3
  },
  seed_sesame: {
    id: 'seed_sesame',
    name: 'بذور السمسم الوادي',
    category: 'seed',
    image: '/seed_sesame.png',
    productName: 'حبوب سمسم وزيت',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 50,
    requiredLevel: 4,
    xpReward: 15,
    productionTimeSec: 240,
    outputQuantity: 3
  },
  seed_lotus: {
    id: 'seed_lotus',
    name: 'بذور زهرة اللوتس المقدسة',
    category: 'seed',
    image: '/seed_lotus.png',
    productName: 'لوتس أسطوري',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 200,
    buyPricePi: 1.0,
    requiredLevel: 10,
    xpReward: 50,
    productionTimeSec: 900,
    outputQuantity: 1
  },

  // أشجار مثمرة
  fig_tree: {
    id: 'fig_tree',
    name: 'شجرة التين المباركة',
    category: 'tree',
    image: '/fig_tree.png',
    productName: 'ثمار التين',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 80,
    requiredLevel: 4,
    xpReward: 20,
    productionTimeSec: 300,
    outputQuantity: 4
  },
  palm_tree: {
    id: 'palm_tree',
    name: 'النخلة الملكية السيناوية',
    category: 'tree',
    image: '/palm_tree.png',
    productName: 'بلح وتمور',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 100,
    requiredLevel: 5,
    xpReward: 25,
    productionTimeSec: 420,
    outputQuantity: 5
  },
  pomegranate_tree: {
    id: 'pomegranate_tree',
    name: 'شجرة الرمان الملكي',
    category: 'tree',
    image: '/pomegranate_tree.png',
    productName: 'رمان فاخر',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 250,
    buyPricePi: 0.5,
    requiredLevel: 8,
    xpReward: 40,
    productionTimeSec: 600,
    outputQuantity: 3
  },

  // === المعالم والزينة ===
  statue_bastet: {
    id: 'statue_bastet',
    name: 'تمثال باستيت الحارس',
    category: 'decoration',
    image: '/statue_bastet.png',
    productName: 'بركة الحارس',
    gridSize: { width: 1, height: 1 },
    requiresPedestal: true,
    buyPriceGold: 1200,
    buyPricePi: 5.0,
    requiredLevel: 8,
    xpReward: 100,
    productionTimeSec: 0,
    outputQuantity: 0,
    auraBuff: {
      type: 'cost_reduction',
      value: 0.15,
      radius: 2,
      targetCategories: ['building'],
      description: 'يقلل تكلفة تشغيل المباني المحيطة بنسبة 15%'
    }
  },
  obelisk: {
    id: 'obelisk',
    name: 'مسلة النصر العظيمة',
    category: 'decoration',
    image: '/obelisk-removebg-preview.png',
    productName: 'طاقة نصر',
    gridSize: { width: 1, height: 1 },
    requiresPedestal: true,
    buyPriceGold: 2000,
    buyPricePi: 10.0,
    requiredLevel: 12,
    xpReward: 200,
    productionTimeSec: 0,
    outputQuantity: 0,
    auraBuff: {
      type: 'yield_boost',
      value: 0.20,
      radius: 3,
      targetCategories: ['crop', 'tree', 'animal', 'aquaculture'],
      description: 'يزيد إنتاج الحقول والحيوانات المحيطة بنسبة 20%'
    }
  },
  feed_bowl: {
    id: 'feed_bowl',
    name: 'حوض إطعام المواشي',
    category: 'decoration',
    image: '/feed_bowl.png',
    productName: 'صحة وحيوية',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 70,
    requiredLevel: 3,
    xpReward: 10,
    productionTimeSec: 0,
    outputQuantity: 0
  },
  wooden_cart: {
    id: 'wooden_cart',
    name: 'عربة النقل الخشبية',
    category: 'decoration',
    image: '/wooden_cart.png',
    productName: 'تسريع اللوجستيات',
    gridSize: { width: 1, height: 1 },
    buyPriceGold: 120,
    requiredLevel: 4,
    xpReward: 15,
    productionTimeSec: 0,
    outputQuantity: 0
  }
};