
export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  category?: string;
  category_name?: string;
  images: string[];
  createdAt: string;
  customId?: string;
  detailedDescription?: string;
}

export interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loadProducts: () => Promise<void>;
  getProductById: (id: string | number) => Product | null;
  getProductByCustomId: (customId: string) => Product | null;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product | null>;
  updateProduct: (id: string | number, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string | number) => Promise<boolean>;
  // Add these functions to make compatible with the existing code
  editProduct: (id: string | number, product: Partial<Product>) => Promise<Product | null>;
  removeProduct: (id: string | number) => Promise<boolean>;
}
