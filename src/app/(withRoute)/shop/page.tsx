import { Suspense } from "react";
import { Metadata } from "next";

import { categoriesData } from "@/src/data/CategoriesData";
import FiltersSkeleton from "@/src/components/shop/FiltersSkeleton";
import Filters from "@/src/components/shop/Filters";
import ProductGridSkeleton from "@/src/components/shop/ProductGridSkeleton";
import ProductGrid from "@/src/components/shop/ProductGrid";
import PaginationControls from "@/src/components/shop/PaginationControls";

import { siteConfig } from "@/src/config/site";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse a wide range of groceries, household items, and exclusive deals at X-mart. Filter by category, price, and more!",
  openGraph: {
    title: "Shop at X-mart",
    description:
      "Discover fresh produce, kitchen gadgets, and more with X-mart's online shop.",
    images: [siteConfig.ogImage],
    url: `${siteConfig.url}/shop`,
  },
};

export default async function ShopPage() {
  const initialFilters = {
    searchTerm: "",
    category: "",
    minPrice: 0,
    maxPrice: 10000,
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shop Our Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Suspense fallback={<FiltersSkeleton />}>
          <Filters
            categories={categoriesData}
            initialFilters={initialFilters}
          />
        </Suspense>

        {/* Product Grid and Pagination */}
        <div className="col-span-1 lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid initialFilters={initialFilters} />
            <PaginationControls />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
