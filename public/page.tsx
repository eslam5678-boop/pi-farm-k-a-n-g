"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast, Toaster } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { AssetTemplate, MyAsset } from "@/types";

// --- قاعدة بيانات الأصول الملكية المتاحة في اللعبة ---
const ALL_ASSETS_TEMPLATES: AssetTemplate[] = [
  { id: 1, name: { ar: "دجاج فرعوني", en: "Pharaoh Chicken" }, type: "طيور", costGold: 50, costPi: 0, output: { ar: "بيض ملكي", en: "Royal Eggs" }, incomeGold: 12, incomePi: 0, icon: "🐓", imagePath: "https://i.ibb.co/HpggcwZj/chicken.png", duration: 8 },
  { id: 2, name: { ar: "بقرة مقدسة", en: "Sacred Cow" }, type: "مواشي", costGold: 150, costPi: 0, output: { ar: "حليب", en: "Milk" }, incomeGold: 30, incomePi: 0, icon: "🐄", imagePath: "https://i.ibb.co/j98jzsfb/cow.png", duration: 12 },
  { id: 4, name: { ar: "بط فرعوني", en: "Pharaoh Duck" }, type: "طيور", costGold: 80, costPi: 0, output: { ar: "ريش", en: "Feather" }, incomeGold: 15, incomePi: 0, icon: "🦆", imagePath: "https://i.ibb.co/W4w4HqXT/duck.png", duration: 10 },
  { id: 5, name: { ar: "صقر حورس", en: "Horus Falcon" }, type: "طيور", costGold: 200, costPi: 5, output: { ar: "ذهب", en: "Gold" }, incomeGold: 50, incomePi: 1, icon: "🦅", imagePath: "https://i.ibb.co/YFSC2Ry5/falcon.png", duration: 20 },
  { id: 6, name: { ar: "نعامة ملكية", en: "Royal Ostrich" }, type: "طيور", costGold: 300, costPi: 2, output: { ar: "ريش فاخر", en: "Luxury Feather" }, incomeGold: 60, incomePi: 0, icon: "🐦", imagePath: "https://i.ibb.co/RTBynr8n/ostrich.png", duration: 24 },
  { id: 7, name: { ar: "خروف فرعوني", en: "Pharaoh Sheep" }, type: "مواشي", costGold: 120, costPi: 0, output: { ar: "صوف", en: "Wool" }, incomeGold: 25, incomePi: 0, icon: "🐑", imagePath: "https://i.ibb.co/9kMVhxsX/sheep.png", duration: 15 },
  { id: 8, name: { ar: "طاحونة الرياح", en: "Windmill" }, type: "مبنى", costGold: 500, costPi: 10, output: { ar: "دقيق", en: "Flour" }, incomeGold: 100, incomePi: 2, icon: "🌬️", imagePath: "https://i.ibb.co/ZRRFTS2T/windmill.jpg", duration: 40 },
  { id: 14, name: { ar: "مصنع الألبان", en: "Dairy Factory" }, type: "مبنى", costGold: 800, costPi: 15, output: { ar: "جبن", en: "Cheese" }, incomeGold: 180, incomePi: 4, icon: "🥛", imagePath: "https://i.ibb.co/fYgt9xVv/dairy-factory.png", duration: 36 },
  { id: 15, name: { ar: "مخبز فرعوني", en: "Pharaoh Bakery" }, type: "مبنى", costGold: 700, costPi: 12, output: { ar: "خبز", en: "Bread" }, incomeGold: 160, incomePi: 3, icon: "🍞", imagePath: "https://i.ibb.co/nqK36vY5/bakery.png", duration: 30 },
];

// --- تعريف نقاط النقر (Hotspots) فوق اللوحة الفنية الملكية ---
interface Hotspot {
  id: string;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
  top: string;
  left: string;
  width: string;
  height: string;
  categoryModal: "طيور" | "مواشي" | "مبنى" | "reward" | "ledger" | "guide";
}

