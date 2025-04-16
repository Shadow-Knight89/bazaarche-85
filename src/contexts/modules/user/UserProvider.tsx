
import React, { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { User, SecurityQuestion, LoginAttempt } from "../../../types";
import { toast } from "@/components/ui/use-toast";
import { configureAxiosCSRF } from "../../../utils/api/base";
import { handleLogin, handleLogout, handleRegister } from "./auth";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  // Configure CSRF on initial load
  useEffect(() => {
    const initAuth = async () => {
      await configureAxiosCSRF();
      setIsAuthInitialized(true);
    };
    
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    return handleLogin(username, password, loginAttempts, setLoginAttempts, setUser);
  };
  
  const register = async (username: string, password: string, securityQuestion: SecurityQuestion) => {
    return handleRegister(username, password, securityQuestion, setUsers);
  };
  
  const logout = async () => {
    return handleLogout(setUser);
  };
  
  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return false;
    
    if (user.password !== currentPassword) {
      return false;
    }
    
    setUsers(prev => 
      prev.map(u => 
        u.id === user.id ? { ...u, password: newPassword } : u
      )
    );
    
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
    const lockoutTime = 5 * 60 * 1000;
    
    if (timeElapsed < lockoutTime) {
      return { limited: true, remainingTime: lockoutTime - timeElapsed };
    }
    
    return { limited: false, remainingTime: 0 };
  };
  
  const deleteUser = (userId: string) => {
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

  const value = {
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
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
