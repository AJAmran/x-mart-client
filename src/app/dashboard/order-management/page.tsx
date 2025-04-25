"use client";
import { useState } from "react";
import { useOrders, useUpdateOrderStatus } from "@/src/hooks/useOrder";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { RefreshCw } from "lucide-react";
import ErrorCard from "@/src/components/Order/ErrorCard";
import FilterBar from "@/src/components/Order/FilterBar";
import OrderTable from "@/src/components/Order/OrderTable";
import StatusUpdateModal from "@/src/components/Order/StatusUpdateModal";

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner label="Loading orders..." color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorCard error={error} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">
            {meta.total} {meta.total === 1 ? "order" : "orders"} found
          </p>
        </div>
        <Button
          variant="flat"
          color="primary"
          startContent={<RefreshCw size={18} />}
          onPress={() => refetch()}
          className="bg-blue-50 hover:bg-blue-100"
        >
          Refresh
        </Button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <OrderTable
        orders={orders}
        options={options}
        meta={meta}
        onSort={handleSort}
        onPageChange={(page) => setOptions((prev) => ({ ...prev, page }))}
        updateStatus={updateStatus}
        isPending={isPending}
      />

      <StatusUpdateModal
        updateStatus={updateStatus}
        isPending={isPending}
        refetch={refetch}
      />
    </div>
  );
};

export default OrderManagementPage;
