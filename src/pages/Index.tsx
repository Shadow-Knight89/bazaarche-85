import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"; // Import Input component
import { Button } from "@/components/ui/button"; // Import Button component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import Navbar from "../components/Navbar"; // Import your Navbar
import ProductCard from "../components/ProductCard"; // Import your ProductCard
import { Product } from "../types"; // Import Product type
import { useAppContext } from "../contexts/AppContext"; // Import context
import Welcome from "../components/Welcome"; // Import Welcome component
import { fetchProducts, configureAxiosCSRF } from "../utils/api"; // Import your API functions

const Index = () => {
  const { categories } = useAppContext(); // Get categories from context
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await configureAxiosCSRF(); // Ensure CSRF token is set
        const productsData = await fetchProducts();
        console.log(productsData); // Log to check product IDs
        setProducts(productsData);
      } catch (error) {
        setError((error as Error).message); // Capture any errors
        console.error("Error fetching products:", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Run only once when component mounts

  const filterProducts = (product: Product) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;
    const searchMatch = searchRegex.test(product.name);
    return categoryMatch && searchMatch;
  };

  const sortProducts = (products: Product[]) => {
    switch (sortOption) {
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "priceLowToHigh":
        return [...products].sort((a, b) => a.discountedPrice - b.discountedPrice);
      case "priceHighToLow":
        return [...products].sort((a, b) => b.discountedPrice - a.discountedPrice);
      default:
        return products;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOption("newest");
  };

  const filteredProducts = sortProducts(products.filter(filterProducts));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Welcome />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              جستجوی محصولات
            </label>
            <Input
              id="search"
              type="search"
              placeholder="نام محصول را وارد کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              دسته‌بندی
            </label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="همه دسته‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-48">
            <label htmlFor="sort" className="block text-sm font-medium mb-2">
              مرتب‌سازی
            </label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="مرتب‌سازی بر اساس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="priceLowToHigh">قیمت: کم به زیاد</SelectItem>
                <SelectItem value="priceHighToLow">قیمت: زیاد به کم</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" onClick={clearFilters}>
            پاک کردن فیلترها
          </Button>
        </div>
        
        <div id="products" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {error && <p className="text-red-500">{error}</p>}
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} /> // Ensure product.id is unique
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">محصولی یافت نشد</h3>
            <p className="text-muted-foreground">
              با تغییر فیلترها یا جستجوی عبارت دیگر تلاش کنید
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;