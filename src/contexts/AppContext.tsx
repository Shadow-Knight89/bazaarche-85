
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, GiftCode, User, Comment, Reply, Purchase, Category } from '../types';
import { toast } from '../components/ui/use-toast';

// Default products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'لپ تاپ گیمینگ',
    price: 45000000,
    discountedPrice: 42000000,
    description: 'لپ تاپ گیمینگ با پردازنده قدرتمند و کارت گرافیک حرفه‌ای برای اجرای بازی‌های سنگین',
    detailedDescription: 'این لپ تاپ گیمینگ مجهز به پردازنده نسل 12 اینتل و کارت گرافیک RTX 3080 است که برای اجرای بازی‌های سنگین و کارهای گرافیکی مناسب است. نمایشگر 15.6 اینچی با رفرش ریت 144 هرتز تجربه بازی فوق‌العاده‌ای را برای شما فراهم می‌کند.',
    images: ['/placeholder.svg'],
    category: 'لپ تاپ',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'گوشی هوشمند',
    price: 12000000,
    discountedPrice: 12000000,
    description: 'گوشی هوشمند با دوربین حرفه‌ای و باتری با دوام',
    detailedDescription: 'این گوشی هوشمند با دوربین سه‌گانه 48 مگاپیکسلی، باتری 5000 میلی‌آمپر ساعتی و نمایشگر Super AMOLED با رزولوشن Full HD+ تجربه کاربری فوق‌العاده‌ای را برای شما فراهم می‌کند.',
    images: ['/placeholder.svg'],
    category: 'گوشی',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'هدفون بی‌سیم',
    price: 2500000,
    discountedPrice: 2000000,
    description: 'هدفون بی‌سیم با کیفیت صدای فوق‌العاده و حذف نویز محیط',
    detailedDescription: 'این هدفون بی‌سیم با تکنولوژی حذف نویز فعال (ANC) صدای محیط را به میزان قابل توجهی کاهش می‌دهد و با کیفیت صدای بی‌نظیر و باتری با دوام تا 30 ساعت، تجربه گوش دادن به موسیقی را برای شما لذت‌بخش‌تر می‌کند.',
    images: ['/placeholder.svg'],
    category: 'هدفون',
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

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'لپ تاپ',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'گوشی',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'هدفون',
    createdAt: new Date().toISOString(),
  },
];

// Default admin user
const DEFAULT_USERS: User[] = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin123',
    isAdmin: true,
  }
];

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  giftCodes: GiftCode[];
  appliedGiftCode: GiftCode | null;
  categories: Category[];
  comments: Comment[];
  purchases: Purchase[];
  
  // Auth functions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  
  // Product functions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  removeProduct: (id: string) => void;
  
  // Cart functions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Gift code functions
  addGiftCode: (giftCode: Omit<GiftCode, 'id' | 'isUsed' | 'usedBy' | 'createdAt'>) => void;
  applyGiftCode: (code: string) => boolean;
  
  // Category functions
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  editCategory: (id: string, name: string) => void;
  
  // Comment functions
  addComment: (productId: string, text: string) => void;
  addReply: (commentId: string, text: string) => void;
  getCommentsForProduct: (productId: string) => Comment[];
  
  // Purchase functions
  addPurchase: () => void;
  
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
  const CATEGORIES_KEY = 'shop-categories';
  const USERS_KEY = 'shop-users';
  const COMMENTS_KEY = 'shop-comments';
  const PURCHASES_KEY = 'shop-purchases';
  
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

  const [categories, setCategories] = useState<Category[]>(() => {
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    return storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    return storedUsers ? JSON.parse(storedUsers) : DEFAULT_USERS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const storedComments = localStorage.getItem(COMMENTS_KEY);
    return storedComments ? JSON.parse(storedComments) : [];
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const storedPurchases = localStorage.getItem(PURCHASES_KEY);
    return storedPurchases ? JSON.parse(storedPurchases) : [];
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

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  }, [purchases]);
  
  // Auth functions
  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      // Create a copy without the password for the session
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser({ ...userWithoutPassword, password: '' });
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setAppliedGiftCode(null);
  };

  const register = (username: string, password: string): boolean => {
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      isAdmin: false,
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user) return false;

    // Find the user with the current password
    const userIndex = users.findIndex(u => u.id === user.id && u.password === currentPassword);
    
    if (userIndex === -1) {
      return false;
    }

    // Update the user's password
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };

    setUsers(updatedUsers);
    return true;
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
  
  const editProduct = (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    setProducts((prev) => 
      prev.map((product) => 
        product.id === id ? { ...product, ...productData } : product
      )
    );
    
    toast({
      title: "ویرایش محصول",
      description: "محصول با موفقیت ویرایش شد",
    });
  };
  
  const removeProduct = (id: string) => {
    // First remove from any cart if it exists
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    
    // Then remove the product itself
    setProducts((prev) => prev.filter((product) => product.id !== id));
    
    toast({
      title: "حذف محصول",
      description: "محصول با موفقیت حذف شد",
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

  // Category functions
  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "دسته‌بندی جدید",
      description: "دسته‌بندی با موفقیت اضافه شد",
    });
  };

  const removeCategory = (id: string) => {
    // Check if any products are using this category
    const productsUsingCategory = products.filter(p => p.category === categories.find(c => c.id === id)?.name);
    
    if (productsUsingCategory.length > 0) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی توسط محصولات استفاده می‌شود و نمی‌توان آن را حذف کرد",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(prev => prev.filter(c => c.id !== id));
    toast({
      title: "حذف دسته‌بندی",
      description: "دسته‌بندی با موفقیت حذف شد",
    });
  };

  const editCategory = (id: string, name: string) => {
    const oldCategory = categories.find(c => c.id === id);
    
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    
    // Update all products using this category
    if (oldCategory) {
      setProducts(prev => prev.map(p => p.category === oldCategory.name ? { ...p, category: name } : p));
    }
    
    toast({
      title: "ویرایش دسته‌بندی",
      description: "دسته‌بندی با موفقیت ویرایش شد",
    });
  };

  // Comment functions
  const addComment = (productId: string, text: string) => {
    if (!user) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      productId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      text,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    
    setComments(prev => [...prev, newComment]);
    toast({
      title: "نظر جدید",
      description: "نظر شما با موفقیت ثبت شد",
    });
  };

  const addReply = (commentId: string, text: string) => {
    if (!user) return;
    
    const newReply: Reply = {
      id: Date.now().toString(),
      commentId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      text,
      createdAt: new Date().toISOString(),
    };
    
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    }));
    
    toast({
      title: "پاسخ جدید",
      description: "پاسخ شما با موفقیت ثبت شد",
    });
  };

  const getCommentsForProduct = (productId: string): Comment[] => {
    return comments.filter(comment => comment.productId === productId);
  };

  // Purchase functions
  const addPurchase = () => {
    if (!user || cart.length === 0) return;
    
    const { total } = calculateTotal();
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      items: [...cart],
      total,
      createdAt: new Date().toISOString(),
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    clearCart();
    
    toast({
      title: "خرید موفق",
      description: "سفارش شما با موفقیت ثبت شد",
    });
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
    categories,
    comments,
    purchases,
    login,
    logout,
    register,
    changePassword,
    addProduct,
    editProduct,
    removeProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    addGiftCode,
    applyGiftCode,
    addCategory,
    removeCategory,
    editCategory,
    addComment,
    addReply,
    getCommentsForProduct,
    addPurchase,
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
