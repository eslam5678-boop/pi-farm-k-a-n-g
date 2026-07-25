export type AssetCategory = 
  | 'crop' 
  | 'tree' 
  | 'animal' 
  | 'aquaculture' 
  | 'building' 
  | 'decoration' 
  | 'equipment' 
  | 'soil' 
  | 'seed'
  | 'factory'; // <-- (تمت الإضافة) لدعم نوع المصانع وحل خطأ السطر 56

export type BuffType = 
  | 'yield_boost' 
  | 'time_reduction' 
  | 'cost_reduction' 
  | 'quality_boost' 
  | 'worker_blessing';

// --- (جديد) تعريفات حالات الأرض الزراعية ومراحل النمو ---
export type SoilState = 'raw' | 'plowed' | 'watered' | 'planted';
export type GrowthStage = 0 | 1 | 2 | 3;

// --- (جديد) تصنيفات الندرة للأصول والمحاصيل والمنتجات ---
export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

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
  gridSize?: { width: number; height: number };
  requiresPedestal?: boolean;
  buyPriceGold?: number;
  buyPricePi?: number;
  sellPriceGold?: number;
  requiredLevel?: number;
  xpReward?: number;
  productionTimeSec?: number;
  outputQuantity?: number;
  yieldAmount?: number;
  maintenanceCostGold?: number;
  auraBuff?: AuraBuff;

  // --- إضافات نظام الندرة والـ NFT (اختيارية لعدم التأثير على الأصول القديمة) ---
  rarity?: RarityTier;            // تصنيف ندرة الأصل
  isNftEligible?: boolean;         // هل يمكن صك هذا الأصل كـ NFT على Pi Network؟
  nftMintPricePi?: number;         // رسوم الصك الملكي بعملة Pi
}

export interface ProductionRecipe {
  id: string;
  buildingId: string;
  outputName: string;
  outputImage: string;
  inputs: { assetId: string; quantity: number }[];
  outputGoldValue: number;
  outputPiValue?: number;
  craftTimeSec: number;
  xpGranted: number;
  requiredLevel: number;
  
  // --- إضافات نظام الندرة للمنتجات المصنعة ---
  outputRarity?: RarityTier;       // ندرة المنتج المستخرج (مثلاً: خبز ملكي أسطوري)
}

export interface LandContract {
  id?: string;
  name: string;
  description?: string;
  requiredLevel?: number;
  costGold?: number;
  costPi?: number;
  gridDimensions?: { rows: number; cols: number };
  storageBonus?: number;
  marketFeeDiscount?: number;
}

export interface StakingTier {
  id: string;
  name: string;
  stakedPiAmount: number;
  durationDays: number;
  rewardType: 'global_speed_boost' | 'rare_seeds' | 'gold_bonus' | 'storage_expansion';
  rewardValue: number;
}

export interface PlayerStats {
  gold: number;
  pi: number;
  level: number;
  xp: number;
  maxXp: number;
  energy: number;
  maxEnergy: number;
  inventory: Record<string, number>;

  // --- إضافات بيانات محفظة Pi Network ومقتنيات الـ NFT ---
  walletAddress?: string;          // عنوان محفظة Pi الخاصة باللاعب
  mintedNftsCount?: number;        // عدد الـ NFTs التي يمتلكها اللاعب في مملكته
}

export interface PlacedItem {
  uid: string;
  assetId: string;
  x: number;
  y: number;
  type: AssetCategory;
  health: number;
  lastHarvestTime?: number;
  buffActive?: boolean;
  plantedSeedId?: string | null;
  plantedAt?: number | null;

  // --- إضافات نظام الزراعة الحقيقي (Hay Day Style) ---
  soilState?: SoilState;           // حالة التربة (خام -> محروثة -> مروية -> مزروعة)
  growthStage?: GrowthStage;       // مرحلة النمو (0: بذور، 1: برعم، 2: متوسط، 3: جاهز للحصاد)
  isWatered?: boolean;             // هل الأرض مروية؟
  lastWateredAt?: number | null;   // وقت آخر رش مياه

  // --- إضافات نظام الحيوانات المتقدم ---
  hunger?: number;                 // نسبة الجوع (من 0 إلى 100)
  thirst?: number;                 // نسبة العطش (من 0 إلى 100)
  isSleeping?: boolean;            // هل الحيوان نائم؟
  isSick?: boolean;                // هل الحيوان مريض؟
  diseaseType?: string | null;     // نوع المرض (إن وجد)
  pregnancyTimer?: number | null;  // عداد التكاثر والحمل
  isFed?: boolean;                 // (تمت الإضافة) هل الحيوان شبعان؟

  // --- (جديد) إضافات طابور التصنيع للمباني الإنتاجية ---
  activeCrafts?: CraftingQueueItem[]; // طابور المنتجات التي يتم تصنيعها حالياً داخل المبنى

