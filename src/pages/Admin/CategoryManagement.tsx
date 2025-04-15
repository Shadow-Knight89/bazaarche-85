import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { formatDate } from "../../utils/formatters";
import { Category } from "../../types";

const CategoryManagement = () => {
  const { categories, addCategory, removeCategory, editCategory } = useAppContext();
  
  // State for adding a category
  const [categoryName, setCategoryName] = useState("");
  
  // State for editing a category
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  
  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setIsEditMode(true);
  };
  
  // Add category submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoryName.trim()) {
      addCategory(categoryName);
      setCategoryName("");
    }
  };
  
  // Edit category submit handler
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editCategoryName.trim()) {
      editCategory(editingCategoryId, editCategoryName);
      setIsEditMode(false);
    }
  };
  
  // Handle category delete
  const handleDeleteCategory = (id: string) => {
    if (window.confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      removeCategory(id);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">افزودن دسته‌بندی جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoryName">نام دسته‌بندی</Label>
              <div className="flex gap-2">
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="نام دسته‌بندی را وارد کنید"
                  required
                />
                <Button type="submit">افزودن</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">لیست دسته‌بندی‌ها</h2>
        
        {categories.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            هنوز دسته‌بندی‌ای اضافه نشده است
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category: Category) => {
              console.log("Category Date:", category.createdAt); // Log the date value for debugging
              return (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{category.name}</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">ویرایش</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {formatDate(category.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Edit category dialog */}
      <Dialog open={isEditMode} onOpenChange={(open) => !open && setIsEditMode(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="editCategoryName">نام دسته‌بندی</Label>
              <Input
                id="editCategoryName"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="نام دسته‌بندی را وارد کنید"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
                لغو
              </Button>
              <Button type="submit">
                ذخیره تغییرات
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;