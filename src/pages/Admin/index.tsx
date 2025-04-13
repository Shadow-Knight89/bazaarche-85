
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../../components/Navbar";
import { useAppContext } from "../../contexts/AppContext";
import ProductManagement from "./ProductManagement";
import GiftCodeManagement from "./GiftCodeManagement";
import PurchaseHistory from "./PurchaseHistory";
import CategoryManagement from "./CategoryManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("products");
  const navigate = useNavigate();
  const { user } = useAppContext();
  
  // Redirect if not admin
  if (!user || !user.isAdmin) {
    navigate("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">پنل مدیریت</h1>
        
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="products">مدیریت محصولات</TabsTrigger>
            <TabsTrigger value="categories">مدیریت دسته‌بندی‌ها</TabsTrigger>
            <TabsTrigger value="giftcodes">مدیریت کدهای تخفیف</TabsTrigger>
            <TabsTrigger value="purchases">تاریخچه سفارشات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          
          <TabsContent value="giftcodes">
            <GiftCodeManagement />
          </TabsContent>
          
          <TabsContent value="purchases">
            <PurchaseHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
