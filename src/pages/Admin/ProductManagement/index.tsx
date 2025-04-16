
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Product } from "../../../types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setActiveTab("add");
  };

  const handleProductSaved = () => {
    setActiveTab("list");
    setProductToEdit(null);
  };

  const handleCancelEdit = () => {
    setProductToEdit(null);
    setActiveTab("list");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>مدیریت محصولات</CardTitle>
            {productToEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit}
                className="flex items-center gap-1"
              >
                <X size={16} />
                انصراف از ویرایش
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[300px] mb-4">
              <TabsTrigger value="list">لیست محصولات</TabsTrigger>
              <TabsTrigger value="add">
                {productToEdit ? "ویرایش محصول" : "افزودن محصول"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <ProductList onEditProduct={handleEditProduct} />
            </TabsContent>
            <TabsContent value="add">
              <ProductForm 
                productToEdit={productToEdit} 
                onProductSaved={handleProductSaved} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
