
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "@/components/ui/use-toast";
import { createShippingAddress, fetchShippingAddresses } from "../utils/api";

interface ShippingAddress {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface ShippingAddressFormProps {
  onAddressSelected: (addressId: string) => void;
}

const ShippingAddressForm = ({ onAddressSelected }: ShippingAddressFormProps) => {
  const { user } = useAppContext();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New address form state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await fetchShippingAddresses();
        if (Array.isArray(response)) {
          setAddresses(response);
          
          // Select default address if available
          const defaultAddress = response.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            onAddressSelected(defaultAddress.id);
          } else if (response.length > 0) {
            setSelectedAddressId(response[0].id);
            onAddressSelected(response[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
        toast({
          title: "خطا",
          description: "خطا در بارگذاری آدرس‌ها",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAddresses();
  }, [user, onAddressSelected]);

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    onAddressSelected(addressId);
  };

  const handleSubmitNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !postalCode || !phoneNumber) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const newAddress = await createShippingAddress({
        address,
        city,
        postalCode,
        phoneNumber,
        isDefault,
      });
      
      if (newAddress) {
        setAddresses(prev => [...prev, newAddress]);
        setSelectedAddressId(newAddress.id);
        onAddressSelected(newAddress.id);
        setShowNewForm(false);
        resetForm();
        
        toast({
          title: "آدرس جدید",
          description: "آدرس با موفقیت اضافه شد",
        });
      }
    } catch (error) {
      console.error("Error creating address:", error);
      toast({
        title: "خطا",
        description: "خطا در ثبت آدرس جدید",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAddress("");
    setCity("");
    setPostalCode("");
    setPhoneNumber("");
    setIsDefault(false);
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p>برای ثبت آدرس، لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">آدرس تحویل</h3>
      
      {/* Saved addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                  selectedAddressId === addr.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                }`}
                onClick={() => handleSelectAddress(addr.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{addr.city}</p>
                    <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <p>کد پستی: {addr.postalCode}</p>
                      <p>تلفن: {addr.phoneNumber}</p>
                    </div>
                  </div>
                  {addr.isDefault && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">پیش‌فرض</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Button to add new address */}
      {!showNewForm ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowNewForm(true)}
        >
          افزودن آدرس جدید
        </Button>
      ) : (
        <div className="border rounded-md p-4">
          <form onSubmit={handleSubmitNewAddress} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">آدرس کامل</Label>
              <Textarea 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="آدرس کامل را وارد کنید"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">شهر</Label>
                <Input 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="نام شهر"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input 
                  id="postalCode" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="کد پستی 10 رقمی"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">شماره تلفن</Label>
              <Input 
                id="phoneNumber" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="شماره تلفن همراه یا ثابت"
              />
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="isDefault" 
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked as boolean)}
              />
              <Label 
                htmlFor="isDefault" 
                className="text-sm font-normal cursor-pointer"
              >
                استفاده به عنوان آدرس پیش‌فرض
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? "در حال ثبت..." : "ثبت آدرس"}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowNewForm(false);
                  resetForm();
                }}
              >
                انصراف
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressForm;
