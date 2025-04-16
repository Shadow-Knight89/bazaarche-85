
import React, { useState, useEffect } from 'react';
import { fetchProducts, configureAxiosCSRF } from '../utils/api';
import ProductCard from './ProductCard';
import ProductFilters, { FilterValues } from './ProductFilters';
import { useQuery } from '@tanstack/react-query';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface ProductListProps {
    categories?: { id: string; name: string }[];
}

const ProductList: React.FC<ProductListProps> = ({ categories = [] }) => {
    const [filters, setFilters] = useState<FilterValues>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [csrfInitialized, setCsrfInitialized] = useState(false);
    
    // Initialize CSRF before fetching data - only once
    useEffect(() => {
        const initCSRF = async () => {
            if (!csrfInitialized) {
                console.log('ProductList - Initializing CSRF');
                try {
                    await configureAxiosCSRF();
                    console.log('ProductList - CSRF initialized successfully');
                    setCsrfInitialized(true);
                } catch (err) {
                    console.error('ProductList - CSRF initialization error:', err);
                }
            }
        };
        
        initCSRF();
    }, [csrfInitialized]);
    
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['products', filters, currentPage],
        queryFn: async () => {
            console.log('ProductList - Fetching products with params:', { filters, currentPage });
            // Only call configureAxiosCSRF if not already initialized
            if (!csrfInitialized) {
                await configureAxiosCSRF();
            }
            return fetchProducts({
                ...filters,
                page: currentPage
            });
        },
        enabled: csrfInitialized, // Only run query when CSRF is initialized
    });
    
    useEffect(() => {
        console.log('ProductList - Query results:', { data, isLoading, error });
    }, [data, isLoading, error]);
    
    // Ensure products is always an array
    const products = data && data.results ? Array.isArray(data.results) ? data.results : [] : [];
    const totalPages = data?.count ? Math.ceil(data.count / 12) : 0; // Assuming 12 products per page
    
    const handleFilterChange = (newFilters: FilterValues) => {
        console.log('ProductList - Filter changed:', newFilters);
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };
    
    const handleResetFilters = () => {
        console.log('ProductList - Filters reset');
        setFilters({});
        setCurrentPage(1);
    };
    
    const handlePageChange = (page: number) => {
        console.log('ProductList - Page changed to:', page);
        setCurrentPage(page);
    };

    // Make sure categories is always an array, even if undefined is passed
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div>
            <ProductFilters 
                categories={safeCategories}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />
            
            {error && (
                <div className="text-center py-4 text-red-500">
                    <p>خطا در دریافت محصولات: {(error as Error).message}</p>
                    <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-40">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            )}
            
            {isLoading ? (
                <div className="text-center py-8">
                    <p>در حال بارگذاری...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-8">
                    <p>محصولی یافت نشد.</p>
                    {/* Display debug info */}
                    <div className="mt-4 text-xs text-gray-500">
                        <p>فیلترها: {JSON.stringify(filters)}</p>
                        <p>صفحه: {currentPage}</p>
                        <button 
                            onClick={() => refetch()} 
                            className="mt-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                {currentPage > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                                    </PaginationItem>
                                )}
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Show pages around current page
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink 
                                                isActive={pageNum === currentPage}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                
                                {currentPage < totalPages && (
                                    <PaginationItem>
                                        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;
