
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "../../contexts/AppContext";
import { formatDate } from "../../utils/formatters";

const GiftCodeManagement = () => {
  const { giftCodes, addGiftCode } = useAppContext();
  
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedDiscountValue = parseInt(discountValue, 10);
    
    // Validate percentage is between 1 and 100
    if (discountType === "percentage" && (parsedDiscountValue < 1 || parsedDiscountValue > 100)) {
      alert("درصد تخفیف باید بین 1 تا 100 باشد");
      return;
    }
    
    const newGiftCode = {
      code: code.toUpperCase(),
      discountType,
      discountValue: parsedDiscountValue,
      isGlobal,
      isUsed: false,  // Add the missing properties
      usedBy: null    // Add the missing properties
    };
    
    addGiftCode(newGiftCode);
    
    // Reset form
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setIsGlobal(true);
  };
  
  const formatDiscountValue = (type: "percentage" | "fixed", value: number) => {
    return type === "percentage" 
      ? `${value}%` 
      : `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">ایجاد کد تخفیف جدید</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code">کد تخفیف</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="مثال: WELCOME10"
                  required
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRandomCode}
                  className="whitespace-nowrap"
                >
                  تولید کد تصادفی
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discountValue">مقدار تخفیف</Label>
              <Input
                id="discountValue"
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "درصد تخفیف" : "مقدار تخفیف (تومان)"}
                required
              />
              {discountType === "percentage" && (
                <p className="text-xs text-muted-foreground">
                  مقدار باید بین 1 تا 100 باشد
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>نوع تخفیف</Label>
            <RadioGroup 
              value={discountType} 
              onValueChange={(value) => setDiscountType(value as "percentage" | "fixed")}
              className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-x-reverse sm:space-y-0"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">درصدی</Label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">مقدار ثابت</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isGlobal">قابل استفاده برای همه کاربران</Label>
              <Switch
                id="isGlobal"
                checked={isGlobal}
                onCheckedChange={setIsGlobal}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {isGlobal 
                ? "این کد تخفیف توسط هر کاربر یکبار قابل استفاده است" 
                : "اولین کاربری که از این کد استفاده کند، آن را مصرف می‌کند"}
            </p>
          </div>
          
          <Button type="submit">ایجاد کد تخفیف</Button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">لیست کدهای تخفیف</h2>
        
        {giftCodes.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            هنوز کد تخفیفی ایجاد نشده است
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>کد تخفیف</TableHead>
                  <TableHead>مقدار تخفیف</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>تاریخ ایجاد</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {giftCodes.map((giftCode) => (
                  <TableRow key={giftCode.id}>
                    <TableCell className="font-medium">{giftCode.code}</TableCell>
                    <TableCell>
                      {formatDiscountValue(giftCode.discountType, giftCode.discountValue)}
                    </TableCell>
                    <TableCell>
                      {giftCode.isGlobal ? "همه کاربران" : "تک کاربر"}
                    </TableCell>
                    <TableCell>
                      {giftCode.isUsed ? (
                        <span className="text-red-500">استفاده شده</span>
                      ) : (
                        <span className="text-green-500">فعال</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(giftCode.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCodeManagement;
