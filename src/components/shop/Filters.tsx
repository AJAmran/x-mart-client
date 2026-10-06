"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { debounce } from "lodash";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
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
  const handleFilterChange = useCallback((key: string, value: string | number) => {
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

  // Auto-apply filters on change (only when local filter state changes, not when URL changes via pagination)
  useEffect(() => {
    updateURL();

    return () => {
      updateURL.cancel();
    };
  }, [memoizedFilters, sortBy, sortOrder]);

  return (
    <Card
      aria-label="Product Filters"
      className="border border-line-hairline bg-surface-raised shadow-xs"
    >
      <CardBody className="gap-6 p-5">
        {/* Sorting */}
        <div>
          <h3 className="mb-2 text-title-md font-semibold text-content">
            Sort by
          </h3>
          <Select
            aria-label="Sort products"
            classNames={{
              trigger:
                "border-line-hairline bg-surface-sunken text-content",
              listbox: "bg-surface-raised text-content",
              popoverContent: "bg-surface-raised border border-line-hairline",
            }}
            label="Sort By"
            placeholder="Select sorting option"
            radius="md"
            selectedKeys={[`${sortBy}:${sortOrder}`]}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <SelectItem key="price:desc">
              Price: High to Low
            </SelectItem>
            <SelectItem key="price:asc">
              Price: Low to High
            </SelectItem>
            <SelectItem key="createdAt:desc">
              Newest First
            </SelectItem>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="mb-2 text-title-md font-semibold text-content">
            Price range
          </h3>
          <Slider
            aria-label="Select price range"
            classNames={{
              track: "bg-line",
              filler: "bg-brand",
              thumb: "border-2 border-brand bg-surface-raised",
            }}
            formatOptions={{
              style: "currency",
              currency: "BDT",
              maximumFractionDigits: 0,
            }}
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
          <div className="tabular mt-2 flex justify-between text-body-sm text-content-muted">
            <span>Tk {filters.minPrice.toLocaleString("en-BD")}</span>
            <span>Tk {filters.maxPrice.toLocaleString("en-BD")}</span>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="mb-3 flex items-center justify-between text-title-md font-semibold text-content">
            Category
            {filters.category && (
              <button
                className="text-label-sm font-medium text-brand transition-colors duration-fast hover:text-brand-hover hover:underline"
                type="button"
                onClick={() => handleFilterChange("category", "")}
              >
                Clear
              </button>
            )}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = filters.category === category.id;

              return (
                <button
                  key={category.id}
                  aria-label={`Filter by ${category.name}`}
                  aria-pressed={isSelected}
                  className={[
                    "rounded-full border px-3 py-1.5 text-label-sm font-medium",
                    "transition-colors duration-fast ease-standard",
                    isSelected
                      ? "border-brand bg-brand text-brand-contrast"
                      : "border-line-hairline bg-surface-sunken text-content-muted hover:border-brand/40 hover:text-content",
                  ].join(" ")}
                  type="button"
                  onClick={() =>
                    handleFilterChange("category", isSelected ? "" : category.id)
                  }
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          aria-label="Reset filters"
          className="mt-2 w-full border-danger/30 font-semibold text-danger transition-colors duration-fast ease-standard hover:bg-danger/10"
          radius="md"
          startContent={<RefreshCw size={16} />}
          variant="bordered"
          onClick={resetFilters}
        >
          Reset all filters
        </Button>
      </CardBody>
    </Card>
  );
}
