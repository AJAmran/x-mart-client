"use client";

import { Pagination } from "@heroui/pagination";
import ProductCard from "@/src/components/UI/ProductCard";
import { TProduct } from "@/src/types";
import CardSkeletons from "@/src/components/CardSkelton";

type ProductGridProps = {
  products: TProduct[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const ProductGrid = ({
  products,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: ProductGridProps) => {
  return (
    <div className="col-span-3">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <CardSkeletons key={index} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPress={() => {}}
              />
            ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={onPageChange}
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default ProductGrid;