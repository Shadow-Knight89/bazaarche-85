
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../../types";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  removeProduct as apiRemoveProduct
} from "../../utils/api";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  editProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProductByCustomId: (customId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "گوشی هوشمند سامسونگ گلکسی A52",
      price: 8500000,
      discountedPrice: 7200000,
      description: "گوشی هوشمند با صفحه نمایش AMOLED و دوربین چهارگانه",
      detailedDescription: "این گوشی دارای صفحه نمایش 6.5 اینچی Super AMOLED با رزولوشن 1080x2400 پیکسل، دوربین اصلی 64 مگاپیکسلی، باتری 4500 میلی‌آمپر ساعت و پردازنده اسنپدراگون 720G است.",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/3b80e5838f5ff024e54c3d128dcd11f859dc31be_1656426741.jpg",
        "https://dkstatics-public.digikala.com/digikala-products/073c9749b9bee4add3561584cd35e845d0fb2357_1656426748.jpg"
      ],
      category: "گوشی هوشمند",
      createdAt: "2023-01-15T10:30:00Z",
      customId: "samsung-a52"
    },
    {
      id: "2",
      name: "لپ تاپ لنوو IdeaPad 3",
      price: 22000000,
      discountedPrice: 20500000,
      description: "لپ تاپ مناسب برای کارهای روزمره و دانشجویی",
      detailedDescription: "این لپ تاپ دارای پردازنده Core i5 نسل 11، حافظه رم 8 گیگابایت DDR4، حافظه داخلی 512 گیگابایت SSD و صفحه نمایش 15.6 اینچی با رزولوشن 1080p است.",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/29f5a02ab5c9d82f0cf817d365a0dfb0da1211ea_1675854730.jpg"
      ],
      category: "لپ تاپ",
      createdAt: "2023-02-20T14:15:00Z"
    },
    {
      id: "3",
      name: "هدفون بی سیم اپل AirPods Pro",
      price: 9800000,
      discountedPrice: 9300000,
      description: "هدفون بی سیم با قابلیت حذف نویز محیط",
      images: [
        "https://dkstatics-public.digikala.com/digikala-products/113639098.jpg"
      ],
      category: "لوازم جانبی",
      createdAt: "2023-03-05T09:45:00Z",
      customId: "airpods-pro"
    }
  ]);

  // Load products from API on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        if (productsData && Array.isArray(productsData)) {
          // Transform products from Django format
          const formattedProducts = productsData.map(product => ({
            ...product,
            id: product.id.toString(),
            // Handle category that might be an ID or object from Django
            category: product.category?.name || product.category,
            createdAt: product.createdAt || new Date().toISOString(),
            // Ensure images is always an array
            images: Array.isArray(product.images) ? product.images : []
          }));
          
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    
    loadProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    // Check if customId already exists
    if (product.customId && products.some(p => p.customId === product.customId)) {
      toast({
        title: "خطا",
        description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format data for Django
      const productForDjango = {
        ...product,
        // Convert string category to ID if needed
        category: typeof product.category === 'string' && !isNaN(parseInt(product.category)) 
          ? parseInt(product.category) 
          : product.category
      };
      
      // Send to API
      const response = await createProduct(productForDjango);
      
      if (response) {
        // Add to local state - convert from Django format if needed
        const formattedProduct = {
          ...response,
          id: response.id.toString(),
          // Format category if needed
          category: response.category?.name || response.category,
          createdAt: response.createdAt || new Date().toISOString()
        };
        setProducts((prev) => [...prev, formattedProduct]);
        
        toast({
          title: "محصول جدید",
          description: "محصول با موفقیت اضافه شد",
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const editProduct = async (id: string, product: Partial<Product>) => {
    // Check if customId is being changed and ensure it's unique
    if (product.customId) {
      const existingWithCustomId = products.find(
        p => p.customId === product.customId && p.id !== id
      );
      
      if (existingWithCustomId) {
        toast({
          title: "خطا",
          description: "شناسه سفارشی تکراری است. لطفا شناسه دیگری انتخاب کنید.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      // Get current product
      const currentProduct = products.find(p => p.id === id);
      if (!currentProduct) return;
      
      // Format data for Django
      const productForDjango = {
        ...product,
        // Convert string category to ID if needed
        category: typeof product.category === 'string' && !isNaN(parseInt(product.category)) 
          ? parseInt(product.category) 
          : product.category
      };
      
      // Merge current with updates
      const updatedProduct = { ...currentProduct, ...productForDjango };
      
      // Send to API
      await updateProduct(id, updatedProduct);
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === id ? { ...p, ...product } : p
        )
      );
      
      toast({
        title: "ویرایش محصول",
        description: "محصول با موفقیت ویرایش شد",
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  const removeProduct = async (id: string) => {
    try {
      // Send delete request to API - using the imported function
      await apiRemoveProduct(id);
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      
      toast({
        title: "حذف محصول",
        description: "محصول با موفقیت حذف شد",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  const getProductByCustomId = (customId: string) => {
    return products.find(p => p.customId === customId);
  };

  const value = {
    products,
    addProduct,
    editProduct,
    removeProduct,
    getProductByCustomId
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
