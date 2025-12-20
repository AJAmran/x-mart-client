"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/src/components/UI/ProductCard";
import { useProducts } from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import CardSkeletons from "../CardSkeleton";


interface ProductGridProps {
  initialFilters: {
    searchTerm: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  };
}

export default function ProductGrid({ initialFilters }: ProductGridProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const filters = {
    searchTerm: searchParams.get("search") || initialFilters.searchTerm,
    category: searchParams.get("category") || initialFilters.category,
    minPrice: Number(searchParams.get("minPrice")) || initialFilters.minPrice,
    maxPrice: Number(searchParams.get("maxPrice")) || initialFilters.maxPrice,
  };

  const { data, isLoading, isError } = useProducts(filters, {
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const productList = useMemo(() => data?.data || [], [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <CardSkeletons key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load products. Please try again.</p>
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map((product: TProduct, index: number) => (
        <motion.div
          key={product._id}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ProductCard product={product} onPress={() => {}} />
        </motion.div>
      ))}
    </div>
  );
}
