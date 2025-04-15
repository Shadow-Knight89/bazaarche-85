
import { useState, useEffect } from "react";
import { formatPrice, formatDate } from "../../utils/formatters";
import { usePurchaseContext } from "../../contexts/modules/PurchaseContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, User, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const PurchaseHistory = () => {
  const { purchases, loadPurchases, loading } = usePurchaseContext();
  
  // Load purchases when the component mounts
  useEffect(() => {
    loadPurchases();
  }, []);
  
  // Handler to refresh purchases
  const handleRefresh = () => {
    loadPurchases();
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">تاریخچه سفارشات</h2>
          <Button variant="outline" disabled>
            <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
            در حال بارگذاری...
          </Button>
        </div>
        
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="mb-4">
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  // Show empty state
  if (purchases.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">تاریخچه سفارشات</h2>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="ml-2 h-4 w-4" />
            بارگذاری مجدد
          </Button>
        </div>
        
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h2 className="mt-4 text-xl font-semibold">هیچ سفارشی وجود ندارد</h2>
          <p className="mt-2 text-muted-foreground">
            هنوز هیچ سفارشی در سیستم ثبت نشده است.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">تاریخچه سفارشات</h2>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          بارگذاری مجدد
        </Button>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {purchases.map((purchase, index) => (
          <AccordionItem key={purchase.id} value={purchase.id}>
            <AccordionTrigger className="px-4 py-3 bg-white hover:bg-gray-50 rounded-md shadow-sm">
              <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center text-start gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center">{index + 1}</span>
                  <span className="font-medium">{purchase.username}</span>
                </div>
                <div className="flex gap-4">
                  <div className="text-muted-foreground text-sm flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(purchase.createdAt)}
                  </div>
                  <div className="text-primary font-medium">
                    {formatPrice(purchase.total)}
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="mt-2 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">خریدار</div>
                          <div className="text-sm">{purchase.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">تاریخ سفارش</div>
                          <div className="text-sm">{formatDate(purchase.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">مبلغ کل</div>
                          <div className="text-sm font-bold text-primary">{formatPrice(purchase.total)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>محصول</TableHead>
                        <TableHead>قیمت واحد</TableHead>
                        <TableHead className="text-center">تعداد</TableHead>
                        <TableHead className="text-right">جمع</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchase.items && purchase.items.map((item, index) => (
                        <TableRow key={`${purchase.id}-${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.product.name}</TableCell>
                          <TableCell>{formatPrice(item.product.discountedPrice)}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {formatPrice(item.product.discountedPrice * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PurchaseHistory;
