
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AdminPermissions, User } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import { Trash2, UserPlus, Edit, RefreshCw } from "lucide-react";

const AdminManagement = () => {
  const { users, addAdmin, deleteUser, updateAdminPermissions } = useAppContext();
  
  // State for adding new admin
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>({
    manageProducts: true,
    manageCategories: true,
    manageGiftCodes: true,
    manageUsers: false,
    viewPurchases: true,
    manageComments: true,
    customPrefix: "مدیر",
    customPrefixColor: "#ff0000",
  });
  
  // State for editing admin
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [editPermissions, setEditPermissions] = useState<AdminPermissions>({
    manageProducts: true,
    manageCategories: true,
    manageGiftCodes: true,
    manageUsers: false,
    viewPurchases: true,
    manageComments: true,
    customPrefix: "مدیر",
    customPrefixColor: "#ff0000",
  });
  
  // Filter admin users
  const adminUsers = users.filter(user => user.isAdmin);
  
  // Handle adding new admin
  const handleAddAdmin = () => {
    if (newAdminUsername.trim() === "" || newAdminPassword.trim() === "") {
      toast({
        title: "خطا",
        description: "نام کاربری و رمز عبور نمی‌تواند خالی باشد",
        variant: "destructive",
      });
      return;
    }
    
    const success = addAdmin(newAdminUsername, newAdminPassword, newAdminPermissions);
    
    if (success) {
      setIsAddDialogOpen(false);
      setNewAdminUsername("");
      setNewAdminPassword("");
      
      toast({
        title: "مدیر جدید",
        description: "حساب مدیر با موفقیت ایجاد شد",
      });
    } else {
      toast({
        title: "خطا",
        description: "این نام کاربری قبلاً استفاده شده است",
        variant: "destructive",
      });
    }
  };
  
  // Open edit dialog
  const openEditDialog = (admin: User) => {
    setEditingAdmin(admin);
    setEditPermissions(admin.adminPermissions || {
      manageProducts: true,
      manageCategories: true,
      manageGiftCodes: true,
      manageUsers: false,
      viewPurchases: true,
      manageComments: true,
      customPrefix: "مدیر",
      customPrefixColor: "#ff0000",
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle updating admin permissions
  const handleUpdatePermissions = () => {
    if (editingAdmin) {
      updateAdminPermissions(editingAdmin.id, editPermissions);
      setIsEditDialogOpen(false);
      
      toast({
        title: "به‌روزرسانی مدیر",
        description: "دسترسی‌های مدیر با موفقیت به‌روز شد",
      });
    }
  };
  
  // Handle deleting an admin
  const handleDeleteAdmin = (userId: string) => {
    deleteUser(userId);
    
    toast({
      title: "حذف مدیر",
      description: "حساب مدیر با موفقیت حذف شد",
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت ادمین‌ها</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              افزودن مدیر جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>افزودن مدیر جدید</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <Input
                  id="username"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  placeholder="نام کاربری مدیر را وارد کنید"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="رمز عبور مدیر را وارد کنید"
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">دسترسی‌ها</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="manage-products">مدیریت محصولات</Label>
                    <Switch
                      id="manage-products"
                      checked={newAdminPermissions.manageProducts}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, manageProducts: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="manage-categories">مدیریت دسته‌بندی‌ها</Label>
                    <Switch
                      id="manage-categories"
                      checked={newAdminPermissions.manageCategories}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, manageCategories: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="manage-gift-codes">مدیریت کدهای تخفیف</Label>
                    <Switch
                      id="manage-gift-codes"
                      checked={newAdminPermissions.manageGiftCodes}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, manageGiftCodes: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="manage-users">مدیریت کاربران</Label>
                    <Switch
                      id="manage-users"
                      checked={newAdminPermissions.manageUsers}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, manageUsers: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="view-purchases">مشاهده سفارشات</Label>
                    <Switch
                      id="view-purchases"
                      checked={newAdminPermissions.viewPurchases}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, viewPurchases: checked})
                      }
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Label htmlFor="manage-comments">مدیریت نظرات</Label>
                    <Switch
                      id="manage-comments"
                      checked={newAdminPermissions.manageComments}
                      onCheckedChange={(checked) => 
                        setNewAdminPermissions({...newAdminPermissions, manageComments: checked})
                      }
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">پیشوند نمایش</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-prefix">پیشوند</Label>
                    <Input
                      id="custom-prefix"
                      value={newAdminPermissions.customPrefix || ""}
                      onChange={(e) => 
                        setNewAdminPermissions({
                          ...newAdminPermissions, 
                          customPrefix: e.target.value
                        })
                      }
                      placeholder="مثال: مدیر"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prefix-color">رنگ (کد HEX)</Label>
                    <div className="flex space-s-2">
                      <Input
                        id="prefix-color"
                        value={newAdminPermissions.customPrefixColor || "#ff0000"}
                        onChange={(e) => 
                          setNewAdminPermissions({
                            ...newAdminPermissions, 
                            customPrefixColor: e.target.value
                          })
                        }
                        placeholder="#ff0000"
                      />
                      <div 
                        className="w-10 h-10 rounded border" 
                        style={{backgroundColor: newAdminPermissions.customPrefixColor || "#ff0000"}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAdmin}>افزودن مدیر</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {adminUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            هیچ مدیری یافت نشد
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminUsers.map((admin) => (
            <Card key={admin.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  {admin.username}
                  {admin.id === 'admin' && (
                    <Badge className="mr-2">مدیر اصلی</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">مدیریت محصولات:</span>{" "}
                    {admin.adminPermissions?.manageProducts !== false ? "✅" : "❌"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مدیریت دسته‌بندی‌ها:</span>{" "}
                    {admin.adminPermissions?.manageCategories !== false ? "✅" : "❌"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مدیریت کدهای تخفیف:</span>{" "}
                    {admin.adminPermissions?.manageGiftCodes !== false ? "✅" : "❌"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مدیریت کاربران:</span>{" "}
                    {admin.adminPermissions?.manageUsers === true ? "✅" : "❌"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مشاهده سفارشات:</span>{" "}
                    {admin.adminPermissions?.viewPurchases !== false ? "✅" : "❌"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">مدیریت نظرات:</span>{" "}
                    {admin.adminPermissions?.manageComments !== false ? "✅" : "❌"}
                  </div>
                </div>
                
                {(admin.adminPermissions?.customPrefix || admin.adminPermissions?.customPrefixColor) && (
                  <div className="text-sm flex items-center">
                    <span className="text-muted-foreground ml-2">پیشوند:</span>
                    <Badge 
                      style={{
                        backgroundColor: admin.adminPermissions?.customPrefixColor || "#ff0000",
                        color: "#ffffff"
                      }}
                    >
                      {admin.adminPermissions?.customPrefix || "مدیر"}
                    </Badge>
                  </div>
                )}
                
                <div className="flex space-s-2">
                  {admin.id !== 'admin' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        ویرایش دسترسی‌ها
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="flex-1">
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف مدیر
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف حساب مدیر</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا از حذف حساب مدیر {admin.username} اطمینان دارید؟ این عمل غیرقابل بازگشت است.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف مدیر
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  
                  {admin.id === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-full opacity-50"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      مدیر اصلی (غیرقابل حذف)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>ویرایش دسترسی‌های مدیر {editingAdmin?.username}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">دسترسی‌ها</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-manage-products">مدیریت محصولات</Label>
                  <Switch
                    id="edit-manage-products"
                    checked={editPermissions.manageProducts}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, manageProducts: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-manage-categories">مدیریت دسته‌بندی‌ها</Label>
                  <Switch
                    id="edit-manage-categories"
                    checked={editPermissions.manageCategories}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, manageCategories: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-manage-gift-codes">مدیریت کدهای تخفیف</Label>
                  <Switch
                    id="edit-manage-gift-codes"
                    checked={editPermissions.manageGiftCodes}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, manageGiftCodes: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-manage-users">مدیریت کاربران</Label>
                  <Switch
                    id="edit-manage-users"
                    checked={editPermissions.manageUsers}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, manageUsers: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-view-purchases">مشاهده سفارشات</Label>
                  <Switch
                    id="edit-view-purchases"
                    checked={editPermissions.viewPurchases}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, viewPurchases: checked})
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="edit-manage-comments">مدیریت نظرات</Label>
                  <Switch
                    id="edit-manage-comments"
                    checked={editPermissions.manageComments}
                    onCheckedChange={(checked) => 
                      setEditPermissions({...editPermissions, manageComments: checked})
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">پیشوند نمایش</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-custom-prefix">پیشوند</Label>
                  <Input
                    id="edit-custom-prefix"
                    value={editPermissions.customPrefix || ""}
                    onChange={(e) => 
                      setEditPermissions({
                        ...editPermissions, 
                        customPrefix: e.target.value
                      })
                    }
                    placeholder="مثال: مدیر"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prefix-color">رنگ (کد HEX)</Label>
                  <div className="flex space-s-2">
                    <Input
                      id="edit-prefix-color"
                      value={editPermissions.customPrefixColor || "#ff0000"}
                      onChange={(e) => 
                        setEditPermissions({
                          ...editPermissions, 
                          customPrefixColor: e.target.value
                        })
                      }
                      placeholder="#ff0000"
                    />
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{backgroundColor: editPermissions.customPrefixColor || "#ff0000"}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdatePermissions}>ذخیره تغییرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
