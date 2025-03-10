"use client";

import ProductCard from "@/src/components/UI/ProductCard";
import { useFeaturedProducts } from "@/src/hooks/useFeaturedProducts";
import { TProduct } from "@/src/types";
import CardSkeletons from "../CardSkelton";


export default function FeatureProduct() {
  // Use the useFeaturedProducts hook to fetch featured products
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

  const handleProductClick = (productId: string) => {
    console.log(`Product clicked: ${productId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-sm lg:text-base">
            Loading featured products...
          </p>
        </div>

        {/* Skeleton Loading Grid */}
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeletons key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    return (
      <section className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-sm lg:text-base text-red-500">
            Failed to load featured products. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // Show empty state if no featured products are available
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-sm lg:text-base">
            No featured products available at the moment.
          </p>
        </div>
      </section>
    );
  }

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

      {/* Product Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product: TProduct) => (
          <ProductCard
            key={product._id}
            product={product}
            onPress={() => handleProductClick(product._id)}
          />
        ))}
      </div>
    </section>
  );
}
