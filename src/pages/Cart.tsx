
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { formatPrice } from "../utils/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingCart, Tag } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "@/components/ui/use-toast";

const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart, 
    applyGiftCode, 
    appliedGiftCode,
    calculateTotal,
    user,
    addPurchase
  } = useAppContext();

  const navigate = useNavigate();

  const { subtotal, discount, total } = calculateTotal();
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "خطا",
        description: "برای نهایی کردن خرید ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "خطا",
        description: "سبد خرید شما خالی است",
        variant: "destructive",
      });
      return;
    }
    
    // Send purchase to the server through the context
    // This will now use our API to store the purchase in the database
    addPurchase(cart, total);
    
    // Redirect to home page
    navigate("/");
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً کد تخفیف را وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    const success = applyGiftCode(couponCode);
    if (success) {
      setCouponCode("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h2 className="mt-4 text-xl font-semibold">سبد خرید شما خالی است</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              برای افزودن محصولات به سبد خرید به صفحه محصولات بازگردید.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">بازگشت به فروشگاه</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-32 h-32">
                          <img 
                            src={item.product.images[0] || '/placeholder.svg'} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <Link to={`/products/${item.product.id}`} className="font-medium hover:text-primary">
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {item.product.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <div className="flex items-center">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">
                                  {formatPrice(item.product.discountedPrice * item.quantity)}
                                </div>
                                {item.product.price !== item.product.discountedPrice && (
                                  <div className="text-sm line-through text-muted-foreground">
                                    {formatPrice(item.product.price * item.quantity)}
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف همه
                </Button>
              </div>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Form */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">کد تخفیف</div>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="کد تخفیف را وارد کنید" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyCoupon}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        اعمال
                      </Button>
                    </div>
                    
                    {appliedGiftCode && (
                      <div className="text-sm text-primary">
                        کد تخفیف {appliedGiftCode.code} اعمال شد
                      </div>
                    )}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">مجموع:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">تخفیف:</span>
                        <span className="text-red-500">- {formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>مبلغ قابل پرداخت:</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCheckout}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    نهایی کردن خرید
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
