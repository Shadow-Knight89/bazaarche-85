
import React, { createContext, useContext, useState } from "react";
import { Purchase, CartItem } from "../../types";
import { useUserContext } from "./UserContext";
import { toast } from "@/components/ui/use-toast";

interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (items: CartItem[], total: number) => void;
}

const PurchaseContext = createContext<PurchaseContextType>({} as PurchaseContextType);

export const usePurchaseContext = () => useContext(PurchaseContext);

export const PurchaseProvider: React.FC<{ 
  children: React.ReactNode; 
  onPurchaseComplete: () => void;
}> = ({ children, onPurchaseComplete }) => {
  const { user } = useUserContext();
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const addPurchase = (items: CartItem[], total: number) => {
    if (!user || items.length === 0) return;
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      items: [...items],
      total,
      createdAt: new Date().toISOString()
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    
    toast({
      title: "خرید موفق",
      description: "سفارش شما با موفقیت ثبت شد",
    });
    
    onPurchaseComplete();
  };

  const value = {
    purchases,
    addPurchase
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};
