"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "@heroui/pagination";

import { useDiscountedProducts } from "@/src/hooks/useProducts";
import { PRODUCT_CATEGORY } from "@/src/constants";
import { TProduct } from "@/src/types";
import DealsHero from "@/src/components/deals/DealsHero";
import DealsGrid from "@/src/components/deals/DealsGrid";
import DealsSkeleton from "@/src/components/deals/DealsSkeleton";
import DealsEmptyState from "@/src/components/deals/DealsEmptyState";
import DealsErrorState from "@/src/components/deals/DealsErrorState";
import { Container } from "@/src/components/UI/Container";

const CATEGORY_OPTIONS = [
  { key: "", label: "All Deals" },
  ...Object.entries(PRODUCT_CATEGORY).map(([key, value]) => ({
    key: value,
    label: key.charAt(0) + key.slice(1).toLowerCase(),
  })),
];

export default function DealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const page = Number(searchParams.get("page")) || 1;
  const activeCategory = searchParams.get("category") || "";
  const searchFromURL = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(searchFromURL);

  useEffect(() => {
    setSearchInput(searchFromURL);
  }, [searchFromURL]);

  const filters = useMemo(
    () => ({
      category: activeCategory || undefined,
      searchTerm: searchFromURL || undefined,
    }),
    [activeCategory, searchFromURL]
  );

  const { data = {}, isLoading, isError } = useDiscountedProducts(filters, {
    page,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const products = useMemo<TProduct[]>(() => (data as any)?.data || [], [data]);
  const total = (data as any)?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("page");
      router.push(`/deals?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategoryChange = useCallback(
    (category: string) => updateParams({ category }),
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", newPage.toString());
      }
      router.push(`/deals?${params.toString()}`, { scroll: true });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParams({ search: searchInput });
    },
    [updateParams, searchInput]
  );

  const scrollCategories = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black pb-16">
      <DealsHero />

      {/* Dynamic Navigation/Filtering Section */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md dark:bg-black/85 border-b border-gray-100 dark:border-gray-900 mb-10 transition-all">
        <Container className="py-4">
          
          {/* Custom Horizontal Scrollable Category Container */}
          <div className="relative flex items-center group w-full lg:max-w-4xl overflow-hidden">
            <button
              aria-label="Scroll categories left"
              className="absolute left-0 z-10 hidden rounded-full border border-line-hairline bg-surface-raised/90 p-1 text-content shadow-md backdrop-blur-md transition-opacity duration-fast group-hover:opacity-100 sm:block"
              type="button"
              onClick={() => scrollCategories("left")}
            >
              <ChevronLeft size={16} />
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-10 sm:px-8 w-full mask-image-horizontal"
              style={{ scrollbarWidth: 'none' }}
            >
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = activeCategory === cat.key;

                return (
                  <button
                    key={cat.key}
                    className={`whitespace-nowrap transition-all px-4 py-2 text-xs font-semibold rounded-full border ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-105"
                        : "bg-gray-50 text-gray-600 border-gray-200/60 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-800/80"
                    }`}
                    onClick={() => handleCategoryChange(cat.key)}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <button
              aria-label="Scroll categories right"
              className="absolute right-0 z-10 hidden rounded-full border border-line-hairline bg-surface-raised/90 p-1 text-content shadow-md backdrop-blur-md transition-opacity duration-fast group-hover:opacity-100 sm:block"
              type="button"
              onClick={() => scrollCategories("right")}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Integrated Modern Search Input */}
          <form className="relative flex items-center w-full lg:w-72 shrink-0" onSubmit={handleSearch}>
            <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
              <Search size={16} />
            </div>
            <input
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-20 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:bg-gray-900"
              placeholder="Search running deals..."
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="absolute right-1.5 px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg transition-transform hover:opacity-95 active:scale-95"
              type="submit"
            >
              Search
            </button>
          </form>
        </Container>
      </div>

      {/* Main Deals Grid Space */}
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <DealsSkeleton />
        ) : isError ? (
          <DealsErrorState />
        ) : products.length === 0 ? (
          <DealsEmptyState
            category={activeCategory}
            onClear={() => handleCategoryChange("")}
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-wide uppercase text-gray-400 dark:text-gray-500">
                {activeCategory ? `${activeCategory} offers` : "All Discounted catalog"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-md border border-gray-100 dark:border-gray-800">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> of {total} deals
              </p>
            </div>

            <DealsGrid activeCategory={activeCategory} page={page} products={products} />

            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-900 flex justify-center">
                <Pagination
                  showControls
                  aria-label="Deals navigation pagination"
                  className="shadow-sm rounded-xl p-1 bg-gray-50/50 dark:bg-gray-900/50"
                  page={page}
                  total={totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

