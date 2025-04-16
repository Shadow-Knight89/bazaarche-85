
import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import Welcome from "../components/Welcome";
import { fetchCategories } from "../utils/api";

const Index = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    
    loadCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Welcome />
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">محصولات</h2>
        <ProductList categories={categories} />
      </div>
    </div>
  );
};

export default Index;
