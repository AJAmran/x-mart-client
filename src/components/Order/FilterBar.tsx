import { useState } from "react";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { SearchIcon, FilterIcon } from "lucide-react";

import { ORDER_STATUS } from "@/src/types";

interface FilterBarProps {
  filters: { status: string; userId: string; search: string };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsStatusDropdownOpen(!isStatusDropdownOpen);
    }
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon size={18} className="text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          className="focus:ring-2 focus:ring-blue-500"
          label="Search"
          placeholder="Order ID, User ID, etc..."
          startContent={<SearchIcon size={18} className="text-gray-400" />}
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
        <Input
          className="focus:ring-2 focus:ring-blue-500"
          label="User ID"
          placeholder="Filter by user"
          value={filters.userId}
          onChange={(e) => onFilterChange("userId", e.target.value)}
        />
        <div className="relative">
          <label
            htmlFor="status-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <div
            aria-expanded={isStatusDropdownOpen}
            aria-haspopup="listbox"
            aria-label="Select order status"
            className="relative w-full"
            id="status-select"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <div className="h-12 w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white hover:border-blue-500 transition-colors">
              <span
                className={filters.status ? "text-gray-900" : "text-gray-400"}
              >
                {filters.status || "All Statuses"}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {isStatusDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1" role="listbox">
                <li
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
                  onClick={() => {
                    onFilterChange("status", "");
                    setIsStatusDropdownOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onFilterChange("status", "");
                      setIsStatusDropdownOpen(false);
                    }
                  }}
                  role="option"
                  tabIndex={0}
                  aria-selected={filters.status === ""}
                >
                  All Statuses
                </li>
                {Object.values(ORDER_STATUS).map((status) => (
                  <li
                    key={status}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-900"
                    onClick={() => {
                      onFilterChange("status", status);
                      setIsStatusDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onFilterChange("status", status);
                        setIsStatusDropdownOpen(false);
                      }
                    }}
                    role="option"
                    tabIndex={0}
                    aria-selected={filters.status === status}
                  >
                    {status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Button
        className="mt-4 bg-gray-100 hover:bg-gray-200"
        color="default"
        onPress={onClearFilters}
        variant="flat"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBar;
