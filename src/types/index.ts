
export interface Product {
  id: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  detailedDescription?: string;
  images: string[];
  category?: string;
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
  password: string;
  isAdmin: boolean;
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  text: string;
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  text: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  username: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}
