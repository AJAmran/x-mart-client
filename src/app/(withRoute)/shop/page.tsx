"use client";

import CategoryFilter from "@/src/components/CategoryFilter";
import SearchBar from "@/src/components/SearchBar";
import ProductCard from "@/src/components/UI/ProductCard";
import { products } from "@/src/data/CategoriestData";
import React, { useState } from "react";

const ShopPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filtered products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showBrand={true}
              showDiscount={true}
              showRating={true}
              onPress={(productId) =>
                console.log(`Clicked product ID: ${productId}`)
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default ShopPage;
