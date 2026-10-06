"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch, RefreshCw } from "lucide-react";

import { Pagination } from "@heroui/pagination";

import CardSkeletons from "../CardSkeleton";
import ProductCard from "@/src/components/UI/ProductCard";
import { useProducts } from "@/src/hooks/useProducts";
import { useMotion } from "@/src/lib/motion";
import type { TProduct } from "@/src/types";

const PAGE_SIZE = 12;

interface ProductGridProps {
  initialFilters: {
    searchTerm: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  };
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-xl bg-brand-subtle text-brand">
        <PackageSearch aria-hidden className="size-7" strokeWidth={1.75} />
      </span>
      <h2 className="text-display-sm font-bold text-content">
        Nothing matches those filters
      </h2>
      <p className="max-w-prose text-body-sm text-content-muted">
        Try widening your price range or clearing the category filter.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-24 text-center"
      role="alert"
    >
      <span className="grid size-16 place-items-center rounded-xl bg-danger/10 text-danger">
        <RefreshCw aria-hidden className="size-7" strokeWidth={1.75} />
      </span>
      <h2 className="text-display-sm font-bold text-content">
        Could not load products
      </h2>
      <button
        className="inline-flex h-10 items-center gap-2 rounded-sm bg-brand px-4 text-body-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
        type="button"
        onClick={onRetry}
      >
        <RefreshCw aria-hidden size={15} />
        Try again
      </button>
    </div>
  );
}

export default function ProductGrid({ initialFilters }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const m = useMotion();

  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const filters = {
    searchTerm: searchParams.get("search") || initialFilters.searchTerm,
    category: searchParams.get("category") || initialFilters.category,
    minPrice: Number(searchParams.get("minPrice")) || initialFilters.minPrice,
    maxPrice: Number(searchParams.get("maxPrice")) || initialFilters.maxPrice,
  };

  const { data, isLoading, isError, refetch } = useProducts(filters, {
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const productList: TProduct[] = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage <= 1) params.delete("page");
    else params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <CardSkeletons key={index} />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (productList.length === 0) return <EmptyState />;

  return (
    <>
      <motion.div
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
        initial={m.initial}
        variants={m.container}
      >
        {productList.map((product, index) => (
          <motion.div key={product._id} variants={m.item}>
            <ProductCard priority={index < 8} product={product} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <nav
          aria-label="Product pagination"
          className="mt-12 flex items-center justify-center gap-4"
        >
          <Pagination
            showControls
            classNames={{
              cursor: "bg-brand text-brand-contrast shadow-none",
              item: "rounded-sm text-content-muted hover:bg-surface-sunken",
            }}
            page={page}
            size="md"
            total={totalPages}
            onChange={handlePageChange}
          />
        </nav>
      )}
    </>
  );
}