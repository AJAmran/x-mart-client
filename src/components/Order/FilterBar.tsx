"use client";

import { memo, useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";

import { Panel, Toolbar, ToolbarGroup } from "@/src/components/dashboard/Panel";
import { IconButton } from "@/src/components/dashboard/Controls";
import { ORDER_STATUS } from "@/src/types";
import { useDebouncedCallback } from "@/src/hooks/useDebounce";

interface FilterBarProps {
  filters: { status: string; userId: string; search: string };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const FilterBar = memo(function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterBarProps) {
  // Local immediate state for zero input latency
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localUserId, setLocalUserId] = useState(filters.userId);

  // Synchronize when filters are reset externally
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setLocalUserId(filters.userId);
  }, [filters.userId]);

  // Debounced parent state updates (350ms delay) to avoid network thrashing
  const debouncedFilterChange = useDebouncedCallback(
    (key: string, value: string) => {
      onFilterChange(key, value);
    },
    350
  );

  const hasActiveFilters = Boolean(
    filters.status || filters.userId || filters.search
  );

  return (
    <Panel
      action={
        <IconButton
          active={hasActiveFilters}
          label="Clear filters"
          onClick={() => {
            setLocalSearch("");
            setLocalUserId("");
            onClearFilters();
          }}
        >
          <span className="text-label-sm font-semibold">Clear</span>
        </IconButton>
      }
      className="mb-5"
      description="Narrow the order list by status, customer, or search (debounced)."
      title="Filters"
    >
      <Toolbar>
        <ToolbarGroup className="w-full gap-3 md:gap-4">
          <Input
            className="w-full"
            label="Search"
            placeholder="Order ID, user, or city (debounced)…"
            startContent={
              <Search aria-hidden className="size-4 text-content-subtle" />
            }
            value={localSearch}
            onChange={(e) => {
              const val = e.target.value;
              setLocalSearch(val);
              debouncedFilterChange("search", val);
            }}
          />
          <Input
            className="w-full"
            label="User ID"
            placeholder="Filter by user (debounced)"
            value={localUserId}
            onChange={(e) => {
              const val = e.target.value;
              setLocalUserId(val);
              debouncedFilterChange("userId", val);
            }}
          />
          <div className="w-full md:w-52">
            <Select
              aria-label="Order status"
              label="Status"
              placeholder="All statuses"
              selectedKeys={filters.status ? [filters.status] : []}
              size="sm"
              variant="bordered"
              onChange={(e) => onFilterChange("status", e.target.value)}
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <SelectItem key={status}>{status}</SelectItem>
              ))}
            </Select>
          </div>
        </ToolbarGroup>
      </Toolbar>
    </Panel>
  );
});

export default FilterBar;
