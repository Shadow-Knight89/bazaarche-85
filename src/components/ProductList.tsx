
import React, { useEffect, useState } from 'react';
import { fetchProducts, configureAxiosCSRF } from '../utils/api';
import ProductCard from './ProductCard';
import { Product } from '../types';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await configureAxiosCSRF(); // Ensure CSRF token is set
                const productsData = await fetchProducts();
                setProducts(productsData); // Set the fetched products in state
                console.log('Fetched products:', productsData); // Log the fetched products
            } catch (error) {
                setError((error as Error).message); // Capture any errors
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            {error && <p>Error fetching products: {error}</p>}
            
            {loading ? (
                <div className="text-center py-8">
                    <p>در حال بارگذاری...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-8">
                    <p>محصولی یافت نشد.</p>
                </div>
            ) : (
                <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
