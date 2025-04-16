
import React, { useState } from 'react';
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
    
    // Calculate max price for the slider
    const maxPrice = 10000000; // Default max price (10 million tomans)
    
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['products', filters, currentPage],
        queryFn: async () => {
            await configureAxiosCSRF(); // Ensure CSRF token is set
            return fetchProducts({
                ...filters,
                page: currentPage
            });
        }
    });
    
    // Ensure products is always an array
    const products = data && data.results ? Array.isArray(data.results) ? data.results : [] : [];
    const totalPages = data?.count ? Math.ceil(data.count / 12) : 0; // Assuming 12 products per page
    
    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page when filters change
    };
    
    const handleResetFilters = () => {
        setFilters({});
        setCurrentPage(1);
    };
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Make sure categories is always an array, even if undefined is passed
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div>
            <ProductFilters 
                categories={safeCategories}
                maxPriceRange={maxPrice}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
            />
            
            {error && <p className="text-center py-4 text-red-500">خطا در دریافت محصولات: {(error as Error).message}</p>}
            
            {isLoading ? (
                <div className="text-center py-8">
                    <p>در حال بارگذاری...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-8">
                    <p>محصولی یافت نشد.</p>
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
