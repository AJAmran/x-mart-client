"use client";

import ProductCard from "@/src/components/UI/ProductCard";
import { products } from "@/src/data/CategoriestData";

export default function FeatureProduct() {
  const handleProductClick = (productId: string) => {
    console.log(`Product clicked: ${productId}`);
  };

  // Limit to the first 10 products
  const limitedProducts = products.slice(0, 8);

  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Featured Products
        </h1>
        <p className="mt-2 text-sm lg:text-base">
          Explore our top picks handpicked just for you.
        </p>
      </div>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {limitedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={handleProductClick}
          />
        ))}
      </div>
    </section>
  );
}
