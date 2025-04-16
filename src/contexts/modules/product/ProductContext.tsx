
import { createContext } from "react";
import { ProductContextType } from "./types";

export const ProductContext = createContext<ProductContextType>({
  products: [],
  setProducts: () => {},
  loadProducts: () => Promise.resolve(),
  getProductById: () => null,
  getProductByCustomId: () => null,
  addProduct: () => Promise.resolve(null),
  updateProduct: () => Promise.resolve(null),
  deleteProduct: () => Promise.resolve(false),
  // Add aliases for compatibility with existing code
  editProduct: () => Promise.resolve(null),
  removeProduct: () => Promise.resolve(false),
});
