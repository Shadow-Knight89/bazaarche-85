
import { useAppContext } from "../contexts/AppContext";

const Welcome = () => {
  const { storeName } = useAppContext();
  
  return (
    <div className="bg-gradient-to-b from-primary/10 to-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{storeName}</h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          متن قابل جایگذاری
        </p>
      </div>
    </div>
  );
};

export default Welcome;
