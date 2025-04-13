
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { register } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور و تکرار آن باید یکسان باشند",
        variant: "destructive",
      });
      return;
    }
    
    const success = register(username, password);
    
    if (success) {
      toast({
        title: "ثبت نام موفق",
        description: "اکنون می‌توانید وارد حساب کاربری خود شوید",
      });
      navigate("/login");
    } else {
      toast({
        title: "خطا",
        description: "این نام کاربری قبلاً استفاده شده است",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">ثبت نام در سایت</CardTitle>
          <CardDescription className="text-center">
            برای ایجاد حساب کاربری، اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                نام کاربری
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                رمز عبور
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                تکرار رمز عبور
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="رمز عبور خود را مجدداً وارد کنید"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full">ثبت نام</Button>
            <div className="text-center text-sm">
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link to="/login" className="text-primary hover:underline">
                ورود به حساب کاربری
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
