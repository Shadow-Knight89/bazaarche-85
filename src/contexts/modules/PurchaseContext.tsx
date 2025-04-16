
import React, { createContext, useContext, useState, useEffect } from "react";
import { Purchase, CartItem } from "../../types";
import { useUserContext } from "./UserContext";
import { toast } from "@/components/ui/use-toast";
import { createPurchase, fetchPurchases } from "../../utils/api";

interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (items: CartItem[], total: number, shippingAddressId?: string) => void;
  loadPurchases: () => Promise<void>;
  loading: boolean;
}

const PurchaseContext = createContext<PurchaseContextType>({} as PurchaseContextType);

export const usePurchaseContext = () => useContext(PurchaseContext);

export const PurchaseProvider: React.FC<{ 
  children: React.ReactNode; 
  onPurchaseComplete: () => void;
}> = ({ children, onPurchaseComplete }) => {
  const { user } = useUserContext();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load purchases from API on component mount
  useEffect(() => {
    if (user && user.isAdmin) {
      loadPurchases();
    }
  }, [user]);

  // Function to load purchases from the server
  const loadPurchases = async () => {
    if (!user || !user.isAdmin) return;
    
    try {
      setLoading(true);
      const purchasesData = await fetchPurchases();
      
      if (purchasesData && Array.isArray(purchasesData)) {
        // Transform purchases from API format if needed
        const formattedPurchases = purchasesData.map(purchase => ({
          ...purchase,
          id: purchase.id.toString(),
          userId: purchase.user?.id?.toString() || "",
          username: purchase.username || purchase.user?.username || "",
          createdAt: purchase.createdAt || purchase.created_at || new Date().toISOString(),
          items: purchase.items ? purchase.items.map((item: any) => ({
            product: {
              id: item.product,
              name: item.product_name,
              price: item.price,
              discountedPrice: item.price,
              // Other product fields might be needed
              description: '',
              category: null,
              images: []
            },
            quantity: item.quantity
          })) : []
        }));
        
        setPurchases(formattedPurchases);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (items: CartItem[], total: number, shippingAddressId?: string) => {
    if (!user || items.length === 0) return;
    
    // Format the purchase data for the API
    const purchaseData = {
      total,
      shippingAddressId: shippingAddressId || undefined,
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.discountedPrice
      }))
    };
    
    try {
      // Send purchase to server
      const response = await createPurchase(purchaseData);
      
      if (response) {
        // Add the new purchase to local state
        const newPurchase: Purchase = {
          id: response.id.toString(),
          userId: user.id,
          username: user.username,
          items: [...items],
          total,
          createdAt: response.createdAt || new Date().toISOString(),
          shippingAddress: response.shipping_address
        };
        
        setPurchases(prev => [...prev, newPurchase]);
        
        toast({
          title: "خرید موفق",
          description: "سفارش شما با موفقیت ثبت شد",
        });
        
        // Call the completion handler
        onPurchaseComplete();
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: "خطا",
        description: "مشکلی در ثبت سفارش به وجود آمد",
        variant: "destructive"
      });
      throw error; // Rethrow to handle in the component
    }
  };

  const value = {
    purchases,
    addPurchase,
    loadPurchases,
    loading
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};
