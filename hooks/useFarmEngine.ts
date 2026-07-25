import { useState, useEffect, useCallback } from 'react';
import { PlacedItem, FarmState } from '../lib/farm-types';
import { LAND_CONTRACTS } from '../lib/gameData';

export function useFarmEngine(initialGold: number = 2570, initialPi: number = 0.15) {
  const [gold, setGold] = useState<number>(initialGold);
  const [pi, setPi] = useState<number>(initialPi);
  
  const [farmState, setFarmState] = useState<FarmState>({
    gridColumns: 8,
    gridRows: 8,
    placedItems: [],
    selectedItemForAction: null,
    isRelocating: false,
    isDiwanModalOpen: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setFarmState((prev) => ({
        ...prev,
        placedItems: prev.placedItems.map((item) => {
          if (item.type === 'decoration' || item.assetId === 'diwan') return item;
          const elapsedSeconds = (now - item.lastHarvestTime) / 1000;
          if (elapsedSeconds >= item.productionDuration && !item.isReadyToHarvest) {
            return { ...item, isReadyToHarvest: true };
          }
          return item;
        }),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleItemClick = useCallback((item: PlacedItem) => {
    if (item.assetId === 'diwan') {
      setFarmState((prev) => ({ ...prev, isDiwanModalOpen: true }));
      return;
    }
    if (item.isReadyToHarvest) {
      harvestItem(item);
      return;
    }
    setFarmState((prev) => ({
      ...prev,
      selectedItemForAction: item,
      isRelocating: false,
    }));
  }, []);

  const harvestItem = (item: PlacedItem) => {
    if (item.yieldType === 'gold') setGold((g) => g + item.yieldAmount);
    if (item.yieldType === 'pi') setPi((p) => Number((p + item.yieldAmount).toFixed(2)));
    
    setFarmState((prev) => ({
      ...prev,
      placedItems: prev.placedItems.map((el) =>
        el.instanceId === item.instanceId
          ? { ...el, lastHarvestTime: Date.now(), isReadyToHarvest: false }
          : el
      ),
    }));
  };

  const startRelocating = () => {
    setFarmState((prev) => ({ ...prev, isRelocating: true }));
  };

  const confirmRelocation = (newX: number, newY: number) => {
    setFarmState((prev) => {
      if (!prev.selectedItemForAction) return prev;
      return {
        ...prev,
        placedItems: prev.placedItems.map((item) =>
          item.instanceId === prev.selectedItemForAction?.instanceId
            ? { ...item, gridX: newX, gridY: newY }
            : item
        ),
        selectedItemForAction: null,
        isRelocating: false,
      };
    });
  };

  const handleRemoveAndRefund = () => {
    setFarmState((prev) => {
      const target = prev.selectedItemForAction;
      if (!target) return prev;
      setGold((g) => g + target.refundGold);
      setPi((p) => Number((p + target.refundPi).toFixed(2)));
      return {
        ...prev,
        placedItems: prev.placedItems.filter((item) => item.instanceId !== target.instanceId),
        selectedItemForAction: null,
      };
    });
  };

  const buyLandExpansion = (contractId: string) => {
    const contract = LAND_CONTRACTS.find((c) => c.id === contractId);
    if (!contract) return;
    if (gold < contract.price || pi < contract.piPrice) {
      alert('رصيدك لا يكفي لإتمام عقد التوسعة!');
      return;
    }
    setGold((g) => g - contract.price);
    setPi((p) => Number((p - contract.piPrice).toFixed(2)));
    const [newWidth, newHeight] = contract.size.split('x').map(Number);
    setFarmState((prev) => ({
      ...prev,
      gridColumns: newWidth,
      gridRows: newHeight,
      isDiwanModalOpen: false,
    }));
  };

  return {
    gold,
    pi,
    farmState,
    setFarmState,
    handleItemClick,
    startRelocating,
    confirmRelocation,
    handleRemoveAndRefund,
    buyLandExpansion,
  };
}