
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, Plus, X, Upload, AlertCircle } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { formatPrice, formatDate } from "../../utils/formatters";
import { Product } from "../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const ProductManagement = () => {
  const { products, categories, addProduct, editProduct, removeProduct } = useAppContext();
  
  // State for adding a product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [images, setImages] = useState<string[]>(["/placeholder.svg"]);
  const [category, setCategory] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [customId, setCustomId] = useState("");
  
  // State for editing a product
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountedPrice, setEditDiscountedPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDetailedDescription, setEditDetailedDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editImageInput, setEditImageInput] = useState("");
  const [editCustomId, setEditCustomId] = useState("");
  
  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Handle file upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "خطا",
            description: `فایل ${file.name} بزرگتر از ۵ مگابایت است`,
            variant: "destructive",
          });
          continue;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "خطا",
            description: `فایل ${file.name} یک تصویر معتبر نیست`,
            variant: "destructive",
          });
          continue;
        }
        
        const base64 = await convertToBase64(file);
        
        if (isEdit) {
          setEditImages(prev => [...prev, base64]);
        } else {
          setImages(prev => {
            // Remove placeholder if it's the only image
            if (prev.length === 1 && prev[0] === "/placeholder.svg") {
              return [base64];
            }
            return [...prev, base64];
          });
        }
      }
      
      toast({
        title: "آپلود موفق",
        description: "تصاویر با موفقیت آپلود شدند",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در آپلود تصاویر رخ داده است",
        variant: "destructive",
      });
    }
    
    // Reset file input
    if (isEdit) {
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    } else {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  // Add an image via URL
  const addImage = () => {
    if (imageInput.trim() && !images.includes(imageInput)) {
      setImages(prev => {
        // Remove placeholder if it's the only image
        if (prev.length === 1 && prev[0] === "/placeholder.svg") {
          return [imageInput];
        }
        return [...prev, imageInput];
      });
      setImageInput("");
    }
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    // If no images left, add placeholder back
    if (newImages.length === 0) {
      newImages.push("/placeholder.svg");
    }
    
    setImages(newImages);
  };
  
  // Add an image in edit mode via URL
  const addEditImage = () => {
    if (editImageInput.trim() && !editImages.includes(editImageInput)) {
      setEditImages([...editImages, editImageInput]);
      setEditImageInput("");
    }
  };
  
  // Remove an image in edit mode
  const removeEditImage = (index: number) => {
    const newImages = [...editImages];
    newImages.splice(index, 1);
    
    // If no images left, add placeholder back
    if (newImages.length === 0) {
      newImages.push("/placeholder.svg");
    }
    
    setEditImages(newImages);
  };
  
  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditDiscountedPrice(product.discountedPrice.toString());
    setEditDescription(product.description);
    setEditDetailedDescription(product.detailedDescription || "");
    setEditCategory(product.category || "");
    setEditImages(product.images || ["/placeholder.svg"]);
    setEditCustomId(product.customId || "");
    setIsEditMode(true);
  };
  
  // Add product submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast({
        title: "خطا",
        description: "نام و توضیحات محصول اجباری است",
        variant: "destructive",
      });
      return;
    }
    
    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "خطا",
        description: "قیمت باید یک عدد مثبت باشد",
        variant: "destructive",
      });
      return;
    }
    
    // If discountedPrice is empty, use regular price
    let parsedDiscountedPrice = parsedPrice;
    if (discountedPrice) {
      parsedDiscountedPrice = parseInt(discountedPrice, 10);
      if (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0) {
        toast({
          title: "خطا",
          description: "قیمت با تخفیف باید یک عدد مثبت باشد",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate custom ID format (only lowercase letters, numbers, and hyphens)
    if (customId && !/^[a-z0-9-]+$/.test(customId)) {
      toast({
        title: "خطا",
        description: "شناسه سفارشی فقط می‌تواند شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد",
        variant: "destructive",
      });
      return;
    }
      
    const newProduct = {
      name,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description,
      detailedDescription: detailedDescription || undefined,
      images,
      category: category || undefined,
      customId: customId || undefined,
    };
    
    addProduct(newProduct);
    
    // Reset form
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setDetailedDescription("");
    setImages(["/placeholder.svg"]);
    setCategory("");
    setImageInput("");
    setCustomId("");
  };
  
  // Edit product submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editDescription.trim()) {
      toast({
        title: "خطا",
        description: "نام و توضیحات محصول اجباری است",
        variant: "destructive",
      });
      return;
    }
    
    const parsedPrice = parseInt(editPrice, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "خطا",
        description: "قیمت باید یک عدد مثبت باشد",
        variant: "destructive",
      });
      return;
    }
    
    // If discountedPrice is empty, use regular price
    let parsedDiscountedPrice = parsedPrice;
    if (editDiscountedPrice) {
      parsedDiscountedPrice = parseInt(editDiscountedPrice, 10);
      if (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0) {
        toast({
          title: "خطا",
          description: "قیمت با تخفیف باید یک عدد مثبت باشد",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate custom ID format (only lowercase letters, numbers, and hyphens)
    if (editCustomId && !/^[a-z0-9-]+$/.test(editCustomId)) {
      toast({
        title: "خطا",
        description: "شناسه سفارشی فقط می‌تواند شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد",
        variant: "destructive",
      });
      return;
    }
    
    editProduct(editingProductId, {
      name: editName,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description: editDescription,
      detailedDescription: editDetailedDescription || undefined,
      images: editImages,
      category: editCategory || undefined,
      customId: editCustomId || undefined,
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
            
            <div className="space-y-2">
              <Label htmlFor="category">دسته‌بندی</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customId">شناسه سفارشی (اختیاری)</Label>
              <Input
                id="customId"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="مثال: gaming-laptop"
              />
              <p className="text-xs text-muted-foreground">
                این شناسه برای URL سفارشی محصول استفاده می‌شود. فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>تصاویر محصول</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className="relative w-24 h-24 border rounded overflow-hidden group"
                >
                  <img 
                    src={image} 
                    alt={`Product ${index}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="آدرس تصویر را وارد کنید"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="w-64"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={addImage}
                  >
                    <Plus className="h-4 w-4 ml-1" />
                    افزودن
                  </Button>
                </div>
                
                <div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 ml-1" />
                    آپلود تصویر
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              می‌توانید آدرس URL تصاویر را وارد کرده یا از دستگاه خود آپلود کنید
            </p>
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
          
          <div className="space-y-2">
            <Label htmlFor="detailedDescription">توضیحات تکمیلی محصول (اختیاری)</Label>
            <Textarea
              id="detailedDescription"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="جزئیات بیشتر محصول را وارد کنید (اختیاری)"
              rows={6}
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
                <div className="aspect-square overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-contain"
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
                  {product.category && (
                    <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block mb-2">
                      {product.category}
                    </div>
                  )}
                  {product.customId && (
                    <div className="text-xs flex items-center mb-1">
                      <span className="text-muted-foreground ml-1">URL:</span>
                      <span className="font-mono">/p/{product.customId}</span>
                    </div>
                  )}
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
        <DialogContent className="max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>ویرایش محصول</DialogTitle>
            <DialogDescription>
              اطلاعات محصول را ویرایش کنید و سپس دکمه "ذخیره تغییرات" را کلیک کنید.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-10rem)] pr-4 -mr-4">
            <form onSubmit={handleEditSubmit} className="space-y-6 py-2">
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
                
                <div className="space-y-2">
                  <Label htmlFor="editCategory">دسته‌بندی</Label>
                  <Select 
                    value={editCategory} 
                    onValueChange={setEditCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editCustomId">شناسه سفارشی (اختیاری)</Label>
                  <Input
                    id="editCustomId"
                    value={editCustomId}
                    onChange={(e) => setEditCustomId(e.target.value)}
                    placeholder="مثال: gaming-laptop"
                  />
                  <p className="text-xs text-muted-foreground">
                    این شناسه برای URL سفارشی محصول استفاده می‌شود. فقط حروف انگلیسی کوچک، اعداد و خط تیره مجاز است.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>تصاویر محصول</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editImages.map((image, index) => (
                    <div 
                      key={index}
                      className="relative w-24 h-24 border rounded overflow-hidden group"
                    >
                      <img 
                        src={image} 
                        alt={`Product ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeEditImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="آدرس تصویر را وارد کنید"
                        value={editImageInput}
                        onChange={(e) => setEditImageInput(e.target.value)}
                        className="w-64"
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={addEditImage}
                      >
                        <Plus className="h-4 w-4 ml-1" />
                        افزودن
                      </Button>
                    </div>
                    
                    <div>
                      <input 
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, true)}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => editFileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 ml-1" />
                        آپلود تصویر
                      </Button>
                    </div>
                  </div>
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
              
              <div className="space-y-2">
                <Label htmlFor="editDetailedDescription">توضیحات تکمیلی محصول (اختیاری)</Label>
                <Textarea
                  id="editDetailedDescription"
                  value={editDetailedDescription}
                  onChange={(e) => setEditDetailedDescription(e.target.value)}
                  placeholder="جزئیات بیشتر محصول را وارد کنید (اختیاری)"
                  rows={6}
                />
              </div>
            </form>
          </ScrollArea>
          
          <DialogFooter className="pt-4 border-t mt-4">
            <div className="flex items-center text-amber-600 mr-auto">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">با کلیک روی دکمه زیر، تغییرات را ذخیره کنید.</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                لغو
              </Button>
              <Button type="button" onClick={handleEditSubmit}>
                ذخیره تغییرات
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
