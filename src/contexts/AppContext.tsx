import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { 
  Product, 
  CartItem, 
  User, 
  GiftCode, 
  Comment,
  Category, 
  SecurityQuestion,
  Purchase,
  LoginAttempt
} from "../types";
import { toast } from "@/components/ui/use-toast";

// Define the context type with all required properties and functions
interface AppContextType {
  // Store info
  storeName: string;
  setStoreName: (name: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  getProductByCustomId: (customId: string) => Product | undefined;
  
  // Categories
  categories: Category[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  editCategory: (id: string, name: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  resetCart: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number };
  
  // Gift codes
  giftCodes: GiftCode[];
  addGiftCode: (code: Omit<GiftCode, 'id' | 'createdAt'>) => void;
  applyGiftCode: (code: string) => boolean;
  appliedGiftCode: GiftCode | null;
  
  // User management
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, securityQuestion: SecurityQuestion) => boolean;
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
  
  // Admin management
  addAdmin: (userId: string) => void;
  updateAdminPermissions: (userId: string, permissions: Partial<User['adminPermissions']>) => void;
  
  // Comments
  addComment: (productId: string, text: string) => void;
  addReply: (commentId: string, text: string) => void;
  getCommentsForProduct: (productId: string) => Comment[];
  
  // Purchases
  purchases: Purchase[];
  addPurchase: () => void;
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

// IMPORTANT: Export AppProvider here
export const AppProvider = ({ children }: AppProviderProps) => {
  // Store information
  const [storeName, setStoreName] = useState<string>("فروشگاه آنلاین");
  
  // Products state
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "گوشی هوشمند سامسونگ گلکسی A52",
      price: 8500000,
      discountedPrice: 7200000,
      description: "گوشی هوشمند با صفحه نمایش AMOLED و دوربین چهارگانه",
      detailedDescription: "این گوشی دارای صفحه نمایش 6.5 اینچی Super AMOLED با رزولوشن 1080x2400 پیکسل، دوربین اصلی 64 مگاپیکسلی، باتری 4500 میلی‌آمپر ساعت و پردازنده اسنپدراگون 720G است.",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/3b80e5838f5ff024e54c3d128dcd11f859dc31be_1656426741.jpg",
        "https://dkstatics-public.digikala.com/digikala-products/073c9749b9bee4add3561584cd35e845d0fb2357_1656426748.jpg"
      ],
      category: "گوشی هوشمند",
      createdAt: "2023-01-15T10:30:00Z",
      customId: "samsung-a52"
    },
    {
      id: "2",
      name: "لپ تاپ لنوو IdeaPad 3",
      price: 22000000,
      discountedPrice: 20500000,
      description: "لپ تاپ مناسب برای کارهای روزمره و دانشجویی",
      detailedDescription: "این لپ تاپ دارای پردازنده Core i5 نسل 11، حافظه رم 8 گیگابایت DDR4، حافظه داخلی 512 گیگابایت SSD و صفحه نمایش 15.6 اینچی با رزولوشن 1080p است.",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/29f5a02ab5c9d82f0cf817d365a0dfb0da1211ea_1675854730.jpg"
      ],
      category: "لپ تاپ",
      createdAt: "2023-02-20T14:15:00Z"
    },
    {
      id: "3",
      name: "هدفون بی سیم اپل AirPods Pro",
      price: 9800000,
      discountedPrice: 9300000,
      description: "هدفون بی سیم با قابلیت حذف نویز محیط",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/113639098.jpg"
      ],
      category: "لوازم جانبی",
      createdAt: "2023-03-05T09:45:00Z",
      customId: "airpods-pro"
    }
  ]);
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "گوشی هوشمند", createdAt: "2023-01-10T08:00:00Z" },
    { id: "2", name: "لپ تاپ", createdAt: "2023-01-10T08:05:00Z" },
    { id: "3", name: "لوازم جانبی", createdAt: "2023-01-10T08:10:00Z" }
  ]);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Gift codes state
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
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Users state 
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "admin",
      password: "admin123",
      isAdmin: true,
      adminPermissions: {
        manageProducts: true,
        manageCategories: true,
        manageGiftCodes: true,
        manageUsers: true,
        viewPurchases: true,
        manageComments: true
      },
      securityQuestion: {
        question: "نام اولین معلم شما چه بود؟",
        answer: "محمدی"
      },
      canComment: true
    },
    {
      id: "2",
      username: "user1",
      password: "password123",
      isAdmin: false,
      canComment: true,
      securityQuestion: {
        question: "نام اولین حیوان خانگی شما چه بود؟",
        answer: "گربه"
      }
    }
  ]);
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  
  // Purchases state
  const [purchases, setPurchases] = useState<Purchase[]>([]);

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

    console.log("New product added:", newProduct);
    setProducts((prev) => [...prev, newProduct]);
    toast({
      title: "محصول جدید",
      description: "محصول با موفقیت اضافه شد",
    });
  };

  const editProduct = (id: string, product: Partial<Product>) => {
    // Check if customId is being changed and ensure it's unique
    if (product.customId) {
      const existingWithCustomId = products.find(
        p => p.customId === product.customId && p.id !== id
      );
      
      if (existingWithCustomId) {
        toast({
          title: "خطا",
          description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
    );
    
    toast({
      title: "ویرایش محصول",
      description: "محصول با موفقیت ویرایش شد",
    });
  };
  
  const removeProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    
    // Remove associated comments
    setComments(prevComments => prevComments.filter(c => c.productId !== id));
    
    // Remove from cart if present
    setCart(prevCart => prevCart.filter(item => item.product.id !== id));
    
    toast({
      title: "حذف محصول",
      description: "محصول با موفقیت حذف شد",
    });
  };
  
  const getProductByCustomId = (customId: string) => {
    return products.find(p => p.customId === customId);
  };

  // Category functions
  const addCategory = (name: string) => {
    // Check if category with the same name already exists
    if (categories.some(c => c.name === name)) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این نام قبلاً ایجاد شده است",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    
    setCategories(prev => [...prev, newCategory]);
    
    toast({
      title: "دسته‌بندی جدید",
      description: "دسته‌بندی با موفقیت اضافه شد",
    });
  };
  
  const removeCategory = (id: string) => {
    const categoryToRemove = categories.find(c => c.id === id);
    
    if (!categoryToRemove) return;
    
    const productsWithCategory = products.filter(p => p.category === categoryToRemove.name);
    
    if (productsWithCategory.length > 0) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی دارای محصولاتی است و نمی‌تواند حذف شود",
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
    // Check if another category with the same name already exists
    if (categories.some(c => c.name === name && c.id !== id)) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این نام قبلاً ایجاد شده است",
        variant: "destructive",
      });
      return;
    }
    
    const categoryToEdit = categories.find(c => c.id === id);
    
    if (!categoryToEdit) return;
    
    const oldName = categoryToEdit.name;
    
    // Update category
    setCategories(prev => 
      prev.map(c => c.id === id ? { ...c, name } : c)
    );
    
    // Update products with this category
    setProducts(prev => 
      prev.map(p => p.category === oldName ? { ...p, category: name } : p)
    );
    
    toast({
      title: "ویرایش دسته‌بندی",
      description: "دسته‌بندی با موفقیت ویرایش شد",
    });
  };

  // Cart functions
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

  // Gift code functions
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
  
  const applyGiftCode = (code: string) => {
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
    
    setAppliedGiftCode(giftCode);
    
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
    
    return true;
  };

  // User functions
  const login = (username: string, password: string) => {
    const foundUser = users.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // Check if user is banned
      if (foundUser.isBanned) {
        toast({
          title: "خطا",
          description: "حساب کاربری شما مسدود شده است",
          variant: "destructive",
        });
        return false;
      }
      
      setUser(foundUser);
      
      // Reset failed login attempts
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.ip === "current-ip" ? { ...attempt, count: 0 } : attempt
        )
      );
      
      return true;
    }
    
    // Increment failed login attempts
    const currentAttempt = loginAttempts.find(a => a.ip === "current-ip");
    
    if (currentAttempt) {
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.ip === "current-ip" 
            ? { 
                ...attempt, 
                count: attempt.count + 1, 
                timestamp: Date.now() 
              } 
            : attempt
        )
      );
    } else {
      setLoginAttempts(prev => [
        ...prev,
        { ip: "current-ip", count: 1, timestamp: Date.now() }
      ]);
    }
    
    return false;
  };
  
  const register = (username: string, password: string, securityQuestion: SecurityQuestion) => {
    // Check if username already exists
    if (users.some(u => u.username === username)) {
      toast({
        title: "خطا",
        description: "این نام کاربری قبلاً استفاده شده است",
        variant: "destructive",
      });
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      isAdmin: false,
      securityQuestion,
      canComment: true
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: "ثبت نام موفق",
      description: "حساب کاربری با موفقیت ایجاد شد",
    });
    
    return true;
  };
  
  const logout = () => {
    setUser(null);
    resetCart();
  };
  
  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    
    // Verify current password
    if (user.password !== currentPassword) {
      return false;
    }
    
    // Update password
    setUsers(prev => 
      prev.map(u => 
        u.id === user.id ? { ...u, password: newPassword } : u
      )
    );
    
    // Update current user
    setUser({ ...user, password: newPassword });
    
    return true;
  };
  
  const resetPassword = (username: string, newPassword: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.username === username ? { ...u, password: newPassword } : u
      )
    );
  };
  
  const getUserSecurityQuestion = (username: string) => {
    const user = users.find(u => u.username === username);
    return user?.securityQuestion?.question || null;
  };
  
  const verifySecurityAnswer = (username: string, answer: string) => {
    const user = users.find(u => u.username === username);
    
    if (!user || !user.securityQuestion) return false;
    
    return user.securityQuestion.answer.toLowerCase() === answer.toLowerCase();
  };
  
  const checkLoginRateLimit = () => {
    const attempt = loginAttempts.find(a => a.ip === "current-ip");
    
    if (!attempt || attempt.count < 3) {
      return { limited: false, remainingTime: 0 };
    }
    
    const timeElapsed = Date.now() - attempt.timestamp;
    const lockoutTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (timeElapsed < lockoutTime) {
      return { limited: true, remainingTime: lockoutTime - timeElapsed };
    }
    
    return { limited: false, remainingTime: 0 };
  };
  
  const deleteUser = (userId: string) => {
    // Don't allow deleting current user
    if (user && user.id === userId) {
      toast({
        title: "خطا",
        description: "نمی‌توانید حساب کاربری خود را حذف کنید",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(prev => prev.filter(u => u.id !== userId));
    
    toast({
      title: "حذف کاربر",
      description: "کاربر با موفقیت حذف شد",
    });
  };
  
  const banUser = (userId: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, isBanned: true } : u
      )
    );
    
    toast({
      title: "مسدودسازی کاربر",
      description: "کاربر با موفقیت مسدود شد",
    });
  };
  
  const unbanUser = (userId: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, isBanned: false } : u
      )
    );
    
    toast({
      title: "رفع مسدودیت",
      description: "مسدودیت کاربر با موفقیت رفع شد",
    });
  };
  
  const resetUserPassword = (userId: string, newPassword: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, password: newPassword } : u
      )
    );
    
    toast({
      title: "تغییر رمز عبور",
      description: "رمز عبور کاربر با موفقیت تغییر کرد",
    });
  };

  // Admin functions
  const addAdmin = (userId: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isAdmin: true, 
              adminPermissions: {
                manageProducts: true,
                manageCategories: true,
                manageGiftCodes: true,
                manageUsers: false,
                viewPurchases: true,
                manageComments: true
              } 
            } 
          : u
      )
    );
    
    toast({
      title: "ارتقای کاربر",
      description: "کاربر با موفقیت به مدیر ارتقا یافت",
    });
  };
  
  const updateAdminPermissions = (userId: string, permissions: Partial<User['adminPermissions']>) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId && u.isAdmin && u.adminPermissions
          ? { 
              ...u, 
              adminPermissions: {
                ...u.adminPermissions,
                ...permissions
              } 
            } 
          : u
      )
    );
    
    toast({
      title: "بروزرسانی دسترسی‌ها",
      description: "دسترسی‌های مدیر با موفقیت بروزرسانی شد",
    });
    
    // Update current user if permissions were changed for them
    if (user && user.id === userId) {
      setUser(prev => {
        if (!prev || !prev.adminPermissions) return prev;
        
        return {
          ...prev,
          adminPermissions: {
            ...prev.adminPermissions,
            ...permissions
          }
        };
      });
    }
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
      adminPrefix: user.isAdmin && user.adminPermissions?.customPrefix,
      adminPrefixColor: user.isAdmin && user.adminPermissions?.customPrefixColor,
      text,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setComments(prev => [...prev, newComment]);
  };
  
  const addReply = (commentId: string, text: string) => {
    if (!user) return;
    
    const reply = {
      id: Date.now().toString(),
      commentId,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      adminPrefix: user.isAdmin && user.adminPermissions?.customPrefix,
      adminPrefixColor: user.isAdmin && user.adminPermissions?.customPrefixColor,
      text,
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] } 
          : comment
      )
    );
  };
  
  const getCommentsForProduct = (productId: string) => {
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
      createdAt: new Date().toISOString()
    };
    
    setPurchases(prev => [...prev, newPurchase]);
    clearCart();
  };
  
  // Context value
  const contextValue = {
    storeName,
    setStoreName,
    products,
    addProduct,
    editProduct,
    removeProduct,
    getProductByCustomId,
    categories,
    addCategory,
    removeCategory,
    editCategory,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    resetCart,
    calculateTotal,
    giftCodes,
    addGiftCode,
    applyGiftCode,
    appliedGiftCode,
    user,
    users,
    login,
    register,
    logout,
    changePassword,
    resetPassword,
    getUserSecurityQuestion,
    verifySecurityAnswer,
    checkLoginRateLimit,
    deleteUser,
    banUser,
    unbanUser,
    resetUserPassword,
    addAdmin,
    updateAdminPermissions,
    addComment,
    addReply,
    getCommentsForProduct,
    purchases,
    addPurchase
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
