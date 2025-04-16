
import React, { createContext, useContext, useState } from "react";
import { GiftCode } from "../../types";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "./user";

interface GiftCodeContextType {
  giftCodes: GiftCode[];
  addGiftCode: (code: Omit<GiftCode, 'id' | 'createdAt'>) => void;
  applyGiftCode: (code: GiftCode) => void;
  appliedGiftCode: GiftCode | null;
}

const GiftCodeContext = createContext<GiftCodeContextType>({} as GiftCodeContextType);

export const useGiftCodeContext = () => useContext(GiftCodeContext);

export const GiftCodeProvider: React.FC<{ 
  children: React.ReactNode;
  onApplyGiftCode: (giftCode: GiftCode) => void;
}> = ({ children, onApplyGiftCode }) => {
  const { user } = useUserContext();
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([
    {
      id: "1",
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      isGlobal: true,
      isUsed: false,
      usedBy: null,
      createdAt: "2023-01-01T00:00:00Z"
    },
    {
      id: "2",
      code: "SUMMER20",
      discountType: "percentage",
      discountValue: 20,
      isGlobal: true,
      isUsed: false,
      usedBy: null,
      createdAt: "2023-06-01T00:00:00Z"
    }
  ]);
  
  const [appliedGiftCode, setAppliedGiftCode] = useState<GiftCode | null>(null);

  const addGiftCode = (code: Omit<GiftCode, 'id' | 'createdAt'>) => {
    // Check if code already exists
    if (giftCodes.some(gc => gc.code === code.code)) {
      toast({
        title: "خطا",
        description: "این کد تخفیف قبلاً ایجاد شده است",
        variant: "destructive",
      });
      return;
    }
    
    const newGiftCode: GiftCode = {
      ...code,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setGiftCodes(prev => [...prev, newGiftCode]);
    
    toast({
      title: "کد تخفیف جدید",
      description: "کد تخفیف با موفقیت ایجاد شد",
    });
  };
  
  // Updated to accept a GiftCode object instead of a string
  const applyGiftCode = (giftCode: GiftCode) => {
    setAppliedGiftCode(giftCode);
    onApplyGiftCode(giftCode);
    
    // Mark as used if it's not a global code
    if (!giftCode.isGlobal && user) {
      setGiftCodes(prev => 
        prev.map(gc => 
          gc.id === giftCode.id 
            ? { ...gc, isUsed: true, usedBy: user.id } 
            : gc
        )
      );
    }
    
    toast({
      title: "کد تخفیف",
      description: "کد تخفیف با موفقیت اعمال شد",
    });
  };

  // This is a helper function to find and apply a gift code by its string code
  const findAndApplyGiftCode = (code: string): boolean => {
    const giftCode = giftCodes.find(
      gc => gc.code === code && (!gc.isUsed || gc.isGlobal)
    );
    
    if (!giftCode) {
      toast({
        title: "خطا",
        description: "کد تخفیف نامعتبر است یا قبلاً استفاده شده است",
        variant: "destructive",
      });
      return false;
    }
    
    applyGiftCode(giftCode);
    return true;
  };

  const value = {
    giftCodes,
    addGiftCode,
    applyGiftCode,
    appliedGiftCode,
    findAndApplyGiftCode
  };

  return (
    <GiftCodeContext.Provider value={value}>
      {children}
    </GiftCodeContext.Provider>
  );
};
