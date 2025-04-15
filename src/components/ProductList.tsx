import React, { useEffect, useState } from 'react';
import { fetchProducts, configureAxiosCSRF } from '../utils/api'; // Adjust the path as needed
import ProductCard from './ProductCard'; // Ensure the path is correct
import { Product } from '../types'; // Adjust the path based on your structure

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await configureAxiosCSRF(); // Ensure CSRF token is set
                const productsData = await fetchProducts();
                setProducts(productsData); // Set the fetched products in state
                console.log('Fetched products:', productsData); // Log the fetched products
            } catch (error) {
                setError((error as Error).message); // Capture any errors
                console.error('Error fetching products:', error);
            }
        };

        fetchData(); // Call the fetch function
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            {error && <p>Error fetching products: {error}</p>}
            <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} /> // Ensure each ProductCard has a unique key
                ))}
            </div>
        </div>
    );
};

export default ProductList;