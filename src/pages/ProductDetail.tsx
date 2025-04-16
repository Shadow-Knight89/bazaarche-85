
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Share2 } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import { useAppContext } from "../contexts/AppContext";
import { Product } from "../types";
import { fetchProduct, fetchProductByCustomId } from "../utils/api";
import { toast } from "@/components/ui/use-toast";
import CommentSection from "../components/CommentSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ProductDetail = () => {
  const { productId, customId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productData;
        
        if (productId) {
          productData = await fetchProduct(productId);
        } else if (customId) {
          productData = await fetchProductByCustomId(customId);
        } else {
          throw new Error("No product identifier provided");
        }
        
        if (!productData) {
          throw new Error("محصول یافت نشد");
        }
        
        setProduct(productData);
        if (productData.images && productData.images.length > 0) {
          setActiveImage(productData.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("محصول مورد نظر یافت نشد");
        
        // Redirect to 404 page after a delay
        setTimeout(() => {
          navigate("/not-found", { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId, customId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch(err => {
        console.error("Error sharing:", err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "کپی شد",
        description: "لینک محصول در کلیپ‌بورد کپی شد",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
          <div className="h-80 bg-gray-200 rounded mb-6"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-1/2 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">خطا</h1>
        <p>{error || "محصول یافت نشد"}</p>
        <p className="mt-4">در حال انتقال به صفحه 404...</p>
      </div>
    );
  }

  const hasDiscount = product.price !== product.discountedPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden border rounded-md">
            <AspectRatio ratio={1} className="bg-white">
              <img 
                src={activeImage || (product.images && product.images[0])} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </AspectRatio>
          </Card>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`w-16 h-16 border rounded-md p-1 ${activeImage === image ? 'border-primary' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - تصویر ${index+1}`} 
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">قیمت:</span>
                  <div className="flex flex-col items-end">
                    {hasDiscount && (
                      <span className="line-through text-sm text-gray-400">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.discountedPrice)}
                    </span>
                  </div>
                </div>
                
                {hasDiscount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">میزان تخفیف:</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                      {Math.round((1 - product.discountedPrice / product.price) * 100)}%
                    </span>
                  </div>
                )}
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    افزودن به سبد خرید
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareProduct}
                    className="gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    اشتراک‌گذاری
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Description Box - Added as requested */}
      <div className="mt-12">
        <Card className="w-full overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">توضیحات محصول</h2>
            <div className="prose max-w-none">
              {product.detailedDescription ? (
                <p className="whitespace-pre-line text-gray-700">{product.detailedDescription}</p>
              ) : (
                <p className="whitespace-pre-line text-gray-700">{product.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12">
        <CommentSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
