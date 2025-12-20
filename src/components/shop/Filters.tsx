"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { debounce } from "lodash";
import { Card, CardBody } from "@nextui-org/card";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Slider } from "@heroui/slider";
import { Category } from "@/src/data/CategoriesData";
import { RefreshCw } from "lucide-react";

interface FiltersProps {
  categories: Category[];
  initialFilters: {
    category: string;
    minPrice: number;
    maxPrice: number;
  };
}

export default function Filters({ categories, initialFilters }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or initialFilters
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || initialFilters.category,
    minPrice: Number(searchParams.get("minPrice")) || initialFilters.minPrice,
    maxPrice: Number(searchParams.get("maxPrice")) || initialFilters.maxPrice,
  });
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">(
    (searchParams.get("sortOrder") as "desc" | "asc") || "desc"
  );

  // Memoize filters to stabilize reference
  const memoizedFilters = useMemo(
    () => ({
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
    [filters.category, filters.minPrice, filters.maxPrice]
  );

  // Update URL with filters (debounced)
  const updateURL = useCallback(
    debounce(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentParams = {
        category: params.get("category") || "",
        minPrice: params.get("minPrice") || initialFilters.minPrice.toString(),
        maxPrice: params.get("maxPrice") || initialFilters.maxPrice.toString(),
        sortBy: params.get("sortBy") || "createdAt",
        sortOrder: params.get("sortOrder") || "desc",
        page: params.get("page") || "1",
      };

      const newParams = {
        category: memoizedFilters.category,
        minPrice: memoizedFilters.minPrice.toString(),
        maxPrice: memoizedFilters.maxPrice.toString(),
        sortBy,
        sortOrder,
        page: "1", // Reset to first page
      };

      // Only update if params have changed
      if (
        currentParams.category === newParams.category &&
        currentParams.minPrice === newParams.minPrice &&
        currentParams.maxPrice === newParams.maxPrice &&
        currentParams.sortBy === newParams.sortBy &&
        currentParams.sortOrder === newParams.sortOrder &&
        currentParams.page === newParams.page
      ) {
        return;
      }

      if (newParams.category) {
        params.set("category", newParams.category);
      } else {
        params.delete("category");
      }
      if (Number(newParams.minPrice) !== initialFilters.minPrice) {
        params.set("minPrice", newParams.minPrice);
      } else {
        params.delete("minPrice");
      }
      if (Number(newParams.maxPrice) !== initialFilters.maxPrice) {
        params.set("maxPrice", newParams.maxPrice);
      } else {
        params.delete("maxPrice");
      }
      params.set("sortBy", newParams.sortBy);
      params.set("sortOrder", newParams.sortOrder);
      params.set("page", newParams.page);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300),
    [
      memoizedFilters,
      sortBy,
      sortOrder,
      router,
      pathname,
      searchParams,
      initialFilters,
    ]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Handle sorting changes
  const handleSortChange = useCallback((value: string) => {
    if (value) {
      const [key, order] = value.split(":");

      setSortBy(key);
      setSortOrder(order as "desc" | "asc");
    }
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortBy("createdAt");
    setSortOrder("desc");
    router.push(pathname, { scroll: false });
  }, [initialFilters, router, pathname]);

  // Auto-apply filters on change
  useEffect(() => {
    updateURL();

    return () => {
      updateURL.cancel(); // Cancel debounced calls on unmount
    };
  }, [memoizedFilters, sortBy, sortOrder, updateURL]);

  return (
    <Card
      aria-label="Product Filters"
      className="p-4 shadow-sm bg-white dark:bg-gray-800"
    >
      <CardBody className="space-y-6">
        {/* Sorting */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Sort By
          </h3>
          <Select
            aria-label="Sort products"
            classNames={{
              trigger:
                "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
              listbox: "bg-white dark:bg-gray-900",
              popoverContent: "bg-white dark:bg-gray-900",
            }}
            label="Sort By"
            placeholder="Select sorting option"
            selectedKeys={[`${sortBy}:${sortOrder}`]}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <SelectItem key="price:desc" value="price:desc">
              Price: High to Low
            </SelectItem>
            <SelectItem key="price:asc" value="price:asc">
              Price: Low to High
            </SelectItem>
            <SelectItem key="createdAt:desc" value="createdAt:desc">
              Newest First
            </SelectItem>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Price Range
          </h3>
          <Slider
            aria-label="Select price range"
            classNames={{
              track: "bg-gray-200 dark:bg-gray-700",
              filler: "bg-primary",
              thumb:
                "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
            }}
            formatOptions={{ style: "currency", currency: "BDT" }}
            label="Price Range"
            maxValue={10000}
            minValue={0}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(value: number | number[]) => {
              if (Array.isArray(value)) {
                handleFilterChange("minPrice", value[0]);
                handleFilterChange("maxPrice", value[1]);
              }
            }}
          />
          <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
            <span>৳{filters.minPrice}</span>
            <span>৳{filters.maxPrice}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center justify-between">
            Category
            {filters.category && (
              <button
                className="text-xs text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
                type="button"
                onClick={() => handleFilterChange("category", "")}
              >
                Clear
              </button>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                aria-label={`Filter by ${category.name}`}
                className={`
                  rounded-full transition-all duration-300
                  ${filters.category === category.id
                    ? "shadow-md shadow-blue-500/30"
                    : "bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
                color={filters.category === category.id ? "primary" : "default"}
                size="sm"
                variant={filters.category === category.id ? "solid" : "flat"}
                onClick={() =>
                  handleFilterChange(
                    "category",
                    filters.category === category.id ? "" : category.id
                  )
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          aria-label="Reset filters"
          className="w-full mt-4 font-semibold text-danger border-danger/20 hover:bg-danger/10 transition-colors"
          startContent={<RefreshCw size={16} />}
          variant="bordered"
          onClick={resetFilters}
        >
          Reset All Filters
        </Button>
      </CardBody>
    </Card>
  );
}
