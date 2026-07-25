export type ResourceType = 'gold' | 'pi' | 'wheat' | 'milk' | 'wool' | 'eggs' | 'bread' | 'cheese';

export interface PlacedItem {
  instanceId: string;
  assetId: string;
  name: string;
  type: 'building' | 'animal' | 'crop' | 'decoration' | 'equipment';
  gridX: number;
  gridY: number;
  gridSize: { width: number; height: number };
  lastHarvestTime: number;
  productionDuration: number;
  yieldAmount: number;
  yieldType: ResourceType;
  isReadyToHarvest: boolean;
  refundGold: number;
  refundPi: number;
}

export interface FarmState {
  gridColumns: number;
  gridRows: number;
  placedItems: PlacedItem[];
  selectedItemForAction: PlacedItem | null;
  isRelocating: boolean;
  isDiwanModalOpen: boolean;
}