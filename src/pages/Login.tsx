
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import { configureAxiosCSRF } from "../utils/api/base";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const { login, checkLoginRateLimit, resetCart } = useAppContext();

  // Initialize CSRF token on component mount
  useEffect(() => {
    const initCSRF = async () => {
      await configureAxiosCSRF();
    };
    
    initCSRF();
  }, []);

  // Check rate limit status on component load
  useEffect(() => {
    const { limited, remainingTime } = checkLoginRateLimit();
    setIsRateLimited(limited);
    setTimeRemaining(Math.ceil(remainingTime / 1000));
  }, [checkLoginRateLimit]);

  // Countdown timer for rate limit
  useEffect(() => {
    if (isRateLimited && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRateLimited(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isRateLimited, timeRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if rate limited
    const { limited, remainingTime } = checkLoginRateLimit();
    if (limited) {
      setIsRateLimited(true);
      setTimeRemaining(Math.ceil(remainingTime / 1000));
      toast({
        title: "محدودیت تلاش",
        description: `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفا ${Math.ceil(remainingTime / 60000)} دقیقه دیگر مجددا تلاش کنید.`,
        variant: "destructive",
      });
      return;
    }
    
    // Reset cart when logging in (to fix the cart persistence issue between accounts)
    resetCart();
    
    setIsLoading(true);
    
    try {
      // Make sure CSRF token is configured before login
      await configureAxiosCSRF();
      
      const success = await login(username, password);
      
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
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "خطا",
        description: "مشکلی در فرآیند ورود رخ داد. لطفا دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                disabled={isRateLimited || isLoading}
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
                disabled={isRateLimited || isLoading}
              />
            </div>
            
            {isRateLimited && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-800">
                <p className="text-sm">
                  به دلیل تلاش‌های ناموفق متعدد، ورود شما به مدت محدود مسدود شده است.
                </p>
                <p className="text-sm font-medium mt-1">
                  زمان باقی‌مانده: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')} دقیقه
                </p>
              </div>
            )}
            
            <div className="text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                رمز عبور خود را فراموش کرده‌اید؟
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isRateLimited || isLoading}>
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>
            <div className="text-center text-sm">
              حساب کاربری ندارید؟{" "}
              <Link to="/register" className="text-primary hover:underline">
                ثبت نام کنید
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
