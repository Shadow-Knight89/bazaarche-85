import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatters";
import { useAppContext } from "../contexts/AppContext";
import { CartItem } from "../types";
import { toast } from "@/components/ui/use-toast";
import ShippingAddressForm from "../components/ShippingAddressForm";

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, calculateTotal, addPurchase, user } = useAppContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const navigate = useNavigate();

  const handleIncreaseQuantity = (item: CartItem) => {
    updateCartItemQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleAddressSelected = (addressId: string) => {
    setSelectedAddressId(addressId);
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "خطا",
        description: "لطفا ابتدا وارد حساب کاربری خود شوید.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedAddressId) {
      toast({
        title: "خطا",
        description: "لطفا یک آدرس برای ارسال انتخاب کنید.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCheckingOut(true);
      const { total } = calculateTotal();
      await addPurchase(cart, total, selectedAddressId);
      
      toast({
        title: "خرید موفق",
        description: "سفارش شما با موفقیت ثبت شد.",
      });
      
      // Redirect to home page after successful checkout
      navigate("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "خطا",
        description: "مشکلی در ثبت سفارش به وجود آمد.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
        <div className="text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
      
      {cart.length === 0 ? (
        <div className="text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-400 mb-4" />
          <p className="text-gray-500">سبد خرید شما خالی است.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">محصولات</h2>
              <ul>
                {cart.map((item) => (
                  <li key={item.product.id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-gray-500 text-sm">{formatPrice(item.product.discountedPrice)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecreaseQuantity(item)}
                        className="ml-2"
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncreaseQuantity(item)}
                        className="mr-2"
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFromCart(item.product.id)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <h2 className="text-lg font-semibold mb-4">خلاصه سفارش</h2>
              <div className="flex justify-between">
                <span>جمع کل:</span>
                <span>{formatPrice(calculateTotal().subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>تخفیف:</span>
                <span>{formatPrice(calculateTotal().discount)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>قابل پرداخت:</span>
                <span>{formatPrice(calculateTotal().total)}</span>
              </div>
              
              {user && (
                <ShippingAddressForm onAddressSelected={handleAddressSelected} />
              )}
              
              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={isCheckingOut || cart.length === 0 || !user || !selectedAddressId}
              >
                {isCheckingOut ? "در حال پردازش..." : "پرداخت و ثبت سفارش"}
              </Button>
              
              {!user && (
                <p className="text-sm text-center text-red-500">برای نهایی کردن خرید، لطفا ابتدا وارد حساب کاربری خود شوید.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
