
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Header = () => {
  const { storeName } = useAppContext();

  return (
    <header className="bg-primary text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link to="/">{storeName}</Link>
          </h1>
          <div className="text-sm">خوش آمدید!</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
