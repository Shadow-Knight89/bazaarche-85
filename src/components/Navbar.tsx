
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Button } from "./ui/button";

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
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                {user.isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="پنل مدیریت">
                      <Package className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                
                <span className="text-sm font-medium">{user.username}</span>
                
                <Button variant="ghost" size="icon" onClick={logout} title="خروج">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
