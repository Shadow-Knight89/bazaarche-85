
import React from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "../../../utils/formatters";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "../../../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEditProduct, onDeleteProduct }) => {
  const { products, categories } = useAppContext();

  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return "بدون دسته‌بندی";
    const category = categories?.find((c) => c.id === categoryId);
    return category ? category.name : "بدون دسته‌بندی";
  };

  if (!products || products.length === 0) {
    return (
      <Alert>
        <AlertTitle>محصولی یافت نشد</AlertTitle>
        <AlertDescription>
          هیچ محصولی در سیستم ثبت نشده است. با استفاده از فرم زیر، محصول جدید
          اضافه کنید.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {product.images && product.images.length > 0 ? (
                <div className="w-full md:w-24 h-24">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-24 h-24 bg-muted flex items-center justify-center text-muted-foreground">
                  بدون تصویر
                </div>
              )}
              <div className="flex-1 p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {getCategoryName(product.category)}
                  </p>
                </div>
                <div className="flex flex-col items-end mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    {product.price !== product.discountedPrice && (
                      <span className="text-sm line-through text-muted-foreground">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    <span className="font-bold">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      ویرایش
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
