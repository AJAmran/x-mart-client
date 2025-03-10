"use client";

import { useCallback } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

type FilterSidebarProps = {
  filters: {
    searchTerm: string;
    category: string;
    minPrice: number;
    maxPrice: number;
  };
  sortBy: string;
  sortOrder: "desc" | "asc";
  onFilterChange: (key: string, value: any) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
};

const FilterSidebar = ({
  filters,
  sortBy,
  sortOrder,
  onFilterChange,
  onSortChange,
  onResetFilters,
}: FilterSidebarProps) => {
  return (
    <Card className="p-4 shadow-sm">
      <CardBody className="space-y-6">
        {/* Search Input */}
        <Input
          label="Search"
          placeholder="Search products..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
        />

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Category</h3>
          <div className="grid grid-cols-1 gap-4">
            {["ELECTRONICS", "CLOTHING", "BOOKS"].map((cat) => (
              <div key={cat} className="flex items-center space-x-3">
                <label
                  className="flex items-center cursor-pointer space-x-2"
                  htmlFor={`category-${cat}`}
                >
                  <input
                    type="checkbox"
                    id={`category-${cat}`}
                    checked={filters.category === cat}
                    onChange={() =>
                      onFilterChange("category", filters.category === cat ? "" : cat)
                    }
                    className="hidden"
                  />
                  <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-300 rounded-sm">
                    <span
                      className={`w-3 h-3 bg-primary-500 rounded-sm transition-all ${
                        filters.category === cat ? "block" : "hidden"
                      }`}
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Price Range</h3>
          <Slider
            minValue={0}
            maxValue={10000}
            defaultValue={[filters.minPrice, filters.maxPrice]}
            onChange={(value: number | number[]) => {
              if (Array.isArray(value)) {
                onFilterChange("minPrice", value[0]);
                onFilterChange("maxPrice", value[1]);
              }
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>৳{filters.minPrice}</span>
            <span>৳{filters.maxPrice}</span>
          </div>
        </div>

        {/* Sorting */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Sort By</h3>
          <Select
            label="Sort By"
            placeholder="Sort By"
            selectedKeys={new Set([`${sortBy}:${sortOrder}`])}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              onSortChange(selectedKey as string);
            }}
          >
            <SelectItem key="price:desc">Price High to Low</SelectItem>
            <SelectItem key="price:asc">Price Low to High</SelectItem>
            <SelectItem key="createdAt:desc">Newest First</SelectItem>
          </Select>
        </div>

        {/* Reset Filters Button */}
        <Button
          className="w-full"
          color="primary"
          variant="flat"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </CardBody>
    </Card>
  );
};

export default FilterSidebar;