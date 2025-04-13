
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Search, UserX, UserCheck, Key, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const { users, banUser, unbanUser, resetUserPassword, deleteUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  // Filter non-admin users
  const regularUsers = users.filter(user => !user.isAdmin);
  
  // Search functionality
  const filteredUsers = regularUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle banning/unbanning user
  const handleToggleBan = (userId: string, isBanned: boolean | undefined) => {
    if (isBanned) {
      unbanUser(userId);
      toast({
        title: "کاربر فعال شد",
        description: "کاربر با موفقیت از حالت مسدود خارج شد",
      });
    } else {
      banUser(userId);
      toast({
        title: "کاربر مسدود شد",
        description: "کاربر با موفقیت مسدود شد",
      });
    }
  };

  // Handle resetting password
  const handlePasswordReset = (userId: string) => {
    if (resetPassword.trim() === "") {
      toast({
        title: "خطا",
        description: "رمز عبور جدید را وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    resetUserPassword(userId, resetPassword);
    setResetPassword("");
    
    toast({
      title: "رمز عبور تغییر کرد",
      description: "رمز عبور کاربر با موفقیت تغییر کرد",
    });
  };

  // Handle user deletion
  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
    toast({
      title: "کاربر حذف شد",
      description: "حساب کاربری با موفقیت حذف شد",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="جستجوی کاربر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            کاربری یافت نشد
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                  {user.isBanned && (
                    <Badge variant="destructive">مسدود شده</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">وضعیت ارسال نظر:</p>
                  <Badge variant={user.canComment === false ? "outline" : "default"}>
                    {user.canComment === false ? "غیرفعال" : "فعال"}
                  </Badge>
                </div>
                
                <div className="flex space-x-2 space-s-2">
                  {/* Ban/Unban Button */}
                  <Button
                    variant={user.isBanned ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleToggleBan(user.id, user.isBanned)}
                    className="flex-1"
                  >
                    {user.isBanned ? (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        فعال‌سازی
                      </>
                    ) : (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        مسدودسازی
                      </>
                    )}
                  </Button>
                  
                  {/* Reset Password Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Key className="mr-2 h-4 w-4" />
                        تغییر رمز
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>تغییر رمز عبور کاربر</AlertDialogTitle>
                        <AlertDialogDescription>
                          رمز عبور جدید را برای کاربر {user.username} وارد کنید.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Input
                          placeholder="رمز عبور جدید"
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handlePasswordReset(user.id)}
                        >
                          تغییر رمز عبور
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  {/* Delete User Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="px-2">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف حساب کاربری</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا از حذف حساب کاربری {user.username} اطمینان دارید؟ این عمل غیرقابل بازگشت است.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          حذف کاربر
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
