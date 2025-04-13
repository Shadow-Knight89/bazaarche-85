
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, GiftCode, User, Comment, Reply, Purchase, Category, SecurityQuestion, AdminPermissions, LoginAttempt } from '../types';
import { toast } from '../components/ui/use-toast';

// Store name constant
const STORE_NAME = "بازارچه الکترونیکی دبیرستان شهید بهشتی";

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
    customId: 'gaming-laptop',
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
    customId: 'smart-phone',
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
    customId: 'wireless-headphones',
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
    adminPermissions: {
      manageProducts: true,
      manageCategories: true,
      manageGiftCodes: true,
      manageUsers: true,
      viewPurchases: true,
      manageComments: true,
      customPrefix: "مدیر ارشد",
      customPrefixColor: "#ff0000"
    },
    securityQuestion: {
      question: "نام اولین معلم شما چه بود؟",
      answer: "admin"
    },
    canComment: true
  }
];

// Login rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  timeWindow: 5 * 60 * 1000, // 5 minutes in milliseconds
};

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  giftCodes: GiftCode[];
  appliedGiftCode: GiftCode | null;
  categories: Category[];
  comments: Comment[];
  purchases: Purchase[];
  users: User[];
  storeName: string;
  
  // Auth functions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string, securityQuestion?: SecurityQuestion) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
  checkLoginRateLimit: () => { limited: boolean; remainingTime: number };
  getUserSecurityQuestion: (username: string) => string | null;
  verifySecurityAnswer: (username: string, answer: string) => boolean;
  resetPassword: (username: string, newPassword: string) => void;
  
  // Product functions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  removeProduct: (id: string) => void;
  
  // Cart functions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  resetCart: () => void;
  
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
  
  // User management functions
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  deleteUser: (userId: string) => void;
  
  // Admin management functions
  addAdmin: (username: string, password: string, permissions: AdminPermissions) => boolean;
  updateAdminPermissions: (userId: string, permissions: AdminPermissions) => void;
  
  // Calculate total
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  
  // Get product by custom ID
  getProductByCustomId: (customId: string) => Product | undefined;
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
  const LOGIN_ATTEMPTS_KEY = 'shop-login-attempts';
  
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
  
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>(() => {
    const storedAttempts = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return storedAttempts ? JSON.parse(storedAttempts) : [];
  });
  
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
  
  useEffect(() => {
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(loginAttempts));
  }, [loginAttempts]);
  
  // Helper functions for login rate limiting
  const getClientIp = (): string => {
    // In a real app, this would come from the server
    // For our example, we'll create a fingerprint based on browser data
    return navigator.userAgent + navigator.language;
  };
  
  const checkLoginRateLimit = () => {
    const now = Date.now();
    const ip = getClientIp();
    
    // Clean up old attempts
    const validAttempts = loginAttempts.filter(attempt => 
      now - attempt.timestamp < RATE_LIMIT.timeWindow
    );
    
    // Find attempts for this IP
    const ipAttempts = validAttempts.filter(attempt => attempt.ip === ip);
    
    if (ipAttempts.length >= RATE_LIMIT.maxAttempts) {
      // IP is rate limited
      const oldestAttempt = ipAttempts[0];
      const remainingTime = RATE_LIMIT.timeWindow - (now - oldestAttempt.timestamp);
      return { limited: true, remainingTime };
    }
    
    return { limited: false, remainingTime: 0 };
  };
  
  const recordLoginAttempt = (success: boolean) => {
    const now = Date.now();
    const ip = getClientIp();
    
    // Clean up old attempts
    const validAttempts = loginAttempts.filter(attempt => 
      now - attempt.timestamp < RATE_LIMIT.timeWindow
    );
    
    if (success) {
      // If successful login, remove this IP's attempts
      const newAttempts = validAttempts.filter(attempt => attempt.ip !== ip);
      setLoginAttempts(newAttempts);
    } else {
      // Add a new failed attempt
      const newAttempt: LoginAttempt = {
        ip,
        timestamp: now,
        count: 1
      };
      
      setLoginAttempts([...validAttempts, newAttempt]);
    }
  };
  
  // Auth functions
  const login = (username: string, password: string): boolean => {
    // Check rate limiting
    const { limited } = checkLoginRateLimit();
    if (limited) {
      return false;
    }
    
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      if (foundUser.isBanned) {
        toast({
          title: "حساب مسدود شده",
          description: "حساب کاربری شما مسدود شده است. لطفا با مدیر سایت تماس بگیرید.",
          variant: "destructive",
        });
        recordLoginAttempt(false);
        return false;
      }
      
      // Create a copy without the password for the session
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser({ ...userWithoutPassword, password: '' });
      
      // Record successful login
      recordLoginAttempt(true);
      
      return true;
    }
    
    // Record failed login
    recordLoginAttempt(false);
    return false;
  };
  
  const logout = () => {
    setUser(null);
    setAppliedGiftCode(null);
    setCart([]);
  };

  const register = (username: string, password: string, securityQuestion?: SecurityQuestion): boolean => {
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
      securityQuestion,
      canComment: true
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
  
  // Security question functions
  const getUserSecurityQuestion = (username: string): string | null => {
    const foundUser = users.find(u => u.username === username);
    return foundUser?.securityQuestion?.question || null;
  };
  
  const verifySecurityAnswer = (username: string, answer: string): boolean => {
    const foundUser = users.find(u => u.username === username);
    if (!foundUser || !foundUser.securityQuestion) return false;
    
    return foundUser.securityQuestion.answer.toLowerCase() === answer.trim().toLowerCase();
  };
  
  const resetPassword = (username: string, newPassword: string): void => {
    setUsers(prev => prev.map(u => {
      if (u.username === username) {
        return { ...u, password: newPassword };
      }
      return u;
    }));
  };
  
  // Product functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    // Check if customId already exists
    if (product.customId && products.some(p => p.customId === product.customId)) {
      toast({
        title: "خطا",
        description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
        variant: "destructive",
      });
      return;
    }
    
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
    // Check if customId already exists and it's not the same product
    if (
      productData.customId && 
      products.some(p => p.customId === productData.customId && p.id !== id)
    ) {
      toast({
        title: "خطا",
        description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
        variant: "destructive",
      });
      return;
    }
    
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
  
  // Get product by custom ID
  const getProductByCustomId = (customId: string): Product | undefined => {
    return products.find(p => p.customId === customId);
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
  
  const resetCart = () => {
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
    const categoryName = categories.find(c => c.id === id)?.name;
    if (!categoryName) return;
    
    const productsUsingCategory = products.filter(p => p.category === categoryName);
    
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
    
    // Check if user is banned from commenting
    if (user.canComment === false) {
      toast({
        title: "خطا",
        description: "شما اجازه ارسال نظر ندارید",
        variant: "destructive",
      });
      return;
    }
    
    // Get admin prefix if applicable
    let adminPrefix, adminPrefixColor;
    if (user.isAdmin && user.adminPermissions) {
      adminPrefix = user.adminPermissions.customPrefix;
      adminPrefixColor = user.adminPermissions.customPrefixColor;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      productId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      adminPrefix,
      adminPrefixColor,
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
    
    // Check if user is banned from commenting
    if (user.canComment === false) {
      toast({
        title: "خطا",
        description: "شما اجازه ارسال نظر ندارید",
        variant: "destructive",
      });
      return;
    }
    
    // Get admin prefix if applicable
    let adminPrefix, adminPrefixColor;
    if (user.isAdmin && user.adminPermissions) {
      adminPrefix = user.adminPermissions.customPrefix;
      adminPrefixColor = user.adminPermissions.customPrefixColor;
    }
    
    const newReply: Reply = {
      id: Date.now().toString(),
      commentId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      adminPrefix,
      adminPrefixColor,
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

  // User management functions
  const banUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: true, canComment: false } : u
    ));
  };
  
  const unbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: false, canComment: true } : u
    ));
  };
  
  const resetUserPassword = (userId: string, newPassword: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    ));
  };
  
  const deleteUser = (userId: string) => {
    // Can't delete main admin
    if (userId === 'admin') return;
    
    setUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  // Admin management functions
  const addAdmin = (username: string, password: string, permissions: AdminPermissions): boolean => {
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      return false;
    }
    
    const newAdmin: User = {
      id: Date.now().toString(),
      username,
      password,
      isAdmin: true,
      adminPermissions: permissions,
      canComment: true,
      securityQuestion: {
        question: "نام اولین معلم شما چه بود؟",
        answer: "admin"
      }
    };
    
    setUsers(prev => [...prev, newAdmin]);
    return true;
  };
  
  const updateAdminPermissions = (userId: string, permissions: AdminPermissions) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, adminPermissions: permissions } : u
    ));
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
    users,
    storeName: STORE_NAME,
    login,
    logout,
    register,
    changePassword,
    checkLoginRateLimit,
    getUserSecurityQuestion,
    verifySecurityAnswer,
    resetPassword,
    addProduct,
    editProduct,
    removeProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    resetCart,
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
    banUser,
    unbanUser,
    resetUserPassword,
    deleteUser,
    addAdmin,
    updateAdminPermissions,
    getProductByCustomId,
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

export const getStoreName = () => STORE_NAME;
