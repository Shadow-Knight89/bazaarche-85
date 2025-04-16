
import { useState, useEffect, ReactNode } from "react";
import { ProductContext } from "./ProductContext";
import { Product } from "./types";
import { fetchProducts, createProduct, updateProduct as apiUpdateProduct, removeProduct } from "../../../utils/api";

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getProductById = (id: string | number) => {
    return products.find((product) => product.id === id) || null;
  };

  const getProductByCustomId = (customId: string) => {
    return products.find((product) => product.customId === customId) || null;
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const newProduct = await createProduct(product);
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  };

  const updateProduct = async (id: string | number, product: Partial<Product>) => {
    try {
      const updatedProduct = await apiUpdateProduct(id.toString(), product);
      setProducts(
        products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      return null;
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await removeProduct(id.toString());
      setProducts(products.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  };

  // Add alias functions for compatibility
  const editProduct = updateProduct;
  const removeProduct = deleteProduct;

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loadProducts,
        getProductById,
        getProductByCustomId,
        addProduct,
        updateProduct,
        deleteProduct,
        // Add aliases to the context value
        editProduct,
        removeProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
