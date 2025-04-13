
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "../../contexts/AppContext";
import { formatPrice, formatDate } from "../../utils/formatters";
import { Product } from "../../types";

const ProductManagement = () => {
  const { products, addProduct } = useAppContext();
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>(["/placeholder.svg"]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedPrice = parseInt(price, 10);
    // If discountedPrice is empty, use regular price
    const parsedDiscountedPrice = discountedPrice ? 
      parseInt(discountedPrice, 10) : 
      parsedPrice;
      
    const newProduct = {
      name,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description,
      images,
    };
    
    addProduct(newProduct);
    
    // Reset form
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setImages(["/placeholder.svg"]);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">افزودن محصول جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام محصول را وارد کنید"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="قیمت را وارد کنید"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">قیمت با تخفیف (تومان)</Label>
              <Input
                id="discountedPrice"
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="اختیاری - در صورت عدم تکمیل، همان قیمت اصلی استفاده می‌شود"
              />
            </div>
            
            {/* In a real app, we would add an image upload feature here */}
            <div className="space-y-2">
              <Label htmlFor="image">تصویر</Label>
              <Input
                id="image"
                value="Placeholder image"
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                در این نسخه، تصویر پیش‌فرض استفاده می‌شود
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات محصول</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات محصول را وارد کنید"
              required
              rows={4}
            />
          </div>
          
          <Button type="submit">افزودن محصول</Button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">لیست محصولات</h2>
        
        {products.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            هنوز محصولی اضافه نشده است
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-[3/2] overflow-hidden">
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
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 truncate">{product.name}</h3>
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground ml-2">قیمت:</span>
                    <span className={product.price !== product.discountedPrice ? "line-through" : ""}>
                      {formatPrice(product.price)}
                    </span>
                    
                    {product.price !== product.discountedPrice && (
                      <div className="text-primary font-medium">
                        {formatPrice(product.discountedPrice)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(product.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
