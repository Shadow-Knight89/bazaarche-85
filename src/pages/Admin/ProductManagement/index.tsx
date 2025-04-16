
import { useState, useEffect } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { Product } from "../../../types";
import { AlertCircle } from "lucide-react";
import { fetchProducts, configureAxiosCSRF } from "../../../utils/api";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const ProductManagement = () => {
  const { user } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Function to load products
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Configure CSRF token first
      await configureAxiosCSRF();
      
      // Then fetch products
      const productsData = await fetchProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('خطا در بارگذاری محصولات. لطفا مجدد تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSaved = (product: Product) => {
    if (editingProduct) {
      // Update existing product in the list
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === product.id ? product : p)
      );
      setEditingProduct(null);
    } else {
      // Add new product to the list
      setProducts(prevProducts => [...prevProducts, product]);
    }
  };

  // Check if user is not logged in or not an admin
  if (!user || !user.isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 mb-4 text-gray-400" />
        <h3 className="text-xl font-medium mb-2">دسترسی محدود شده</h3>
        <p className="text-muted-foreground">
          شما اجازه دسترسی به این بخش را ندارید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProductForm 
        product={editingProduct || undefined} 
        onSuccess={handleProductSaved}
        onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">لیست محصولات</h2>
        <ProductList 
          products={products}
          loading={isLoading}
          error={error}
          onRefresh={loadProducts}
          onEdit={setEditingProduct}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
