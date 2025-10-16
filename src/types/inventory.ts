export interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: ItemCategory;
  location: string;
  quantity?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface InventoryLocation {
  id: string;
  name: string;
  code: string;
  region: string;
}

// Sample categories based on your data
export const ITEM_CATEGORIES: ItemCategory[] = [
  { id: 'CAT001', name: 'ITEM BOXES', description: 'Boxed items and containers', color: 'blue' },
  { id: 'CAT002', name: 'ITEM SACKS', description: 'Sack items and bags', color: 'green' },
  { id: 'CAT003', name: 'ITEM BASINS', description: 'Basin items and containers', color: 'purple' },
  { id: 'CAT004', name: 'MIRITIN', description: 'Miritin related items', color: 'orange' },
  { id: 'CAT005', name: 'PAIN KILLER', description: 'Pain killer related items', color: 'red' },
];

// Sample locations based on your data
export const INVENTORY_LOCATIONS: InventoryLocation[] = [
  { id: 'LOC001', name: 'Embu', code: 'EMB', region: 'Embu County' },
  { id: 'LOC002', name: 'Malindi', code: 'MAL', region: 'Kilifi County' },
  { id: 'LOC003', name: 'Samburu', code: 'SAM', region: 'Samburu County' },
];
