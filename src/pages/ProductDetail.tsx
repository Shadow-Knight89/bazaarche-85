import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProduct, fetchProductByCustomId } from "../utils/api";
import { Product } from "../types";
import { useAppContext } from "../contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import CommentSection from "../components/CommentSection";

const ProductDetail = () => {
  const { productId, customId } = useParams<{ productId: string; customId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        
        if (productId) {
          data = await fetchProduct(productId);
        } else if (customId) {
          data = await fetchProductByCustomId(customId);
        } else {
          throw new Error("Invalid product identifier");
        }
        
        if (data) {
          setProduct(data);
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError("محصول مورد نظر یافت نشد");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId, customId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">خطا</h2>
        <p className="mb-8">{error || "محصول مورد نظر یافت نشد"}</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          بازگشت به صفحه اصلی
        </Button>
      </div>
    );
  }

  const hasDiscount = product.price !== product.discountedPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                بدون تصویر
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="line-through text-gray-500">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-primary font-bold text-lg">
                {formatPrice(product.discountedPrice)}
              </span>
            </div>
            <p className="text-gray-700">{product.description}</p>
            {product.detailedDescription && (
              <p className="text-gray-700">{product.detailedDescription}</p>
            )}
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="ml-2 h-4 w-4" />
              افزودن به سبد خرید
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <CommentSection productId={product.id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
