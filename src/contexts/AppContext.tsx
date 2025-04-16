
import React, { createContext, useContext, ReactNode } from "react";
import { ProductProvider } from "./modules/product";
import { CategoryProvider } from "./modules/CategoryContext";
import { CartProvider } from "./modules/CartContext";
import { UserProvider } from "./modules/UserContext";
import { CommentProvider } from "./modules/CommentContext";
import { GiftCodeProvider } from "./modules/GiftCodeContext";
import { PurchaseProvider } from "./modules/PurchaseContext";
import { StoreProvider } from "./modules/StoreContext";

import { useProductContext } from "./modules/product";
import { useCategoryContext } from "./modules/CategoryContext";
import { useCartContext } from "./modules/CartContext";
import { useUserContext } from "./modules/UserContext";
import { useCommentContext } from "./modules/CommentContext";
import { useGiftCodeContext } from "./modules/GiftCodeContext";
import { usePurchaseContext } from "./modules/PurchaseContext";
import { useStoreContext } from "./modules/StoreContext";

import { GiftCode } from "../types";

// Define the context type with all required properties and functions from all the modules
interface AppContextType {
  // All the properties and methods from all the module contexts combined
  storeName: string;
  setStoreName: (name: string) => void;
  
  // From ProductContext
  products: any[];
  // Fix the return type to match the actual implementation
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
  giftCodes: any[];
  addGiftCode: (code: any) => void;
  applyGiftCode: (code: string) => boolean;
  appliedGiftCode: GiftCode | null;
  
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
  addPurchase: (items?: any[], total?: number) => void;
  loadPurchases: () => Promise<void>;
  loading: boolean;
}

// Create the context with default value
const AppContext = createContext<AppContextType>({} as AppContextType);

// Create the hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <StoreProvider>
      <UserProvider>
        <ProductProvider>
          <CategoryProvider>
            <CartProvider>
              <PurchaseProviderWrapper>
                <GiftCodeProviderWrapper>
                  <CommentProvider>
                    <CombinedProvider>
                      {children}
                    </CombinedProvider>
                  </CommentProvider>
                </GiftCodeProviderWrapper>
              </PurchaseProviderWrapper>
            </CartProvider>
          </CategoryProvider>
        </ProductProvider>
      </UserProvider>
    </StoreProvider>
  );
};

// Wrapper for PurchaseProvider to handle cart clearing
const PurchaseProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cart, calculateTotal, clearCart } = useCartContext();

  const handlePurchaseComplete = () => {
    clearCart();
  };

  return (
    <PurchaseProvider 
      onPurchaseComplete={handlePurchaseComplete}
    >
      {children}
    </PurchaseProvider>
  );
};

// Wrapper for GiftCodeProvider to handle applied gift code
const GiftCodeProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { applyGiftCode } = useCartContext();

  const handleApplyGiftCode = (giftCode: GiftCode) => {
    applyGiftCode(giftCode);
  };

  return (
    <GiftCodeProvider 
      onApplyGiftCode={handleApplyGiftCode}
    >
      {children}
    </GiftCodeProvider>
  );
};

// Combined provider that merges all context values
const CombinedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storeContext = useStoreContext();
  const productContext = useProductContext();
  const categoryContext = useCategoryContext();
  const cartContext = useCartContext();
  const userContext = useUserContext();
  const commentContext = useCommentContext();
  const giftCodeContext = useGiftCodeContext();
  const purchaseContext = usePurchaseContext();

  // Add purchase wrapper for backward compatibility
  const addPurchase = (items?: any[], totalAmount?: number) => {
    if (userContext.user) {
      const cart = items || cartContext.cart;
      if (cart.length > 0) {
        const { total } = totalAmount !== undefined ? { total: totalAmount } : cartContext.calculateTotal();
        purchaseContext.addPurchase(cart, total);
      }
    }
  };

  // Map product context functions to the expected names
  const productContextWithAliases = {
    ...productContext,
    // These are now provided directly by the ProductContext
  };

  // Combine all values from all contexts
  const combinedValue = {
    ...storeContext,
    ...productContextWithAliases,
    ...categoryContext,
    ...cartContext,
    ...userContext,
    ...commentContext,
    ...giftCodeContext,
    ...purchaseContext,
    addPurchase
  };

  return (
    <AppContext.Provider value={combinedValue}>
      {children}
    </AppContext.Provider>
  );
};
