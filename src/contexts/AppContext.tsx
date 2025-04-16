
import { createContext, useContext } from "react";
import { GiftCode } from "../types";

// Define the context type with all required properties and functions from all the modules
export interface AppContextValue {
  // All the properties and methods from all the module contexts combined
  storeName: string;
  setStoreName: (name: string) => void;
  
  // From ProductContext
  products: any[];
  addProduct: (product: any) => Promise<any>;
  editProduct: (id: string, product: any) => Promise<any>;
  removeProduct: (id: string) => Promise<boolean>;
  getProductByCustomId: (customId: string) => any | undefined;
  
  // From CategoryContext
  categories: any[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  editCategory: (id: string, name: string) => void;
  
  // From CartContext
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  resetCart: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  
  // From GiftCodeContext
  giftCodes: GiftCode[];
  addGiftCode: (code: Omit<GiftCode, 'id' | 'createdAt'>) => void;
  applyGiftCode: (code: GiftCode) => void;
  appliedGiftCode: GiftCode | null;
  findAndApplyGiftCode?: (code: string) => boolean;
  
  // From UserContext
  user: any | null;
  users: any[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, securityQuestion: any) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  resetPassword: (username: string, newPassword: string) => void;
  getUserSecurityQuestion: (username: string) => string | null;
  verifySecurityAnswer: (username: string, answer: string) => boolean;
  checkLoginRateLimit: () => { limited: boolean; remainingTime: number };
  deleteUser: (userId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  
  // From AdminContext
  addAdmin: (userId: string) => void;
  updateAdminPermissions: (userId: string, permissions: any) => void;
  
  // From CommentContext
  addComment: (productId: string, text: string) => void;
  addReply: (commentId: string, text: string) => void;
  getCommentsForProduct: (productId: string) => any[];
  
  // From PurchaseContext
  purchases: any[];
  addPurchase: (items?: any[], total?: number, shippingAddressId?: string) => void;
  loadPurchases: () => Promise<void>;
  loading: boolean;
}

// Create the context with default value
export const AppContext = createContext<AppContextValue>({} as AppContextValue);

// Create the hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
