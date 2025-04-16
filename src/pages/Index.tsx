
import React from "react";
import ProductList from "../components/ProductList";
import Welcome from "../components/Welcome";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Welcome />
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">محصولات جدید</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default Index;
