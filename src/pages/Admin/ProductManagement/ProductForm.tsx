
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "../../../components/ImageUploader";
import { toast } from "@/components/ui/use-toast";
import { Product } from "../../../types";
import { createProduct, updateProduct } from "../../../utils/api";

interface ProductFormProps {
  productToEdit: Product | null;
  onProductSaved: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onProductSaved }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [category, setCategory] = useState("");
  const [customId, setCustomId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { categories } = useAppContext();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description || "");
      setDetailedDescription(productToEdit.detailedDescription || "");
      setPrice(productToEdit.price.toString());
      setDiscountedPrice(productToEdit.discountedPrice.toString());
      setCategory(productToEdit.category || "");
      setCustomId(productToEdit.customId || "");
      setImages(productToEdit.images || []);
    } else {
      resetForm();
    }
  }, [productToEdit]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setDetailedDescription("");
    setPrice("");
    setDiscountedPrice("");
    setCategory("");
    setCustomId("");
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !discountedPrice || !description) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name,
      description,
      detailedDescription,
      price: Number(price),
      discountedPrice: Number(discountedPrice),
      category,
      customId: customId || undefined,
      images,
    };

    console.log("Adding/updating product: ", productData);
    
    setIsLoading(true);
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
        toast({
          title: "محصول بروزرسانی شد",
          description: `${name} با موفقیت بروزرسانی شد`,
        });
      } else {
        await createProduct(productData);
        toast({
          title: "محصول جدید",
          description: `${name} با موفقیت اضافه شد`,
        });
        resetForm();
      }
      onProductSaved();
    } catch (error) {
      console.error("Error adding/updating product:", error);
      toast({
        title: "خطا",
        description: "مشکلی در ذخیره محصول به وجود آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setImages((prevImages) => [...prevImages, imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">نام محصول *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام محصول را وارد کنید"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customId">شناسه سفارشی (اختیاری)</Label>
          <Input
            id="customId"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="شناسه سفارشی برای URL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">قیمت اصلی (تومان) *</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="قیمت اصلی محصول"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountedPrice">قیمت با تخفیف (تومان) *</Label>
          <Input
            id="discountedPrice"
            type="number"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            placeholder="قیمت بعد از تخفیف"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون دسته‌بندی</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">توضیحات کوتاه *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="توضیحات کوتاه محصول"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="detailedDescription">توضیحات کامل</Label>
        <Textarea
          id="detailedDescription"
          value={detailedDescription}
          onChange={(e) => setDetailedDescription(e.target.value)}
          placeholder="توضیحات کامل محصول"
          rows={6}
        />
      </div>

      <div className="space-y-4">
        <Label>تصاویر محصول</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="aspect-square object-cover rounded-md border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
                type="button"
              >
                ×
              </Button>
            </div>
          ))}
          <ImageUploader onImageUploaded={handleImageUpload} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "در حال ذخیره..."
            : productToEdit
            ? "بروزرسانی محصول"
            : "افزودن محصول"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isLoading}
        >
          پاک کردن فرم
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
