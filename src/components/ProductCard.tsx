
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Product } from "../types";
import { useAppContext } from "../contexts/AppContext";
import { formatPrice } from "../utils/formatters";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useAppContext();
  const hasDiscount = product.price !== product.discountedPrice;
  
  // Use customId if available, otherwise use id
  const productUrl = product.customId ? 
    `/p/${product.customId}` : 
    `/products/${product.id}`;

  return (
    <Card className="product-card overflow-hidden">
      <CardHeader className="p-0 relative">
        <Link to={productUrl}>
          <AspectRatio ratio={4/3} className="overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">بدون تصویر</span>
              </div>
            )}
          </AspectRatio>
        </Link>

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            {Math.round((1 - product.discountedPrice / product.price) * 100)}%
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <Link to={productUrl}>
          <CardTitle className="text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>

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
        <div className="flex justify-between items-center w-full gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-1/2"
            asChild
          >
            <Link to={productUrl}>
              <Eye className="ml-2 h-4 w-4" />
              جزئیات
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => addToCart(product)}
            className="w-1/2"
          >
            <ShoppingCart className="ml-2 h-4 w-4" />
            افزودن
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
