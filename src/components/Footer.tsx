
import { useAppContext } from '../contexts/AppContext';

const Footer = () => {
  const { storeName } = useAppContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold">{storeName}</h2>
            <p className="text-sm text-gray-300">پلتفرم فروش محصولات آنلاین</p>
          </div>
          <div className="text-sm text-gray-300">
            © {currentYear} کلیه حقوق محفوظ است
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