const KINGDOM_HOTSPOTS: Hotspot[] = [
  {
    id: "goddess_statue",
    title: { ar: "✨ تمثال الخصب الملكي", en: "✨ Goddess Statue" },
    subtitle: { ar: "اضغط لجمع الذهب المتناثر وعوائد الـ Pi التلقائية", en: "Click to collect scattered gold & Pi yield" },
    top: "32%",
    left: "54%",
    width: "18%",
    height: "46%",
    categoryModal: "reward"
  },
  {
    id: "livestock_pen",
    title: { ar: "🐄 حظيرة المواشي والنعام", en: "🐄 Livestock & Ostrich Pen" },
    subtitle: { ar: "إدارة وشراء الأبقار الملكية والأغنام والنعام", en: "Manage & buy sacred cows, sheep, and ostriches" },
    top: "48%",
    left: "18%",
    width: "30%",
    height: "32%",
    categoryModal: "مواشي"
  },
  {
    id: "storage_barn",
    title: { ar: "🏺 ديوان الطيور والمحاصيل", en: "🏺 Birds & Harvest Barn" },
    subtitle: { ar: "تربية الدجاج الملكي والبط وصقور حورس", en: "Breed pharaoh chickens, ducks, and Horus falcons" },
    top: "18%",
    left: "6%",
    width: "28%",
    height: "30%",
    categoryModal: "طيور"
  },
  {
    id: "royal_kitchen",
    title: { ar: "🍳 مطبخ ومطعم ديوان السلع", en: "🍳 Royal Bakery & Kitchen" },
    subtitle: { ar: "بناء المخابز الفرعونية ومصانع الألبان وطواحين الرياح", en: "Build bakeries, dairy factories, and windmills" },
    top: "28%",
    left: "75%",
    width: "22%",
    height: "38%",
    categoryModal: "مبنى"
  },
  {
    id: "live_ledger",
    title: { ar: "📜 سجل البلوكشين (Live Ledger)", en: "📜 Live Blockchain Ledger" },
    subtitle: { ar: "توثيق ملكية الـ NFTs وعقود المزرعة على Pi Network", en: "Verify NFT ownership and smart contracts on Pi Network" },
    top: "68%",
    left: "78%",
    width: "18%",
    height: "26%",
    categoryModal: "ledger"
  },
  {
    id: "pharaoh_guide",
    title: { ar: "👑 الفرعون المرشد", en: "👑 Pharaoh Guide" },
    subtitle: { ar: "مهام العزبة اليومية وإرشادات تطوير الاقتصاد الرقمي", en: "Daily tasks and Web3 economic guidance" },
    top: "62%",
    left: "2%",
    width: "16%",
    height: "35%",
    categoryModal: "guide"
  }
];

