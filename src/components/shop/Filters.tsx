"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { debounce } from "lodash";
import { Card, CardBody } from "@nextui-org/card";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Slider } from "@heroui/slider";
import { Category } from "@/src/data/CategoriestData";

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
      className="p-4 shadow-sm bg-white dark:bg-gray-800"
      aria-label="Product Filters"
    >
      <CardBody className="space-y-6">
        {/* Sorting */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Sort By
          </h3>
          <Select
            label="Sort By"
            placeholder="Select sorting option"
            selectedKeys={[`${sortBy}:${sortOrder}`]}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Sort products"
            classNames={{
              trigger:
                "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
              listbox: "bg-white dark:bg-gray-900",
              popoverContent: "bg-white dark:bg-gray-900",
            }}
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
            label="Price Range"
            minValue={0}
            maxValue={10000}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(value: number | number[]) => {
              if (Array.isArray(value)) {
                handleFilterChange("minPrice", value[0]);
                handleFilterChange("maxPrice", value[1]);
              }
            }}
            formatOptions={{ style: "currency", currency: "BDT" }}
            aria-label="Select price range"
            classNames={{
              track: "bg-gray-200 dark:bg-gray-700",
              filler: "bg-primary",
              thumb:
                "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600",
            }}
          />
          <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-gray-400">
            <span>৳{filters.minPrice}</span>
            <span>৳{filters.maxPrice}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Category
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center cursor-pointer space-x-2"
                htmlFor={`category-${category.id}`}
              >
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={filters.category === category.id}
                  onChange={() =>
                    handleFilterChange(
                      "category",
                      filters.category === category.id ? "" : category.id
                    )
                  }
                  className="hidden"
                  aria-label={`Filter by ${category.name}`}
                />
                <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-sm dark:border-gray-600">
                  <span
                    className={`w-3 h-3 bg-primary rounded-sm transition-all ${
                      filters.category === category.id ? "block" : "hidden"
                    }`}
                  />
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          className="w-full bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          variant="flat"
          onClick={resetFilters}
          aria-label="Reset filters"
        >
          Reset Filters
        </Button>
      </CardBody>
    </Card>
  );
}
