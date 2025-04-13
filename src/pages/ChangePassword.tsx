
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { user, changePassword } = useAppContext();

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور جدید و تکرار آن باید یکسان باشند",
        variant: "destructive",
      });
      return;
    }
    
    const success = changePassword(currentPassword, newPassword);
    
    if (success) {
      toast({
        title: "تغییر رمز عبور",
        description: "رمز عبور با موفقیت تغییر کرد",
      });
      navigate("/");
    } else {
      toast({
        title: "خطا",
        description: "رمز عبور فعلی اشتباه است",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">تغییر رمز عبور</CardTitle>
            <CardDescription className="text-center">
              برای تغییر رمز عبور، اطلاعات زیر را وارد کنید
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm font-medium">
                  رمز عبور فعلی
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  رمز عبور جدید
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="رمز عبور جدید خود را وارد کنید"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  تکرار رمز عبور جدید
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="رمز عبور جدید خود را مجدداً وارد کنید"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="ml-2"
              >
                لغو
              </Button>
              <Button type="submit">تغییر رمز عبور</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default ChangePassword;
