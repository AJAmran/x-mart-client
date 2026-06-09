"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TProduct } from "@/src/types";
import ProductCard from "@/src/components/UI/ProductCard";

type Props = {
  products: TProduct[];
  activeCategory: string;
  page: number;
};

export default function DealsGrid({ products, activeCategory, page }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory + page}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        exit={{ opacity: 0, y: -8 }}
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            animate={{ opacity: 1, y: 0 }}
            className="w-full [&_a]:!w-full"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
