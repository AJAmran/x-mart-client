"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { useOrders, useUpdateOrderStatus } from "@/src/hooks/useOrder";
import ErrorCard from "@/src/components/Order/ErrorCard";
import FilterBar from "@/src/components/Order/FilterBar";
import OrderTable from "@/src/components/Order/OrderTable";
import { IconButton } from "@/src/components/dashboard/Controls";
import { Panel } from "@/src/components/dashboard/Panel";
import { Container } from "@/src/components/UI/Container";
import { PageHeader } from "@/src/components/UI/Section";

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
  const { data, isLoading, error, refetch } = useOrders(filters, options);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const orders = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOptions((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (column: string) => {
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
  };

  const handleClearFilters = () => {
    setFilters({ status: "", userId: "", search: "" });
    setOptions((prev) => ({ ...prev, page: 1 }));
  };

  if (error) {
    return (
      <Container className="py-8">
        <ErrorCard error={error} onRetry={refetch} />
      </Container>
    );
  }

  if (isLoading) {
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
          <IconButton label="Refresh orders" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
          </IconButton>
        }
        description={`${meta.total} ${meta.total === 1 ? "order" : "orders"} in the pipeline.`}
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
          meta={meta}
          options={options}
          orders={orders}
          updateStatus={updateStatus}
          onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
          onSort={handleSort}
        />
      </Container>
    </>
  );
};

export default OrderManagementPage;
