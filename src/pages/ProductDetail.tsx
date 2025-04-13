
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { formatPrice, formatDate } from "../utils/formatters";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import CommentSection from "../components/CommentSection";

const ProductDetail = () => {
  const { productId, customId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { products, addToCart, user, getProductByCustomId } = useAppContext();
  const [activeImage, setActiveImage] = useState(0);
  
  // Find the product by ID or custom ID
  let product = productId ? products.find((p) => p.id === productId) : null;
  
  if (!product && customId) {
    product = getProductByCustomId(customId);
  }
  
  // Handle if product not found
  useEffect(() => {
    if (!product && (productId || customId)) {
      navigate("/not-found");
    }
  }, [product, productId, customId, navigate]);
  
  if (!product) {
    return null;
  }
  
  const hasDiscount = product.price !== product.discountedPrice;
  
  // Find similar products (same category)
  const similarProducts = products.filter(p => 
    p.id !== product.id && p.category === product.category
  ).slice(0, 4);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت
          </Button>
          
          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={product.images[activeImage] || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-s-2 overflow-x-auto py-2 rtl">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                      activeImage === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex flex-col space-y-1">
              {hasDiscount && (
                <span className="line-through text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="font-bold text-3xl text-primary">
                {formatPrice(product.discountedPrice)}
              </span>
              
              {hasDiscount && (
                <div className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium mt-2">
                  {Math.round((1 - product.discountedPrice / product.price) * 100)}% تخفیف
                </div>
              )}
            </div>
            
            {product.category && (
              <div>
                <span className="text-sm text-muted-foreground">دسته‌بندی:</span>
                <span className="mr-2 text-sm font-medium">{product.category}</span>
              </div>
            )}
            
            {product.customId && (
              <div className="text-xs flex items-center">
                <span className="text-muted-foreground ml-1">شناسه محصول:</span>
                <span className="font-mono">{product.customId}</span>
              </div>
            )}
            
            <Button 
              onClick={() => addToCart(product)}
              className="w-full lg:w-auto"
            >
              <ShoppingCart className="ml-2 h-4 w-4" />
              افزودن به سبد خرید
            </Button>
            
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">توضیحات</TabsTrigger>
                {product.detailedDescription && (
                  <TabsTrigger value="details">جزئیات بیشتر</TabsTrigger>
                )}
              </TabsList>
              <TabsContent value="description" className="p-4 border rounded-md mt-2">
                <p>{product.description}</p>
              </TabsContent>
              {product.detailedDescription && (
                <TabsContent value="details" className="p-4 border rounded-md mt-2">
                  <p>{product.detailedDescription}</p>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="text-xs text-muted-foreground">
              تاریخ اضافه شدن: {formatDate(product.createdAt)}
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">محصولات مشابه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map(similarProduct => (
                <Card key={similarProduct.id} className="overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={similarProduct.images[0] || "/placeholder.svg"}
                      alt={similarProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{similarProduct.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">
                        {formatPrice(similarProduct.discountedPrice)}
                      </span>
                      <Link to={
                          similarProduct.customId 
                          ? `/p/${similarProduct.customId}` 
                          : `/products/${similarProduct.id}`
                        }>
                        <Button variant="outline" size="sm">مشاهده</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        <CommentSection productId={product.id} />
      </main>
    </div>
  );
};

export default ProductDetail;
