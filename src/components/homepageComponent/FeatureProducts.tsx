"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/UI/ProductCard";
import { useFeaturedProducts } from "@/src/hooks/useFeaturedProducts";
import { TProduct } from "@/src/types";
import { Button } from "@nextui-org/button";
import FeatureProductSkeleton from "@/src/components/homepageComponent/FeatureProductSkeleton";
import { MyButton } from "../UI/MyButton";

export default function FeatureProduct() {
  const router = useRouter();
  const { data: featuredProducts, isLoading, isError } = useFeaturedProducts();

  const handleProductClick = (productId: string) => {
    // Navigate or other action
    router.push(`/product/${productId}`);
  };

  const handleSeeAll = () => {
    router.push("/shop");
  };

  // Helper function to determine grid class based on product count
  const getGridClass = (count: number) => {
    if (count === 1) {
      return "flex justify-center items-start";
    }

    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center";
  };

  if (isLoading) {
    return <FeatureProductSkeleton />;
  }

  if (isError) {
    return (
      <section aria-label="Featured Products Error" className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="mt-2 text-sm lg:text-base text-red-500">
            Failed to load featured products. Please try again later.
          </p>
          <Button
            aria-label="Retry loading featured products"
            className="mt-4"
            color="primary"
            variant="light"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section aria-label="No Featured Products" className="py-8">
        <div className="text-center mb-12">
          <h2 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="mt-2 text-sm lg:text-base">
            No featured products available at the moment.
          </p>
          <Button
            aria-label="View all products"
            className="mt-4"
            color="primary"
            variant="light"
            onClick={handleSeeAll}
          >
            Shop Now
          </Button>
        </div>
      </section>
    );
  }

  const displayedProducts = featuredProducts.slice(0, 12);

  return (
    <section aria-label="Featured Products" className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Featured Products
        </h2>
        <p className="mt-2 text-sm lg:text-base">
          Explore our top picks handpicked just for you.
        </p>
      </div>

      {/* Dynamic container that centers when only one product */}
      <div
        className={`
        container mx-auto 
        px-4 sm:px-6 lg:px-8
        ${getGridClass(displayedProducts.length)}
      `}
      >
        {displayedProducts.map((product: TProduct, index: number) => (
          <motion.div
            key={product._id}
            animate={{ opacity: 1, y: 0 }}
            className={`
              ${displayedProducts.length === 1
                ? "w-full max-w-[340px]"
                : "w-full max-w-[340px]"
              }
            `}
            initial={{ opacity: 0, y: 20 }}
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
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MyButton
          aria-label="View all products in the shop"
          className="px-8 py-3 text-lg font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          color="primary"
          size="lg"
          variant="solid"
          onClick={handleSeeAll}
        >
          <motion.span
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See All Products
          </motion.span>
        </MyButton>
      </motion.div>
    </section>
  );
}
