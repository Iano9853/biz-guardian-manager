export interface StockItem {
  id: string;
  itemName: string;
  brand: string;
  quantity: number;
  amount: number;
  shop: 'boutique' | 'house-decor';
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  itemName: string;
  brand: string;
  quantitySold: number;
  saleAmount: number;
  employeeId: string;
  employeeName: string;
  shop: 'boutique' | 'house-decor';
  timestamp: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export type Shop = 'boutique' | 'house-decor';

export const SHOP_NAMES = {
  'boutique': '👗 Boutique',
  'house-decor': '🛋️ House Décor'
} as const;