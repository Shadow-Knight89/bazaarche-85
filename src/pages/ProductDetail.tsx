
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { formatPrice } from "../utils/formatters";
import { useAppContext } from "../contexts/AppContext";
import CommentSection from "../components/CommentSection";
import { fetchProduct, fetchProductByCustomId } from "../utils/api";

const ProductDetail = () => {
  const { productId, customId } = useParams();
  const navigate = useNavigate();
  const { addToCart, categories } = useAppContext();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productData = null;
        
        if (customId) {
          // If we're using a custom ID (from /p/:customId route)
          productData = await fetchProductByCustomId(customId);
        } else if (productId) {
          // If we're using the numeric ID (from /products/:productId route)
          productData = await fetchProduct(productId);
        }
        
        if (productData) {
          setProduct(productData);
        } else {
          setError("محصول مورد نظر یافت نشد");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setError("خطا در بارگذاری اطلاعات محصول");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId, customId]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories?.find(c => c.id === categoryId);
    return category ? category.name : "دسته‌بندی نشده";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">در حال بارگذاری اطلاعات محصول...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-lg text-red-500 mb-4">{error || "محصول یافت نشد"}</div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به صفحه اصلی
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.price !== product.discountedPrice;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - (product.discountedPrice / product.price)) * 100)
    : 0;

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="ml-2 h-4 w-4" />
        بازگشت
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted overflow-hidden rounded-lg border">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                بدون تصویر
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 space-x-reverse">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border rounded overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary' : ''}`}
                >
                  <img src={image} alt={`${product.name} ${index+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
          
          {product.category && (
            <div className="text-muted-foreground mb-4">
              دسته‌بندی: {getCategoryName(product.category)}
            </div>
          )}
          
          <div className="border-t border-b py-4 my-4">
            <div className="flex items-center">
              {hasDiscount && (
                <>
                  <span className="text-muted-foreground line-through ml-4">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    {discountPercentage}% تخفیف
                  </span>
                </>
              )}
              <span className="text-2xl font-bold text-primary mr-4">
                {formatPrice(product.discountedPrice)}
              </span>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none mb-6">
            <p>{product.description}</p>
          </div>
          
          {product.detailedDescription && (
            <div className="prose prose-sm max-w-none mb-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">توضیحات تکمیلی</h3>
              <p>{product.detailedDescription}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-4 space-x-reverse mt-6">
            <div className="flex border rounded-md">
              <button 
                className="px-3 py-1 border-l"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                className="px-3 py-1 border-r"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
            
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="ml-2 h-4 w-4" />
              افزودن به سبد خرید
            </Button>
            
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="border-t pt-8">
        <CommentSection productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetail;
