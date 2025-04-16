
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "../../../types";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, formatDate } from "../../../utils/formatters";
import { removeProduct, configureAxiosCSRF } from "../../../utils/api";
import { toast } from "@/components/ui/use-toast";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (product: Product) => void;
}

const ProductList = ({ products, loading, error, onRefresh, onEdit }: ProductListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRemoveProduct = async (productId: string | number) => {
    try {
      setDeletingId(productId.toString());
      
      // First ensure CSRF token is set
      await configureAxiosCSRF();
      
      const result = await removeProduct(productId.toString());
      
      if (result) {
        toast({
          title: "محصول حذف شد",
          description: "محصول با موفقیت حذف شد",
        });
        
        onRefresh();
      }
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "خطا",
        description: "خطایی در حذف محصول رخ داد",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400 animate-pulse" />
        <p>در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 text-red-400" />
        <p>{error}</p>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={onRefresh}
        >
          تلاش مجدد
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
        <p>هیچ محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>تصویر</TableHead>
            <TableHead>نام محصول</TableHead>
            <TableHead>دسته‌بندی</TableHead>
            <TableHead>قیمت</TableHead>
            <TableHead>قیمت با تخفیف</TableHead>
            <TableHead>تاریخ ایجاد</TableHead>
            <TableHead>عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.images && product.images[0] ? product.images[0] : '/placeholder.svg'} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-md" 
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category || 'بدون دسته‌بندی'}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>
                {product.discountedPrice && product.discountedPrice < product.price 
                  ? formatPrice(product.discountedPrice) 
                  : 'بدون تخفیف'}
              </TableCell>
              <TableCell>{formatDate(product.createdAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveProduct(product.id)}
                    disabled={deletingId === product.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
