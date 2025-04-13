
export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  images: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface GiftCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isGlobal: boolean;
  isUsed: boolean;
  usedBy: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}
