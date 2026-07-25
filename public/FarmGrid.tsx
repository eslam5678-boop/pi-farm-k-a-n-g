'use client';

import React, { useState, useEffect } from 'react';
import { PlacedItem, Worker } from '../types';
import { GAME_ASSETS } from '../lib/gameData';

interface FarmGridProps {
  items: PlacedItem[];
  onSelectItem: (item: PlacedItem) => void;
  onPlaceTileClick: (x: number, y: number) => void;
}

export default function FarmGrid({ items, onSelectItem, onPlaceTileClick }: FarmGridProps) {
  const gridSize = 8; // شبكة 8x8 متلاحمة بدون مسافات

  // عمال متحركين بسلاسة على أرض المزرعة
  const [workers, setWorkers] = useState<Worker[]>([
    { id: 'w1', name: 'عامل الري', x: 2, y: 2, targetX: 6, targetY: 2, stamina: 85, status: 'walking', image: '/worker_walk.png' },
    { id: 'w2', name: 'عامل الحصاد', x: 5, y: 5, targetX: 1, targetY: 5, stamina: 90, status: 'walking', image: '/worker_water.png' },
    { id: 'w3', name: 'عم شاهين', x: 0, y: 0, targetX: 4, targetY: 4, stamina: 100, status: 'walking', image: '/shaheen.png' }
  ]);

  // تحريك العمال بهدوء وسلاسة (بدون قفز)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) => {
          const dx = w.targetX - w.x;
          const dy = w.targetY - w.y;
          if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            return {
              ...w,
              targetX: Math.floor(Math.random() * (gridSize - 1)),
              targetY: Math.floor(Math.random() * (gridSize - 1)),
              status: 'walking'
            };
          }
          return {
            ...w,
            x: w.x + dx * 0.04,
            y: w.y + dy * 0.04
          };
        })
      );
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // معادلة المنظور الأيسومتري المتلاحم (بدون أي فراغات بين المربعات)
  const getIsometricStyle = (x: number, y: number, isAsset = false, width = 1, height = 1) => {
    const tileWidth = 100;
    const tileHeight = 50;
    const originX = 380; // منتصف الخريطة أفقياً
    const originY = 120; // نقطة البداية علوياً

    // حسابات التلاحم الدقيق
    const isoX = originX + (x - y) * (tileWidth / 2);
    const isoY = originY + (x + y) * (tileHeight / 2);
    const zIndex = Math.floor(x + y + (isAsset ? 10 : 0));

    return {
      left: `${isoX}px`,
      top: `${isoY}px`,
      zIndex: zIndex,
      transition: isAsset ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'left 0.4s linear, top 0.4s linear'
    };
  };

  return (
    <div className="relative w-full h-[680px] bg-[#1e130b] overflow-hidden rounded-3xl border-4 border-[#d4af37] shadow-2xl p-4 select-none">
      {/* خلفية السماء الملكية والشعلات */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center z-0 pointer-events-none opacity-60">
        <img src="/decoration_torch.png" alt="torch" className="w-10 h-14 animate-pulse object-contain" />
        <span className="text-[#d4af37] font-black text-lg tracking-widest drop-shadow-md">مملكة باي الفرعونية - PI KINGDOM FARM</span>
        <img src="/decoration_torch.png" alt="torch" className="w-10 h-14 animate-pulse object-contain" />
      </div>

      {/* منطقة الأرضية والشبكة المتلاحمة */}
      <div className="relative w-full h-full">
        {Array.from({ length: gridSize }).map((_, x) =>
          Array.from({ length: gridSize }).map((_, y) => {
            const style = getIsometricStyle(x, y);
            return (
              <div
                key={`tile-${x}-${y}`}
                onClick={() => onPlaceTileClick(x, y)}
                style={style}
                className="absolute w-[100px] h-[50px] cursor-pointer group hover:brightness-125 transition-all duration-150"
              >
                {/* أرضية رملية متلاحمة بنسبة 100% بدون حواف فارغة */}
                <img
                  src="/sand_tile.png"
                  alt="ground"
                  className="w-full h-full object-cover block drop-shadow-sm pointer-events-none"
                />
                <div className="absolute inset-0 border-[0.5px] border-amber-900/20 group-hover:border-[#d4af37] transition-colors pointer-events-none" />
              </div>
            );
          })
        )}

        {/* المباني والأصول الملكية */}
        {items.map((item) => {
          const asset = GAME_ASSETS[item.assetId];
          if (!asset) return null;
          const style = getIsometricStyle(item.x, item.y, true, asset.gridSize.width, asset.gridSize.height);

          return (
            <div
              key={item.uid}
              onClick={() => onSelectItem(item)}
              style={style}
              className="absolute cursor-pointer transform -translate-x-1/4 -translate-y-2/3 hover:scale-105 transition-transform duration-200 group"
            >
              {/* القاعدة الحجرية الملكية للمذابح والتماثيل */}
              {asset.requiresPedestal && (
                <img
                  src="/pedestal.png"
                  alt="pedestal"
                  className="absolute -bottom-2 -left-2 w-[115px] h-auto z-0 drop-shadow-md pointer-events-none"
                />
              )}

              {/* صورة المبنى أو الحيوان من مجلد public */}
              <img
                src={asset.image}
                alt={asset.name}
                className="relative z-10 w-[110px] h-auto object-contain drop-shadow-2xl pointer-events-none"
              />

              {/* شريط صحة المواشي */}
              {item.type === 'animal' && (
                <div className="absolute -top-4 left-4 w-16 bg-black/80 rounded-full h-2.5 border border-[#d4af37] overflow-hidden z-20 flex">
                  <div
                    className={`h-full ${item.health > 50 ? 'bg-green-500' : 'bg-red-600'} transition-all`}
                    style={{ width: `${item.health}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* العمال وعم شاهين أثناء التجول */}
        {workers.map((worker) => {
          const style = getIsometricStyle(worker.x, worker.y, true);
          return (
            <div
              key={worker.id}
              style={style}
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-30"
            >
              <img
                src={worker.image}
                alt={worker.name}
                className="w-14 h-14 object-contain drop-shadow-lg"
              />
              <span className="absolute -bottom-3 left-0 right-0 text-center bg-black/80 text-[#f9e8a2] text-[9px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap border border-amber-600/60 shadow">
                {worker.name} ⚡{worker.stamina}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}