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
      images,
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

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">افزودن محصول جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields for product details */}
          <Button type="submit">افزودن محصول</Button>
        </form>
      </div>
      {/* Product List */}
    </div>
  );
};

export default ProductManagement;