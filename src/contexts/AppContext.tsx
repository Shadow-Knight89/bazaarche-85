
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, GiftCode, User } from '../types';
import { toast } from '../components/ui/use-toast';

// Default products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'لپ تاپ گیمینگ',
    price: 45000000,
    discountedPrice: 42000000,
    description: 'لپ تاپ گیمینگ با پردازنده قدرتمند و کارت گرافیک حرفه‌ای برای اجرای بازی‌های سنگین',
    images: ['/placeholder.svg'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'گوشی هوشمند',
    price: 12000000,
    discountedPrice: 12000000,
    description: 'گوشی هوشمند با دوربین حرفه‌ای و باتری با دوام',
    images: ['/placeholder.svg'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'هدفون بی‌سیم',
    price: 2500000,
    discountedPrice: 2000000,
    description: 'هدفون بی‌سیم با کیفیت صدای فوق‌العاده و حذف نویز محیط',
    images: ['/placeholder.svg'],
    createdAt: new Date().toISOString(),
  },
];

// Default gift codes
const DEFAULT_GIFT_CODES: GiftCode[] = [
  {
    id: '1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    isGlobal: true,
    isUsed: false,
    usedBy: null,
    createdAt: new Date().toISOString(),
  }
];

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  giftCodes: GiftCode[];
  appliedGiftCode: GiftCode | null;
  
  // Auth functions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Product functions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  
  // Cart functions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Gift code functions
  addGiftCode: (giftCode: Omit<GiftCode, 'id' | 'isUsed' | 'usedBy' | 'createdAt'>) => void;
  applyGiftCode: (code: string) => boolean;
  
  // Calculate total
  calculateTotal: () => { subtotal: number; discount: number; total: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const PRODUCTS_KEY = 'shop-products';
  const CART_KEY = 'shop-cart';
  const USER_KEY = 'shop-user';
  const GIFT_CODES_KEY = 'shop-gift-codes';
  
  // State
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    return storedProducts ? JSON.parse(storedProducts) : DEFAULT_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>(() => {
    const storedGiftCodes = localStorage.getItem(GIFT_CODES_KEY);
    return storedGiftCodes ? JSON.parse(storedGiftCodes) : DEFAULT_GIFT_CODES;
  });
  
  const [appliedGiftCode, setAppliedGiftCode] = useState<GiftCode | null>(null);
  
  // Effects to sync state with localStorage
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem(GIFT_CODES_KEY, JSON.stringify(giftCodes));
  }, [giftCodes]);
  
  // Auth functions
  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setUser({ id: 'admin', username: 'admin', isAdmin: true });
      return true;
    }
    
    // For normal users (simplified - in real app would use proper auth)
    if (username && password) {
      setUser({ id: username, username, isAdmin: false });
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setAppliedGiftCode(null);
  };
  
  // Product functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setProducts((prev) => [...prev, newProduct]);
    toast({
      title: "محصول جدید",
      description: "محصول با موفقیت اضافه شد",
    });
  };
  
  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    toast({
      title: "سبد خرید",
      description: "محصول به سبد خرید اضافه شد",
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    
    toast({
      title: "سبد خرید",
      description: "محصول از سبد خرید حذف شد",
    });
  };
  
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    setAppliedGiftCode(null);
  };
  
  // Gift code functions
  const addGiftCode = (giftCode: Omit<GiftCode, 'id' | 'isUsed' | 'usedBy' | 'createdAt'>) => {
    const newGiftCode: GiftCode = {
      ...giftCode,
      id: Date.now().toString(),
      isUsed: false,
      usedBy: null,
      createdAt: new Date().toISOString(),
    };
    
    setGiftCodes((prev) => [...prev, newGiftCode]);
    toast({
      title: "کد تخفیف",
      description: "کد تخفیف جدید با موفقیت اضافه شد",
    });
  };
  
  const applyGiftCode = (code: string): boolean => {
    const giftCode = giftCodes.find(
      (gc) => gc.code === code && (!gc.isUsed || gc.isGlobal)
    );
    
    if (!giftCode) {
      toast({
        title: "خطا",
        description: "کد تخفیف معتبر نیست یا قبلا استفاده شده است",
        variant: "destructive",
      });
      return false;
    }
    
    setAppliedGiftCode(giftCode);
    
    // If code is not global or can only be used once, mark it as used
    if (!giftCode.isGlobal) {
      setGiftCodes((prev) =>
        prev.map((gc) =>
          gc.id === giftCode.id
            ? { ...gc, isUsed: true, usedBy: user?.id || 'guest' }
            : gc
        )
      );
    }
    
    toast({
      title: "کد تخفیف",
      description: "کد تخفیف با موفقیت اعمال شد",
    });
    
    return true;
  };
  
  // Calculate total
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
        discount = Math.min(appliedGiftCode.discountValue, subtotal);
      }
    }
    
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  };
  
  const contextValue: AppContextType = {
    products,
    cart,
    user,
    giftCodes,
    appliedGiftCode,
    login,
    logout,
    addProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addGiftCode,
    applyGiftCode,
    calculateTotal,
  };
  
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
