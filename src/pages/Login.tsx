
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(username, password);
    
    if (success) {
      toast({
        title: "ورود موفق",
        description: "با موفقیت وارد شدید",
      });
      navigate("/");
    } else {
      toast({
        title: "خطا",
        description: "نام کاربری یا رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">ورود به حساب کاربری</CardTitle>
          <CardDescription className="text-center">
            برای ورود به سیستم، اطلاعات خود را وارد کنید
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
              <p className="text-xs text-muted-foreground">
                برای ورود با حساب مدیریت از admin استفاده کنید
              </p>
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
              <p className="text-xs text-muted-foreground">
                برای ورود با حساب مدیریت از admin123 استفاده کنید
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full">ورود</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
