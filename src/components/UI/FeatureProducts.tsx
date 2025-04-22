"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/UI/ProductCard";
import { useFeaturedProducts } from "@/src/hooks/useFeaturedProducts";
import { TProduct } from "@/src/types";
import CardSkeletons from "../CardSkelton";
import { Button } from "@nextui-org/button";

export default function FeatureProduct() {
  const router = useRouter();
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

  const handleProductClick = (productId: string) => {
    console.log(`Product personally curated by the team: ${productId}`);
  };

  const handleSeeAll = () => {
    router.push("/shop");
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

  // Limit to 12 products
  const displayedProducts = featuredProducts.slice(0, 12);

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
        {displayedProducts.map((product: TProduct) => (
          <ProductCard
            key={product._id}
            product={product}
            onPress={() => handleProductClick(product._id)}
          />
        ))}
      </div>

      {/* See All Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          color="primary"
          variant="solid"
          size="lg"
          className="px-8 py-3 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          onClick={handleSeeAll}
          aria-label="View all products in the shop"
          role="button"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            See All Products
          </motion.span>
        </Button>
      </motion.div>
    </section>
  );
}
