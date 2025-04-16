
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "../../../types";
import { toast } from "@/components/ui/use-toast";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { removeProduct } from "../../../utils/api/products";

const ProductManagement: React.FC = () => {
  const { products, categories } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("list");
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setSelectedTab("add");
    }
  }, [productToEdit]);

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await removeProduct(productToDelete);
      toast({
        title: "محصول حذف شد",
        description: "محصول با موفقیت حذف شد",
      });
      // The product will be removed from the products list in the context
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "خطا",
        description: "مشکلی در حذف محصول به وجود آمد",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleProductSaved = () => {
    setSelectedTab("list");
    setProductToEdit(null);
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewClick = () => {
    setProductToEdit(null);
    setSelectedTab("add");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
          <p className="text-muted-foreground mt-2">
            افزودن، ویرایش و حذف محصولات فروشگاه
          </p>
        </div>
        <Button onClick={handleAddNewClick} className="mt-4 md:mt-0">
          افزودن محصول جدید
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">لیست محصولات</TabsTrigger>
          <TabsTrigger value="add">
            {productToEdit ? "ویرایش محصول" : "افزودن محصول"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <div className="flex items-center mb-6">
            <Input
              placeholder="جستجو در محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <ProductList
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </TabsContent>

        <TabsContent value="add">
          <ProductForm
            productToEdit={productToEdit}
            onProductSaved={handleProductSaved}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا از حذف این محصول مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات غیرقابل بازگشت است. محصول از سیستم حذف خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "در حال حذف..." : "بله، حذف شود"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
