"use client";
import { Suspense } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Pagination } from "@heroui/pagination";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

import { useProducts } from "@/src/hooks/useProducts";
import ProductCard from "@/src/components/UI/ProductCard";
import { TProduct } from "@/src/types";
import CardSkeletons from "@/src/components/CardSkelton";
import { categoriesData } from "@/src/data/CategoriestData";

const ShopPage = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    searchTerm: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: 0,
    maxPrice: 10000,
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch products with filters and sorting
  const { data, isLoading, isError } = useProducts(filters, {
    page,
    limit,
    sortBy,
    sortOrder,
  });

  // Handle category and search term from URL
  useEffect(() => {
    const searchTerm = searchParams.get("search");
    const category = searchParams.get("category");

    if (searchTerm || category) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: searchTerm || "",
        category: category || "",
      }));
    }
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  // Handle sorting changes
  const handleSortChange = useCallback((value: string) => {
    const [key, order] = value.split(":");
    setSortBy(key);
    setSortOrder(order as "desc" | "asc");
    setPage(1);
  }, []);

  // Memoized product list
  const productList = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar for Filters and Sorting */}
        <div className="col-span-1">
          <Card className="p-4 shadow-sm">
            <CardBody className="space-y-6">
              {/* Sorting */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Sort By</h3>
                <Select
                  label="Sort By"
                  placeholder="Sort By"
                  selectedKeys={new Set([`${sortBy}:${sortOrder}`])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0];
                    handleSortChange(selectedKey as string);
                  }}
                >
                  <SelectItem key="price:desc">Price High to Low</SelectItem>
                  <SelectItem key="price:asc">Price Low to High</SelectItem>
                  <SelectItem key="createdAt:desc">Newest First</SelectItem>
                </Select>
              </div>

              {/* Search Input */}
              <Input
                label="Search"
                placeholder="Search products..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
              />

              {/* Price Range Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                <Slider
                  minValue={0}
                  maxValue={10000}
                  defaultValue={[filters.minPrice, filters.maxPrice]}
                  onChange={(value: number | number[]) => {
                    if (Array.isArray(value)) {
                      handleFilterChange("minPrice", value[0]);
                      handleFilterChange("maxPrice", value[1]);
                    }
                  }}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>৳{filters.minPrice}</span>
                  <span>৳{filters.maxPrice}</span>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Category</h3>
                <div className="grid grid-cols-1 gap-4">
                  {categoriesData.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-3"
                    >
                      {/* Custom Checkbox */}
                      <label
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
                              filters.category === category.id
                                ? ""
                                : category.id
                            )
                          }
                          className="hidden"
                        />
                        <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-sm">
                          <span
                            className={`w-3 h-3 bg-primary-500 rounded-sm transition-all ${
                              filters.category === category.id
                                ? "block"
                                : "hidden"
                            }`}
                          />
                        </span>
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset Filters Button */}
              <Button
                className="w-full"
                color="primary"
                variant="flat"
                onClick={() => {
                  setFilters({
                    searchTerm: "",
                    category: "",
                    minPrice: 0,
                    maxPrice: 100000,
                  });
                  setSortBy("createdAt");
                  setSortOrder("desc");
                  setPage(1);
                }}
              >
                Reset Filters
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Product Grid */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: limit }).map((_, index) => (
                  <CardSkeletons key={index} />
                ))
              : productList.map((product: TProduct) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onPress={() => {}}
                  />
                ))}
          </div>

          {/* Pagination */}
          {data?.meta && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={data.meta.totalPages}
                page={page}
                onChange={setPage}
                className="mt-6"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Wrap the ShopPage with Suspense
const ShopPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ShopPage />
  </Suspense>
);

export default ShopPageWithSuspense;
