
import { ShoppingCart, User, LogOut, Package, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Navbar = () => {
  const { cart, user, logout } = useAppContext();
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">فروشگاه آنلاین</Link>
          
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>سبد خرید</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="sr-only">منوی کاربر</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">سلام، {user.username}</p>
                    {user.isAdmin && (
                      <p className="text-xs text-muted-foreground">مدیر سیستم</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/change-password" className="flex w-full cursor-pointer">
                      <UserCog className="ml-2 h-4 w-4" />
                      تغییر رمز عبور
                    </Link>
                  </DropdownMenuItem>
                  
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex w-full cursor-pointer">
                        <Package className="ml-2 h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link to="/register">
                  <Button variant="outline" size="sm">ثبت نام</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">ورود</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
