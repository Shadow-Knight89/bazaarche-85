
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "../../types";
import { toast } from "@/components/ui/use-toast";
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../../utils/api";
import { useProductContext } from "./ProductContext";

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;
  editCategory: (id: string, name: string) => void;
}

const CategoryContext = createContext<CategoryContextType>({} as CategoryContextType);

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, editProduct } = useProductContext();
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "گوشی هوشمند", createdAt: "2023-01-10T08:00:00Z" },
    { id: "2", name: "لپ تاپ", createdAt: "2023-01-10T08:05:00Z" },
    { id: "3", name: "لوازم جانبی", createdAt: "2023-01-10T08:10:00Z" }
  ]);

  // Load categories from API on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (categoriesData && Array.isArray(categoriesData)) {
          // Transform categories from Django format
          const formattedCategories = categoriesData.map(category => ({
            ...category,
            id: category.id.toString(),
            createdAt: category.createdAt || new Date().toISOString()
          }));
          
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const addCategory = async (name: string) => {
    // Check if category with the same name already exists
    if (categories.some(c => c.name === name)) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این نام قبلاً ایجاد شده است",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Send to API
      const response = await createCategory({ name });
      
      if (response) {
        // Add to local state
        setCategories(prev => [...prev, response]);
        
        toast({
          title: "دسته‌بندی جدید",
          description: "دسته‌بندی با موفقیت اضافه شد",
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  const removeCategory = async (id: string) => {
    const categoryToRemove = categories.find(c => c.id === id);
    
    if (!categoryToRemove) return;
    
    const productsWithCategory = products.filter(p => p.category === categoryToRemove.name);
    
    if (productsWithCategory.length > 0) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی دارای محصولاتی است و نمی‌تواند حذف شود",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Send delete request to API
      await deleteCategory(id);
      
      // Update local state
      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "حذف دسته‌بندی",
        description: "دسته‌بندی با موفقیت حذف شد",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  
  const editCategory = async (id: string, name: string) => {
    // Check if another category with the same name already exists
    if (categories.some(c => c.name === name && c.id !== id)) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این نام قبلاً ایجاد شده است",
        variant: "destructive",
      });
      return;
    }
    
    const categoryToEdit = categories.find(c => c.id === id);
    
    if (!categoryToEdit) return;
    
    const oldName = categoryToEdit.name;
    
    try {
      // Send update to API
      await updateCategory(id, { name });
      
      // Update category
      setCategories(prev => 
        prev.map(c => c.id === id ? { ...c, name } : c)
      );
      
      // Update products with this category
      products.forEach(product => {
        if (product.category === oldName) {
          editProduct(product.id, { category: name });
        }
      });
      
      toast({
        title: "ویرایش دسته‌بندی",
        description: "دسته‌بندی با موفقیت ویرایش شد",
      });
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const value = {
    categories,
    addCategory,
    removeCategory,
    editCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
