
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const Welcome = () => {
  const { storeName } = useAppContext();
  
  return (
    <div className="bg-gradient-to-b from-primary/10 to-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{storeName}</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          با انواع محصولات با کیفیت و قیمت مناسب، خرید آنلاین را تجربه کنید
        </p>
        <Link to="/#products">
          <Button size="lg">مشاهده محصولات</Button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
