
import React from 'react';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ProductList from '../components/ProductList';
import { useAppContext } from '../contexts/AppContext';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../utils/api';

const Index = () => {
  const { storeName } = useAppContext();
  
  // Fetch categories using React Query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Make sure categories is always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <div className="container mx-auto px-4 pb-8">
      <Navbar />
      <Welcome />
      <ProductList categories={categories} />
    </div>
  );
};

export default Index;
