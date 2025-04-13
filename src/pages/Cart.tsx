
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "../contexts/AppContext";
import { formatPrice } from "../utils/formatters";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartItemQuantity, 
    clearCart, 
    applyGiftCode,
    calculateTotal,
    appliedGiftCode 
  } = useAppContext();
  
  const [giftCode, setGiftCode] = useState("");
  const { subtotal, discount, total } = calculateTotal();
  
  const handleSubmitGiftCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCode.trim()) return;
    
    const success = applyGiftCode(giftCode);
    if (success) {
      setGiftCode("");
    }
  };
  
  const handleCheckout = () => {
    toast({
      title: "سفارش ثبت شد",
      description: "سفارش شما با موفقیت ثبت شد",
    });
    clearCart();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">سبد خرید</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="w-16 h-16 text-muted" />
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              سبد خرید شما خالی است
            </p>
            <Link to="/">
              <Button>مشاهده محصولات</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">محصولات</h2>
                  
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="h-16 w-16 overflow-hidden rounded">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img 
                                src={item.product.images[0]} 
                                alt={item.product.name}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-xs">
                                بدون تصویر
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product.discountedPrice)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            
                            <span className="w-8 text-center">{item.quantity}</span>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">خلاصه سفارش</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مجموع</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف</span>
                      <span>- {formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 font-bold flex justify-between">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                  
                  <form onSubmit={handleSubmitGiftCode} className="pt-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Input
                        placeholder="کد تخفیف"
                        value={giftCode}
                        onChange={(e) => setGiftCode(e.target.value)}
                      />
                      <Button type="submit" variant="outline">اعمال</Button>
                    </div>
                    
                    {appliedGiftCode && (
                      <div className="mt-2 text-sm text-green-600">
                        کد تخفیف {appliedGiftCode.code} اعمال شد
                      </div>
                    )}
                  </form>
                  
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    پرداخت
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
