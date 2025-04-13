
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { formatPrice, formatDate } from "../../utils/formatters";
import { Product } from "../../types";

const ProductManagement = () => {
  const { products, addProduct, editProduct, removeProduct } = useAppContext();
  
  // State for adding a product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>(["/placeholder.svg"]);
  
  // State for editing a product
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountedPrice, setEditDiscountedPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditDiscountedPrice(product.discountedPrice.toString());
    setEditDescription(product.description);
    setIsEditMode(true);
  };
  
  // Add product submit handler
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
  
  // Edit product submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedPrice = parseInt(editPrice, 10);
    const parsedDiscountedPrice = editDiscountedPrice ? 
      parseInt(editDiscountedPrice, 10) : 
      parsedPrice;
      
    editProduct(editingProductId, {
      name: editName,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description: editDescription,
    });
    
    setIsEditMode(false);
  };
  
  // Handle product delete
  const handleDeleteProduct = (id: string) => {
    if (window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      removeProduct(id);
    }
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
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <div className="flex space-s-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">ویرایش</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">حذف</span>
                      </Button>
                    </div>
                  </div>
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
      
      {/* Edit product dialog */}
      <Dialog open={isEditMode} onOpenChange={(open) => !open && setIsEditMode(false)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>ویرایش محصول</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="editName">نام محصول</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="نام محصول را وارد کنید"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editPrice">قیمت (تومان)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="قیمت را وارد کنید"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDiscountedPrice">قیمت با تخفیف (تومان)</Label>
                <Input
                  id="editDiscountedPrice"
                  type="number"
                  value={editDiscountedPrice}
                  onChange={(e) => setEditDiscountedPrice(e.target.value)}
                  placeholder="اختیاری - در صورت عدم تکمیل، همان قیمت اصلی استفاده می‌شود"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editDescription">توضیحات محصول</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="توضیحات محصول را وارد کنید"
                required
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                لغو
              </Button>
              <Button type="submit">
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
