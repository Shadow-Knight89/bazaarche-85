
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadImage } from "../../utils/api";

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
  const [isUploading, setIsUploading] = useState(false);
  
  // State for editing product
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountedPrice, setEditDiscountedPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDetailedDescription, setEditDetailedDescription] = useState("");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState("");
  const [editImageInput, setEditImageInput] = useState("");
  const [editCustomId, setEditCustomId] = useState("");

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Add image from URL
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

  // Add image from URL (edit form)
  const handleEditAddImageFromUrl = () => {
    if (!editImageInput.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً یک آدرس URL وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    setEditImages([...editImages, editImageInput]);
    setEditImageInput("");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    if (newImages.length === 0) {
      newImages.push("/placeholder.svg");
    }
    
    setImages(newImages);
  };

  // Remove image (edit form)
  const handleEditRemoveImage = (index: number) => {
    const newImages = [...editImages];
    newImages.splice(index, 1);
    setEditImages(newImages);
  };

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
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file upload (edit form)
  const handleEditFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadImage(formData);
      
      if (response && response.url) {
        setEditImages([...editImages, response.url]);
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
      // Clear the file input
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };

  // Open file dialog
  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Open file dialog (edit form)
  const handleOpenEditFileDialog = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.click();
    }
  };

  // Handle product submit
  const handleSubmit = (e: React.FormEvent) => {
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

    if (customId && !/^[a-z0-9-]+$/.test(customId)) {
      toast({ title: "خطا", description: "شناسه سفارشی فقط می‌تواند شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد", variant: "destructive" });
      return;
    }

    const newProduct = {
      name,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description,
      detailedDescription: detailedDescription || undefined,
      images: images.filter(img => img !== "/placeholder.svg"),
      category: category || undefined,
      customId: customId || undefined,
    };

    console.log("Adding product:", newProduct);
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

  // Open edit dialog
  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditDiscountedPrice(product.discountedPrice ? product.discountedPrice.toString() : "");
    setEditDescription(product.description);
    setEditDetailedDescription(product.detailedDescription || "");
    setEditImages(product.images);
    setEditCategory(product.category || "");
    setEditCustomId(product.customId || "");
    setIsEditDialogOpen(true);
  };

  // Handle edit product submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    if (!editName.trim() || !editDescription.trim()) {
      toast({ title: "خطا", description: "نام و توضیحات محصول اجباری است", variant: "destructive" });
      return;
    }

    const parsedPrice = parseInt(editPrice, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({ title: "خطا", description: "قیمت باید یک عدد مثبت باشد", variant: "destructive" });
      return;
    }

    let parsedDiscountedPrice = parsedPrice;
    if (editDiscountedPrice) {
      parsedDiscountedPrice = parseInt(editDiscountedPrice, 10);
      if (isNaN(parsedDiscountedPrice) || parsedDiscountedPrice < 0) {
        toast({ title: "خطا", description: "قیمت با تخفیف باید یک عدد مثبت باشد", variant: "destructive" });
        return;
      }
    }

    if (editCustomId && !/^[a-z0-9-]+$/.test(editCustomId)) {
      toast({ title: "خطا", description: "شناسه سفارشی فقط می‌تواند شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد", variant: "destructive" });
      return;
    }

    const updatedProduct = {
      name: editName,
      price: parsedPrice,
      discountedPrice: parsedDiscountedPrice,
      description: editDescription,
      detailedDescription: editDetailedDescription || undefined,
      images: editImages,
      category: editCategory || undefined,
      customId: editCustomId || undefined,
    };

    editProduct(editingProduct.id, updatedProduct);
    setIsEditDialogOpen(false);
  };

  // Handle delete product
  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
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
                onClick={handleOpenFileDialog}
                disabled={isUploading}
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
          
          <Button type="submit" className="w-full md:w-auto">افزودن محصول</Button>
        </form>
      </div>

      {/* Product List */}
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
                      {product.discountedPrice < product.price 
                        ? formatPrice(product.discountedPrice) 
                        : 'بدون تخفیف'}
                    </TableCell>
                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(product.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>ویرایش محصول</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
            <form onSubmit={handleEditSubmit} className="space-y-6 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">نام محصول</Label>
                  <Input 
                    id="edit-name" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="نام محصول را وارد کنید" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">دسته‌بندی</Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
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
                  <Label htmlFor="edit-price">قیمت (تومان)</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(e.target.value)}
                    placeholder="قیمت را وارد کنید" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-discountedPrice">قیمت با تخفیف (تومان)</Label>
                  <Input 
                    id="edit-discountedPrice" 
                    type="number" 
                    value={editDiscountedPrice} 
                    onChange={(e) => setEditDiscountedPrice(e.target.value)}
                    placeholder="اختیاری" 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-description">توضیحات کوتاه</Label>
                  <Textarea 
                    id="edit-description" 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="توضیحات کوتاه محصول را وارد کنید" 
                    rows={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-detailedDescription">توضیحات کامل</Label>
                  <Textarea 
                    id="edit-detailedDescription" 
                    value={editDetailedDescription} 
                    onChange={(e) => setEditDetailedDescription(e.target.value)}
                    placeholder="اختیاری" 
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-customId">شناسه سفارشی (slug)</Label>
                  <Input 
                    id="edit-customId" 
                    value={editCustomId} 
                    onChange={(e) => setEditCustomId(e.target.value)}
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
                  {editImages.map((image, index) => (
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
                        onClick={() => handleEditRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    value={editImageInput}
                    onChange={(e) => setEditImageInput(e.target.value)}
                    placeholder="آدرس URL تصویر را وارد کنید"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleEditAddImageFromUrl}
                  >
                    افزودن
                  </Button>
                </div>

                <div>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleEditFileUpload}
                    accept="image/*"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleOpenEditFileDialog}
                    disabled={isUploading}
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
              
              <DialogFooter>
                <Button type="submit">ذخیره تغییرات</Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
