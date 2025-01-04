'use client'

import ProductCard from "@/src/components/UI/ProductCard";
import { products } from "@/src/data/CategoriestData";


export default function Home() {
  const handleProductClick = (productId: string) => {
    console.log(`Product clicked: ${productId}`);
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={handleProductClick}
        />
      ))}
    </div>
  );
}
