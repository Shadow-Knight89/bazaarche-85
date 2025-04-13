
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../../components/Navbar";
import { useAppContext } from "../../contexts/AppContext";
import ProductManagement from "./ProductManagement";
import GiftCodeManagement from "./GiftCodeManagement";
import PurchaseHistory from "./PurchaseHistory";
import CategoryManagement from "./CategoryManagement";
import UserManagement from "./UserManagement";
import AdminManagement from "./AdminManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  // Redirect if not authorized
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  if (!user || !user.isAdmin) return null;
  
  // Check permissions
  const permissions = user.adminPermissions || {
    manageProducts: true,
    manageCategories: true,
    manageGiftCodes: true,
    manageUsers: false,
    viewPurchases: true,
    manageComments: true
  };
  
  // Determine which tabs to show based on permissions
  const showProductsTab = permissions.manageProducts !== false;
  const showCategoriesTab = permissions.manageCategories !== false;
  const showGiftCodesTab = permissions.manageGiftCodes !== false;
  const showPurchasesTab = permissions.viewPurchases !== false;
  const showUsersTab = permissions.manageUsers === true;
  const showAdminsTab = user.id === 'admin'; // Only the main admin can manage other admins
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">پنل مدیریت</h1>
        
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto">
            <TabsList className="mb-6">
              {showProductsTab && <TabsTrigger value="products">مدیریت محصولات</TabsTrigger>}
              {showCategoriesTab && <TabsTrigger value="categories">مدیریت دسته‌بندی‌ها</TabsTrigger>}
              {showGiftCodesTab && <TabsTrigger value="giftcodes">مدیریت کدهای تخفیف</TabsTrigger>}
              {showPurchasesTab && <TabsTrigger value="purchases">تاریخچه سفارشات</TabsTrigger>}
              {showUsersTab && <TabsTrigger value="users">مدیریت کاربران</TabsTrigger>}
              {showAdminsTab && <TabsTrigger value="admins">مدیریت ادمین‌ها</TabsTrigger>}
            </TabsList>
          </div>
          
          {showProductsTab && (
            <TabsContent value="products">
              <ProductManagement />
            </TabsContent>
          )}
          
          {showCategoriesTab && (
            <TabsContent value="categories">
              <CategoryManagement />
            </TabsContent>
          )}
          
          {showGiftCodesTab && (
            <TabsContent value="giftcodes">
              <GiftCodeManagement />
            </TabsContent>
          )}
          
          {showPurchasesTab && (
            <TabsContent value="purchases">
              <PurchaseHistory />
            </TabsContent>
          )}
          
          {showUsersTab && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}
          
          {showAdminsTab && (
            <TabsContent value="admins">
              <AdminManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
