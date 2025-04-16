
import React from "react";
import { ProductProvider } from "./modules/product";
import { CategoryProvider } from "./modules/CategoryContext";
import { CartProvider } from "./modules/CartContext";
import { UserProvider } from "./modules/user";
import { CommentProvider } from "./modules/CommentContext";
import { GiftCodeProvider } from "./modules/GiftCodeContext";
import { PurchaseProvider } from "./modules/PurchaseContext";
import { StoreProvider } from "./modules/StoreContext";
import { AppContext, AppContextValue } from "./AppContext";
import { useProductContext } from "./modules/product";
import { useCategoryContext } from "./modules/CategoryContext";
import { useCartContext } from "./modules/CartContext";
import { useUserContext } from "./modules/user";
import { useCommentContext } from "./modules/CommentContext";
import { useGiftCodeContext } from "./modules/GiftCodeContext";
import { usePurchaseContext } from "./modules/PurchaseContext";
import { useStoreContext } from "./modules/StoreContext";

// Create the provider component
interface AppProviderProps {
  children: React.ReactNode;
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
const PurchaseProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
const GiftCodeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { applyGiftCode } = useCartContext();

  const handleApplyGiftCode = (giftCode: any) => {
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
const CombinedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeContext = useStoreContext();
  const productContext = useProductContext();
  const categoryContext = useCategoryContext();
  const cartContext = useCartContext();
  const userContext = useUserContext();
  const commentContext = useCommentContext();
  const giftCodeContext = useGiftCodeContext();
  const purchaseContext = usePurchaseContext();

  // Add purchase wrapper for backward compatibility
  const addPurchase = (items?: any[], totalAmount?: number, shippingAddressId?: string) => {
    if (userContext.user) {
      const cart = items || cartContext.cart;
      if (cart.length > 0) {
        const { total } = totalAmount !== undefined ? { total: totalAmount } : cartContext.calculateTotal();
        purchaseContext.addPurchase(cart, total, shippingAddressId);
      }
    }
  };

  // Combine all values from all contexts
  const combinedValue: AppContextValue = {
    ...storeContext,
    ...productContext,
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
