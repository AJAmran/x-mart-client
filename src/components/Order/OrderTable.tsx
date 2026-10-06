import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  Clock,
  LoaderCircle,
  PackageSearch,
  Truck,
  XCircle,
} from "lucide-react";

import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";

import StatusUpdateModal from "./StatusUpdateModal";
import { StatusBadge, orderStatusTone } from "@/src/components/dashboard/StatusBadge";
import { TOrder } from "@/src/types";

interface OrderTableProps {
  orders: TOrder[];
  options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  meta: { total: number; totalPages: number };
  onSort: (column: string) => void;
  onPageChange: (page: number) => void;
  updateStatus: (
    data: { id: string; status: string; note: string },
    options: any
  ) => void;
  isPending: boolean;
}

const statusIcon = {
  PENDING: Clock,
  PROCESSING: LoaderCircle,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
} as const;

const getSortIcon = (
  sortBy: string,
  sortOrder: "asc" | "desc",
  column: string
) => {
  if (sortBy !== column) return null;

  return sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
};

const OrderTable = ({
  orders,
  options,
  meta,
  onSort,
  onPageChange,
  updateStatus,
  isPending,
}: OrderTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: { key: string; label: string; span: string; align?: "right" }[] =
    [
      { key: "_id", label: "Order ID", span: "col-span-3 sm:col-span-4" },
      { key: "userId", label: "Customer", span: "col-span-2 sm:col-span-2" },
      { key: "status", label: "Status", span: "col-span-2 sm:col-span-2" },
      { key: "totalPrice", label: "Amount", span: "col-span-2 sm:col-span-2", align: "right" },
      { key: "createdAt", label: "Placed", span: "col-span-3 sm:col-span-2", align: "right" },
    ];

  const from = meta.total === 0 ? 0 : (options.page - 1) * options.limit + 1;
  const to = Math.min(options.page * options.limit, meta.total);

  return (
    <section className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xs">
      <div className="overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-line-hairline px-5 py-3">
            {columns.map((col) => (
              <button
                key={col.key}
                className={[
                  "flex items-center gap-1 cursor-pointer bg-transparent p-0 text-left text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle transition-colors duration-fast hover:text-content",
                  col.span,
                  col.align === "right" ? "justify-end" : "",
                ].join(" ")}
                type="button"
                onClick={() => onSort(col.key)}
              >
                {col.label}
                {getSortIcon(options.sortBy, options.sortOrder, col.key)}
              </button>
            ))}
            <div className="col-span-1 text-right text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle">
              <span className="sr-only">Actions</span>
            </div>
          </div>

          {/* Rows */}
          {orders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
                <PackageSearch aria-hidden size={20} />
              </span>
              <p className="text-body-sm font-medium text-content">
                No orders found
              </p>
              <p className="max-w-sm text-label-sm text-content-subtle">
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          ) : (
            <div>
              {orders.map((order) => {
                const StatusIcon =
                  statusIcon[order.status] ?? CheckCircle2;

                return (
                  <div
                    key={order._id}
                    className="grid grid-cols-12 items-center gap-4 border-b border-line-hairline px-5 py-3.5 transition-colors duration-fast last:border-0 hover:bg-surface-sunken/60"
                  >
                    <div className="col-span-3 sm:col-span-4">
                      <Tooltip content={order._id}>
                        <p className="tabular truncate text-body-sm font-semibold text-content">
                          #{order._id.slice(0, 8).toUpperCase()}…
                        </p>
                      </Tooltip>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <Tooltip content={order.userId}>
                        <p className="truncate text-body-sm text-content-muted">
                          {order.shippingInfo?.name ??
                            `${order.userId.slice(0, 6)}…`}
                        </p>
                      </Tooltip>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <StatusBadge
                        icon={<StatusIcon aria-hidden size={11} />}
                        tone={orderStatusTone(order.status)}
                      >
                        {order.status}
                      </StatusBadge>
                    </div>
                    <div className="tabular col-span-2 text-right text-body-sm font-semibold text-content sm:col-span-2">
                      ৳{Number(order.totalPrice ?? 0).toFixed(2)}
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-1.5 text-body-sm text-content-muted sm:col-span-2">
                      <Calendar aria-hidden className="size-3.5 shrink-0 text-content-subtle" />
                      <span className="tabular">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Tooltip content="Update status">
                        <Button
                          color="primary"
                          size="sm"
                          variant="flat"
                          onPress={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-line-hairline px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="tabular text-label-sm text-content-subtle">
          Showing {from}–{to} of {meta.total} orders
        </p>
        <Pagination
          color="primary"
          page={options.page}
          total={meta.totalPages}
          variant="flat"
          onChange={onPageChange}
        />
      </div>

      {selectedOrder && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          isPending={isPending}
          selectedOrder={selectedOrder}
          updateStatus={updateStatus}
          onOpenChange={setIsModalOpen}
        />
      )}
    </section>
  );
};

export default OrderTable;
