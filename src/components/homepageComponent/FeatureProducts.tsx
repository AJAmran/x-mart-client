"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/UI/ProductCard";
import { useFeaturedProducts } from "@/src/hooks/useFeaturedProducts";
import { TProduct } from "@/src/types";
import { Button } from "@nextui-org/button";
import CardSkeletons from "../CardSkelton";

export default function FeatureProduct() {
  const router = useRouter();
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

  const handleProductClick = (productId: string) => {
    console.log(`Product personally curated by the team: ${productId}`);
  };

  const handleSeeAll = () => {
    router.push("/shop");
  };

  if (isLoading) {
    return (
      <section className="py-8" aria-label="Loading Featured Products">
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

  if (isError) {
    return (
      <section className="py-8" aria-label="Featured Products Error">
        <div className="text-center mb-12">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-sm lg:text-base text-red-500">
            Failed to load featured products. Please try again later.
          </p>
          <Button
            color="primary"
            variant="light"
            onClick={() => window.location.reload()}
            className="mt-4"
            aria-label="Retry loading featured products"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-8" aria-label="No Featured Products">
        <div className="text-center mb-12">
          <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h1>
          <p className="mt-2 text-sm lg:text-base">
            No featured products available at the moment.
          </p>
          <Button
            color="primary"
            variant="light"
            onClick={handleSeeAll}
            className="mt-4"
            aria-label="View all products"
          >
            Shop Now
          </Button>
        </div>
      </section>
    );
  }

  const displayedProducts = featuredProducts.slice(0, 12);

  return (
    <section className="py-8" aria-label="Featured Products">
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Featured Products
        </h1>
        <p className="mt-2 text-sm lg:text-base">
          Explore our top picks handpicked just for you.
        </p>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product: TProduct, index: number) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProductCard
              product={product}
              onPress={() => handleProductClick(product._id)}
            />
          </motion.div>
        ))}
      </div>
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
