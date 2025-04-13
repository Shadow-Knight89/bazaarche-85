
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-24 w-24 text-amber-500" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">صفحه مورد نظر یافت نشد</p>
        <p className="text-gray-500 mb-8">
          صفحه‌ای که به دنبال آن هستید ممکن است حذف شده باشد، نام آن تغییر کرده باشد یا به طور موقت در دسترس نباشد.
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="ml-2 h-5 w-5" />
            بازگشت به صفحه اصلی
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
