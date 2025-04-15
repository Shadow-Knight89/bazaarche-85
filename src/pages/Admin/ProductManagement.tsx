import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, X, Upload, AlertCircle } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { formatPrice, formatDate } from "../../utils/formatters";
import { Product } from "../../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadImage, createProduct, updateProduct, removeProduct } from "../../utils/api";

const ProductManagement = () => {
  const { products, categories } = useAppContext();

  // State for adding/updating a product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [images, setImages] = useState<string[]>(["/placeholder.svg"]);
  const [category, setCategory] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [customId, setCustomId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadImage(formData);
      if (response && response.url) {
        setImages([...images.filter(img => img !== "/placeholder.svg"), response.url]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطا",
        description: "آپلود تصویر با مشکل مواجه شد",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle product submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast({ title: "خطا", description: "نام و توضیحات محصول اجباری است", variant: "destructive" });
      return;
    }

    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({ title: "خطا", description: "قیمت باید یک عدد مثبت باشد", variant: "destructive" });
      return;
    }

    let parsedDiscountedPrice = parsedPrice;
    if (discountedPrice) {
      parsedDiscountedPrice = parseInt(discountedPrice, 10);
      if (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0) {
        toast({ title: "خطا", description: "قیمت با تخفیف باید یک عدد مثبت باشد", variant: "destructive" });
        return;
      }
    }

    const newProduct = {
      name,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description,
      detailedDescription: detailedDescription || undefined,
      images: images.filter(img => img !== "/placeholder.svg"),
      category: category ? categories.find(cat => cat.name === category)?.id : undefined,
      customId: customId || undefined,
    };

    console.log("Adding/updating product:", newProduct);
    
    try {
      if (isEditing && currentProductId) {
        await updateProduct(currentProductId.toString(), newProduct);
        toast({
          title: "محصول ویرایش شد",
          description: "محصول با موفقیت ویرایش شد",
        });
      } else {
        await createProduct(newProduct);
        toast({
          title: "محصول اضافه شد",
          description: "محصول با موفقیت اضافه شد",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast({
        title: "خطا",
        description: "خطایی در افزودن یا ویرایش محصول رخ داد",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDiscountedPrice("");
    setDescription("");
    setDetailedDescription("");
    setImages(["/placeholder.svg"]);
    setCategory("");
    setImageInput("");
    setCustomId("");
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleAddImageFromUrl = () => {
    if (!imageInput.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً یک آدرس URL وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    setImages([...images.filter(img => img !== "/placeholder.svg"), imageInput]);
    setImageInput("");
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    if (newImages.length === 0) {
      newImages.push("/placeholder.svg");
    }
    
    setImages(newImages);
  };

  const handleEditProduct = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setDiscountedPrice(product.discountedPrice?.toString() || "");
    setDescription(product.description);
    setDetailedDescription(product.detailedDescription || "");
    setImages(product.images);
    setCategory(product.category);
    setCustomId(product.customId || "");
    setCurrentProductId(product.id);
    setIsEditing(true);
  };

  const handleRemoveProduct = async (productId: string | number) => {
    try {
      await removeProduct(productId.toString());
      toast({
        title: "محصول حذف شد",
        description: "محصول با موفقیت حذف شد",
      });
    } catch (error) {
      console.error("Error removing product:", error);
      toast({
        title: "خطا",
        description: "خطایی در حذف محصول رخ داد",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">{isEditing ? "ویرایش محصول" : "افزودن محصول جدید"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="نام محصول را وارد کنید" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">دسته‌بندی</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون دسته‌بندی</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان)</Label>
              <Input 
                id="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                placeholder="قیمت را وارد کنید" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">قیمت با تخفیف (تومان)</Label>
              <Input 
                id="discountedPrice" 
                type="number" 
                value={discountedPrice} 
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="اختیاری" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">توضیحات کوتاه</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیحات کوتاه محصول را وارد کنید" 
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="detailedDescription">توضیحات کامل</Label>
              <Textarea 
                id="detailedDescription" 
                value={detailedDescription} 
                onChange={(e) => setDetailedDescription(e.target.value)}
                placeholder="اختیاری" 
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customId">شناسه سفارشی (slug)</Label>
              <Input 
                id="customId" 
                value={customId} 
                onChange={(e) => setCustomId(e.target.value)}
                placeholder="مثال: samsung-s22" 
              />
              <p className="text-xs text-gray-500">
                فقط شامل حروف انگلیسی کوچک، اعداد و خط تیره
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Label>تصاویر محصول</Label>
            
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`تصویر ${index + 1}`} 
                    className="w-24 h-24 object-cover border rounded-md" 
                  />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input 
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="آدرس URL تصویر را وارد کنید"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddImageFromUrl}
              >
                افزودن
              </Button>
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept="image/*"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                {isUploading ? (
                  <span>در حال آپلود...</span>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    آپلود تصویر
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto">{isEditing ? "به‌روزرسانی محصول" : "افزودن محصول"}</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">لیست محصولات</h2>

        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p>هیچ محصولی یافت نشد</p>
          </div>
        ) : (
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
                        src={product.images[0] || '/placeholder.svg'} 
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
                          onClick={() => handleEditProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveProduct(product.id)}
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
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