  // --- (جديد) إضافات الـ NFT للأصول الموضوعة على الأرض ---
  isMintedNft?: boolean;               // هل هذا المبنى/التمثال تم تحويله لـ NFT حقيقي؟
  nftTokenId?: string;                 // معرف الرمز المميز (Token ID) على البلوكشين

  // --- (تمت الإضافة) خصائص المصانع ومباني الإنتاج لحل أخطاء ts(2339) و ts(2353) ---
  currentRecipeId?: string | null;
  status?: 'idle' | 'producing' | 'paused_missing_resources' | 'ready_to_harvest' | string;
  progress?: number;
  timeRemaining?: number;
  totalProductionTime?: number;
  [key: string]: any; // سطر أمان يمنع أي أخطاء للخصائص الديناميكية مستقبلاً
}

export interface Worker {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  stamina: number;
  status: 'walking' | 'working' | 'resting' | 'carrying';
  image: string;
  currentTask?: string;

  // --- إضافات نظام العمال المتقدم ---
  level?: number;                  // مستوى العامل
  xp?: number;                     // خبرة العامل
  speed?: number;                  // سرعة حركته وإنجازه
  salaryGold?: number;             // الراتب اليومي بالذهب
  hunger?: number;                 // نسبة الجوع
  restTimer?: number;              // وقت الراحة المتبقي
}

// ============================================================================
// --- (جديد) واجهات نظام التصنيع، القوافل التجارية، وصك الـ NFTs ---
// ============================================================================

// 1. عنصر في طابور الإنتاج داخل المصنع أو المخبز
export interface CraftingQueueItem {
  queueId: string;                 // معرف فريد للعملية
  recipeId: string;                // معرف الوصفة المستخدمة من ProductionRecipe
  startTime: number;               // وقت بدء التصنيع
  endTime: number;                 // وقت انتهاء التصنيع ونضج المنتج
  isCompleted: boolean;            // هل اكتمل التصنيع وجاهز للجمع؟
}

// 2. متطلبات كل منتج داخل طلبات القوافل التجارية
export interface OrderItemRequirement {
  itemName: string;                // اسم المنتج المطلوب (متطابق مع مفاتيح الـ inventory)
  quantityRequired: number;        // الكمية المطلوبة
}

// 3. طلبات قوافل التجارة الملكية (لاستهلاك المنتجات وحفظ توازن الاقتصاد)
export interface TradeOrder {
  id: string;
  title: string;                   // عنوان الطلب (مثال: "إمدادات معبد الكرنك")
  description?: string;
  clientName: string;              // اسم الجهة الطالبة (مثال: "تجار النوبة"، "كهنة آمون")
  clientImage?: string;            // صورة المعبرة عن القافلة
  requirements: OrderItemRequirement[]; // قائمة المحاصيل والمنتجات المطلوبة
  rewardGold: number;              // مكافأة الذهب عند التسليم
  rewardPi: number;                // مكافأة عملات Pi عند التسليم
  rewardXp: number;                // مكافأة الخبرة
  rewardSpecialItem?: string;      // مكافأة نادرة إضافية (مثال: "ختم ملكي"، "حجر بناء")
  timeRemainingSec: number;        // الوقت المتبقي لمغادرة القافلة
  expiresAt: number;               // الطابع الزمني لانتهاء صلاحية الطلب
  isCompleted: boolean;            // هل تم تسليم الطلب؟
  rarity: RarityTier;              // أهمية الطلب (عادي، نادر، أسطوري)
}

// 4. بيانات الـ NFT للأصول والقطع الأسطورية (المحولة على شبكة Pi)
export interface NftMetadata {
  tokenId: string;                 // رقم التوكن الفريد على الشبكة
  assetId: string;                 // معرف الأصل الأصلي من GameAsset
  name: string;                    // اسم الـ NFT (مثال: "تمثال القط باستيت الذهبي #104")
  description: string;
  image: string;
  rarity: RarityTier;              // يجب أن يكون 'legendary' أو 'epic' في الغالب
  mintedAt: number;                // تاريخ الصك
  mintedBy: string;                // عنوان محفظة اللاعب الذي صك القطعة
  piMintFee: number;               // التكلفة التي دفعت بالـ Pi لصك هذا الرمز
  attributes: {                    // خصائص إضافية تميز القطعة (تفيد في الـ Buffs في الأرض)
    trait_type: string;
    value: string | number;
  }[];
}

// 5. حالة طلب صك الـ NFT أثناء الاتصال بمحفظة Pi Wallet
export interface NftMintRequest {
  requestId: string;
  assetId: string;
  targetItemUid: string;           // الـ uid الخاص بالعنصر الموضوع في المزرعة
  status: 'idle' | 'pending_approval' | 'processing_mint' | 'completed' | 'failed';
  txHash?: string;                 // تجزئة المعاملة (Transaction Hash) على البلوكشين
  errorMessage?: string;
  createdAt: number;
}