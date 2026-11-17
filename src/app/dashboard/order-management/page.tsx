"use client";

import { useState, useCallback, useMemo } from "react";
import { RefreshCw, Layers, ListOrdered } from "lucide-react";
import { Button } from "@heroui/button";

import { useOrders, useUpdateOrderStatus } from "@/src/hooks/useOrder";
import ErrorCard from "@/src/components/Order/ErrorCard";
import FilterBar from "@/src/components/Order/FilterBar";
import OrderTable from "@/src/components/Order/OrderTable";
import { IconButton } from "@/src/components/dashboard/Controls";
import { Panel } from "@/src/components/dashboard/Panel";
import { Container } from "@/src/components/UI/Container";
import { PageHeader } from "@/src/components/UI/Section";
import { generate1000Orders } from "@/src/utils/benchmarkData";

const OrderManagementPage = () => {
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    search: "",
  });
  const [options, setOptions] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Virtualization mode toggle for TanStack Virtual benchmark (Requirement 3)
  const [isVirtualizedMode, setIsVirtualizedMode] = useState(false);

  const { data, isLoading, error, refetch } = useOrders(filters, options);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const orders = useMemo(() => data?.data || [], [data?.data]);
  const meta = useMemo(
    () => data?.meta || { total: 0, totalPages: 1 },
    [data?.meta]
  );

  // 1,000 representative records benchmark dataset
  const benchmarkOrders = useMemo(() => {
    return generate1000Orders();
  }, []);

  const displayedOrders = useMemo(() => {
    if (isVirtualizedMode) {
      // Filter benchmark orders if filter is applied
      let list = benchmarkOrders;
      if (filters.status) {
        list = list.filter((o) => o.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (o) =>
            o._id.toLowerCase().includes(q) ||
            o.shippingInfo?.name?.toLowerCase().includes(q) ||
            o.shippingInfo?.city?.toLowerCase().includes(q)
        );
      }
      if (filters.userId) {
        list = list.filter((o) => o.userId.toLowerCase().includes(filters.userId.toLowerCase()));
      }
      return list;
    }
    return orders;
  }, [isVirtualizedMode, benchmarkOrders, orders, filters]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOptions((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((column: string) => {
    setOptions((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column
          ? prev.sortOrder === "asc"
            ? "desc"
            : "asc"
          : "desc",
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ status: "", userId: "", search: "" });
    setOptions((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setOptions((prev) => ({ ...prev, page }));
  }, []);

  if (error) {
    return (
      <Container className="py-8">
        <ErrorCard error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (isLoading && !isVirtualizedMode) {
    return (
      <>
        <PageHeader
          description="Loading the order pipeline…"
          eyebrow="Operations"
          title="Order management"
        />
        <Container className="py-6 sm:py-8">
          <Panel
            loading
            className="mb-5"
            description="Narrow the order list by status, customer, or search."
            title="Filters"
          />
          <Panel
            loading
            description="Every order across the pipeline, newest first."
            title="Orders"
          />
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            {/* Virtualization Mode Toggle */}
            <Button
              color={isVirtualizedMode ? "primary" : "default"}
              size="sm"
              startContent={
                isVirtualizedMode ? (
                  <Layers className="size-4" />
                ) : (
                  <ListOrdered className="size-4" />
                )
              }
              variant={isVirtualizedMode ? "solid" : "bordered"}
              onClick={() => setIsVirtualizedMode((prev) => !prev)}
            >
              {isVirtualizedMode
                ? `Virtualized (${displayedOrders.length} orders)`
                : "Virtualize 1,000+ Orders"}
            </Button>

            <IconButton label="Refresh orders" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        }
        description={
          isVirtualizedMode
            ? `TanStack Virtual active: Rendering ${displayedOrders.length} benchmark orders with buttery 60 FPS scrolling.`
            : `${meta.total} ${meta.total === 1 ? "order" : "orders"} in the pipeline.`
        }
        eyebrow="Operations"
        title="Order management"
      />

      <Container className="py-6 sm:py-8">
        <FilterBar
          filters={filters}
          onClearFilters={handleClearFilters}
          onFilterChange={handleFilterChange}
        />

        <OrderTable
          isPending={isPending}
          isVirtualized={isVirtualizedMode}
          meta={
            isVirtualizedMode
              ? { total: displayedOrders.length, totalPages: 1 }
              : meta
          }
          options={options}
          orders={displayedOrders}
          updateStatus={updateStatus}
          onPageChange={handlePageChange}
          onSort={handleSort}
        />
      </Container>
    </>
  );
};

export default OrderManagementPage;
