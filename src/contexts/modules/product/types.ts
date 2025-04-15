
import { Product } from "../../../types";

export interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  editProduct: (id: string, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProductByCustomId: (customId: string) => Product | undefined;
}