export default function InteractiveKingdomPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [gold, setGold] = useState<number>(2500);
  const [pi, setPi] = useState<number>(45.50);
  const [myAssets, setMyAssets] = useState<MyAsset[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // --- تحديث تقدم الإنتاج للأصول المملوكة ---
  useEffect(() => {
    const interval = setInterval(() => {
      setMyAssets(prev =>
        prev.map(asset => {
          const timePassed = Date.now() - asset.lastHarvest;
          const durationInMs = asset.duration * 60 * 1000;
          const progress = Math.min(100, (timePassed / durationInMs) * 100);
          return { ...asset, progress };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- التعامل مع الضغط على المناطق الحية في الصورة ---
  const handleHotspotClick = (spot: Hotspot) => {
    if (spot.categoryModal === "reward") {
      const bonusGold = 150;
      const bonusPi = 0.5;
      setGold(g => g + bonusGold);
      setPi(p => p + bonusPi);
      toast.success(
        lang === "ar" 
          ? `🎉 تم جمع +${bonusGold} 🪙 و +${bonusPi} Pi من الغبار الملكي!` 
          : `🎉 Collected +${bonusGold} 🪙 and +${bonusPi} Pi from Royal Dust!`,
        { style: { background: "#c5a059", color: "#000", fontWeight: "bold" } }
      );
    } else {
      setActiveModal(spot.categoryModal);
    }
  };

  // --- شراء أصل جديد وإضافته للمزرعة ---
  const handleBuyAsset = (template: AssetTemplate) => {
    if (gold >= template.costGold && pi >= template.costPi) {
      const newAsset: MyAsset = {
        ...template,
        instanceId: uuidv4(),
        hunger: 100,
        status: "نشط",
        progress: 0,
        offsetX: 0,
        offsetY: 0,
        lastHarvest: Date.now()
      };
      setMyAssets(prev => [...prev, newAsset]);
      setGold(g => g - template.costGold);
      setPi(p => p - template.costPi);
      toast.success(lang === "ar" ? `تم شراء ${template.name.ar} بنجاح!` : `Successfully bought ${template.name.en}!`);
    } else {
      toast.error(lang === "ar" ? "رصيدك الملكي لا يكفي لإتمام الشراء!" : "Insufficient funds to complete purchase!");
    }
  };

  // --- حصاد الإنتاج ---
  const handleHarvest = (instanceId: string) => {
    setMyAssets(prev =>
      prev.map(asset => {
        if (asset.instanceId === instanceId && asset.progress >= 100) {
          setGold(g => g + asset.incomeGold);
          setPi(p => p + asset.incomePi);
          toast.success(
            lang === "ar" 
              ? `تم حصاد ${asset.output.ar} (+${asset.incomeGold}🪙 | +${asset.incomePi} Pi)` 
              : `Harvested ${asset.output.en} (+${asset.incomeGold}🪙 | +${asset.incomePi} Pi)`
          );
          return { ...asset, progress: 0, lastHarvest: Date.now() };
        }
        return asset;
      })
    );
  };

  // --- فلترة الأصول للنافذة المنبثقة الحالية ---
  const currentModalAssets = useMemo(() => {
    if (!activeModal || ["reward", "ledger", "guide"].includes(activeModal)) return [];
    return ALL_ASSETS_TEMPLATES.filter(a => a.type === activeModal);
  }, [activeModal]);

  return (
    <div className="min-h-screen bg-[#0a0810] flex flex-col items-center justify-center p-2 font-sans select-none text-[#f3e5c8]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Toaster position="top-center" />

      {/* شريط الإحصائيات العلوي */}
      <header className="w-full max-w-[1200px] bg-gradient-to-r from-[#1c162e] via-[#35274c] to-[#1c162e] border-2 border-[#c5a059] rounded-2xl px-6 py-3 mb-3 flex items-center justify-between shadow-[0_0_25px_rgba(197,160,89,0.3)] z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-pulse">👑</span>
          <div>
            <h1 className="text-lg font-black tracking-wide text-[#ffd700]">Pi Kingdom Farm - Web3</h1>
            <p className="text-xs text-[#c5a059]">{lang === "ar" ? "العزبة الملكية التفاعلية الفاخرة" : "Interactive Royal Kingdom"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-black">
          <div className="bg-[#120e1f] px-4 py-1.5 rounded-xl border border-purple-500/50 flex items-center gap-2 shadow-inner">
            <span className="text-purple-400">🟪</span>
            <span>{pi.toFixed(2)} Pi</span>
          </div>
          <div className="bg-[#120e1f] px-4 py-1.5 rounded-xl border border-[#c5a059] flex items-center gap-2 shadow-inner text-[#ffd700]">
            <span>🪙</span>
            <span>{gold}</span>
          </div>
          <button 
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="bg-[#c5a059] hover:bg-[#ffd700] text-black px-3 py-1.5 rounded-xl text-xs transition-colors"
          >
            {lang === "ar" ? "English" : "عربي"}
          </button>
        </div>
      </header>

      {/* لوحة المملكة 3D التفاعلية */}
      <div className="relative w-full max-w-[1200px] aspect-[16/9] bg-[#161224] rounded-3xl overflow-hidden border-4 border-[#c5a059] shadow-[0_0_50px_rgba(0,0,0,0.9)] group">
        <img 
          src="/kingdom-farm.jpg" 
          alt="Pi Kingdom Farm 3D" 
          className="w-full h-full object-cover pointer-events-none"
        />

        <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-transparent transition-all duration-500" />

        {/* توزيع أزرار النقر (Hotspots) */}
        {KINGDOM_HOTSPOTS.map((spot) => (
          <div
            key={spot.id}
            onClick={() => handleHotspotClick(spot)}
            style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
            className="absolute cursor-pointer transition-all duration-300 rounded-3xl border-2 border-transparent hover:border-[#ffd700]/80 hover:bg-[#ffd700]/15 hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] flex items-end justify-center pb-2 group/spot"
          >
            <div className="opacity-0 group-hover/spot:opacity-100 transition-opacity duration-200 bg-[#120e1f]/95 border border-[#c5a059] px-3 py-1.5 rounded-xl text-center shadow-2xl pointer-events-none transform translate-y-2 group-hover/spot:translate-y-0 z-20">
              <p className="text-xs font-black text-[#ffd700] whitespace-nowrap">{lang === "ar" ? spot.title.ar : spot.title.en}</p>
              <p className="text-[9px] text-stone-300 max-w-[160px] leading-tight mt-0.5">{lang === "ar" ? spot.subtitle.ar : spot.subtitle.en}</p>
            </div>
          </div>
        ))}
      </div>

      {/* شريط الأصول المملوكة السريع في أسفل الشاشة (لحصاد الإنتاج مباشرة) */}
      {myAssets.length > 0 && (
        <div className="w-full max-w-[1200px] mt-3 bg-[#161224] border-2 border-[#c5a059] rounded-2xl p-3 flex items-center gap-3 overflow-x-auto shadow-lg">
          <span className="text-xs font-bold text-[#ffd700] whitespace-nowrap px-2">{lang === "ar" ? "أصولك الملكية:" : "Your Assets:"}</span>
          {myAssets.map((asset) => (
            <div key={asset.instanceId} className="bg-[#1f1933] border border-purple-500/30 rounded-xl p-2 flex items-center gap-2 min-w-[140px] justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{asset.icon}</span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-white">{lang === "ar" ? asset.name.ar : asset.name.en}</p>
                  <div className="w-16 bg-black/40 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div className="bg-[#ffd700] h-full transition-all duration-300" style={{ width: `${asset.progress}%` }} />
                  </div>
                </div>
              </div>
              {asset.progress >= 100 ? (
                <button 
                  onClick={() => handleHarvest(asset.instanceId)}
                  className="bg-[#ffd700] hover:bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded shadow animate-bounce"
                >
                  {lang === "ar" ? "حصاد!" : "Harvest!"}
                </button>
              ) : (
                <span className="text-[9px] text-stone-400 font-mono">{Math.round(asset.progress)}%</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* النوافذ المنبثقة لشراء الأصول من اللوحة (Modals) */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#2b221b] to-[#1c162e] border-4 border-[#c5a059] w-full max-w-2xl p-6 rounded-3xl shadow-[0_0_50px_rgba(197,160,89,0.5)] relative max-h-[80vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#c5a059]/40">
              <h3 className="text-xl font-black text-[#ffd700]">
                {activeModal === "مواشي" && (lang === "ar" ? "🐄 حظيرة المواشي والنعام" : "🐄 Livestock & Ostrich Pen")}
                {activeModal === "طيور" && (lang === "ar" ? "🏺 ديوان الطيور والمحاصيل" : "🏺 Birds & Harvest Barn")}
                {activeModal === "مبنى" && (lang === "ar" ? "🍳 ديوان المخابز والمصانع" : "🍳 Royal Bakery & Kitchen")}
                {activeModal === "ledger" && (lang === "ar" ? "📜 سجل البلوكشين وتوثيق العقود" : "📜 Blockchain Live Ledger")}
                {activeModal === "guide" && (lang === "ar" ? "👑 إرشادات الفرعون المرشد" : "👑 Pharaoh Guide")}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-white font-bold text-lg px-2">✕</button>
            </div>

            {/* محتوى النوافذ التعريفية (Ledger & Guide) */}
            {activeModal === "ledger" && (
              <div className="text-center py-6 space-y-4">
                <p className="text-sm text-stone-300">يتم تسجيل كل أصل تشتري في هذه المزرعة كـ <span className="text-[#ffd700] font-bold">NFT حقيقي</span> على شبكة Pi Network.</p>
                <div className="bg-[#120e1f] p-4 rounded-xl border border-purple-500/40 text-left font-mono text-xs text-purple-300">
                  <p>► Smart Contract: 0x8F9a...3c2E</p>
                  <p>► Network: Pi Testnet / Mainnet Ready</p>
                  <p>► Total Farm NFTs Owned: {myAssets.length}</p>
                </div>
              </div>
            )}

            {activeModal === "guide" && (
              <div className="text-sm text-stone-300 space-y-3 py-4 leading-relaxed">
                <p>💡 <strong className="text-[#ffd700]">نصيحة اليوم:</strong> قم بتطوير طواحين الرياح ومصانع الألبان للحصول على أعلى عائد يومي بعملة Pi.</p>
                <p>⚡ يمكنك جمع الذهب المجاني كل فترة بالضغط على تمثال الخصب في منتصف المزرعة.</p>
              </div>
            )}

            {/* قائمة شراء الأصول المرتبطة بالقسم */}
            {currentModalAssets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {currentModalAssets.map((asset) => (
                  <div key={asset.id} className="bg-[#181326] border border-[#c5a059]/50 rounded-2xl p-3 flex items-center justify-between hover:border-[#ffd700] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{asset.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">{lang === "ar" ? asset.name.ar : asset.name.en}</h4>
                        <p className="text-[11px] text-stone-400">
                          {lang === "ar" ? "الإنتاج:" : "Output:"} <span className="text-[#ffd700] font-bold">{lang === "ar" ? asset.output.ar : asset.output.en}</span>
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleBuyAsset(asset)}
                      className="bg-gradient-to-r from-[#ffd700] to-[#c5a059] hover:from-yellow-400 hover:to-yellow-600 text-black font-black text-xs px-3 py-2 rounded-xl shadow active:scale-95 transition-transform flex flex-col items-center"
                    >
                      <span>{lang === "ar" ? "شراء" : "Buy"}</span>
                      <span className="text-[10px] font-mono">{asset.costGold}🪙 | {asset.costPi}Pi</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setActiveModal(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-8 py-2.5 rounded-xl transition-colors"
              >
                {lang === "ar" ? "إغلاق والعودة للمملكة" : "Close & Return to Kingdom"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}