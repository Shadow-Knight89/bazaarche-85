
import React, { createContext, useContext, useState } from "react";
import { CartItem, Product, GiftCode } from "../../types";
import { toast } from "@/components/ui/use-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  resetCart: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  appliedGiftCode: GiftCode | null;
  applyGiftCode: (code: GiftCode) => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCartContext = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedGiftCode, setAppliedGiftCode] = useState<GiftCode | null>(null);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "سبد خرید",
      description: `${product.name} به سبد خرید اضافه شد`,
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    setAppliedGiftCode(null);
  };
  
  const resetCart = () => {
    setCart([]);
    setAppliedGiftCode(null);
  };
  
  const applyGiftCode = (giftCode: GiftCode) => {
    setAppliedGiftCode(giftCode);
  };
  
  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.discountedPrice * item.quantity, 
      0
    );
    
    let discount = 0;
    
    if (appliedGiftCode) {
      if (appliedGiftCode.discountType === 'percentage') {
        discount = subtotal * (appliedGiftCode.discountValue / 100);
      } else {
        discount = appliedGiftCode.discountValue;
      }
    }
    
    const total = Math.max(0, subtotal - discount);
    
    return { subtotal, discount, total };
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    resetCart,
    calculateTotal,
    appliedGiftCode,
    applyGiftCode
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
