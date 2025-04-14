
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { fetchProducts } from '@/utils/api'; // Adjust the import path as needed
import ProductCard from '@/components/ProductCard'; // Changed from named import to default import
import { Product } from '@/types'; // Ensure the type is defined
import './index.css';

const Main: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const items = await fetchProducts();
                setProducts(items);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        loadProducts();
    }, []);

    return (
        <div>
            <h1>Product List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

createRoot(document.getElementById("root")!).render(<Main />);
