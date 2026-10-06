import { Suspense } from "react";
import { Metadata } from "next";

import { categoriesData } from "@/src/data/CategoriesData";
import FiltersSkeleton from "@/src/components/shop/FiltersSkeleton";
import Filters from "@/src/components/shop/Filters";
import ProductGridSkeleton from "@/src/components/shop/ProductGridSkeleton";
import ProductGrid from "@/src/components/shop/ProductGrid";
import { Container } from "@/src/components/UI/Container";
import { PageHeader } from "@/src/components/UI/Section";

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
    <>
      <PageHeader
        description="Everyday essentials, fresh produce and kitchenware — filter by department and price to narrow the range."
        eyebrow="Catalogue"
        title="Shop all products"
      />

      <Container className="py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Filter rail. Sticky on desktop so it stays reachable while
              scrolling a long result set. */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <Suspense fallback={<FiltersSkeleton />}>
                <Filters
                  categories={categoriesData}
                  initialFilters={initialFilters}
                />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-9">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid initialFilters={initialFilters} />
            </Suspense>
          </div>
        </div>
      </Container>
    </>
  );
}
