
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Product } from "../types";
import { useAppContext } from "../contexts/AppContext";
import { formatPrice } from "../utils/formatters";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useAppContext();
  const hasDiscount = product.price !== product.discountedPrice;
  
  return (
    <Card className="product-card overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="aspect-[4/3] overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              بدون تصویر
            </div>
          )}
        </div>
        
        {hasDiscount && (
          <div className="discount-badge">
            {Math.round((1 - product.discountedPrice / product.price) * 100)}%
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
        
        <div className="flex flex-col gap-1">
          {hasDiscount && (
            <span className="line-through text-sm text-muted-foreground">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="font-bold text-primary">
            {formatPrice(product.discountedPrice)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between items-center w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addToCart(product)}
            className="w-full"
          >
            <ShoppingCart className="ml-2 h-4 w-4" />
            افزودن به سبد
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
