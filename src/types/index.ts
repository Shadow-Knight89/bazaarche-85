
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
  customId?: string; // For custom product URLs
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  isDefault: boolean;
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

export interface AdminPermissions {
  manageProducts: boolean;
  manageCategories: boolean;
  manageGiftCodes: boolean;
  manageUsers: boolean;
  viewPurchases: boolean;
  manageComments: boolean;
  customPrefix?: string;
  customPrefixColor?: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface LoginAttempt {
  ip: string;
  timestamp: number;
  count: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  adminPermissions?: AdminPermissions;
  securityQuestion?: SecurityQuestion;
  isBanned?: boolean;
  canComment?: boolean;
  lastLoginAttempt?: number; // Timestamp for rate limiting
  failedLoginAttempts?: number; // Count of failed attempts
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  adminPrefix?: string;
  adminPrefixColor?: string;
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
  adminPrefix?: string;
  adminPrefixColor?: string;
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
  shippingAddress?: ShippingAddress;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface UserCarts {
  [userId: string]: CartItem[];
}
