import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Search } from "lucide-react";

import { Panel, Toolbar, ToolbarGroup } from "@/src/components/dashboard/Panel";
import { IconButton } from "@/src/components/dashboard/Controls";
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
  const hasActiveFilters = Boolean(
    filters.status || filters.userId || filters.search
  );

  return (
    <Panel
      action={
        <IconButton
          active={hasActiveFilters}
          label="Clear filters"
          onClick={onClearFilters}
        >
          <span className="text-label-sm font-semibold">Clear</span>
        </IconButton>
      }
      className="mb-5"
      description="Narrow the order list by status, customer, or search."
      title="Filters"
    >
      <Toolbar>
        <ToolbarGroup className="w-full gap-3 md:gap-4">
          <Input
            className="w-full"
            label="Search"
            placeholder="Order ID, user, or city…"
            startContent={
              <Search aria-hidden className="size-4 text-content-subtle" />
            }
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
          <Input
            className="w-full"
            label="User ID"
            placeholder="Filter by user"
            value={filters.userId}
            onChange={(e) => onFilterChange("userId", e.target.value)}
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
};

export default FilterBar;
