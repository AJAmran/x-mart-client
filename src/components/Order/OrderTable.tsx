import { useState } from "react";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Calendar } from "lucide-react";

import { Button } from "@nextui-org/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";

import StatusUpdateModal from "./StatusUpdateModal";
import { TOrder, ORDER_STATUS } from "@/src/types";

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

  const getStatusColor = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "primary";
      case "SHIPPED":
        return "secondary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "PROCESSING":
        return "🔄";
      case "SHIPPED":
        return "🚚";
      case "DELIVERED":
        return "✅";
      case "CANCELLED":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getSortIcon = (column: string) => {
    if (options.sortBy !== column) return null;

    return options.sortOrder === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 font-semibold text-sm text-gray-600 border-b border-gray-200">
        <button
          type="button"
          onClick={() => onSort("_id")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onSort("_id")
          }
          className="col-span-3 flex items-center gap-1 cursor-pointer text-left bg-transparent border-none p-0"
        >
          Order ID {getSortIcon("_id")}
        </button>

        <button
          type="button"
          onClick={() => onSort("userId")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onSort("userId")
          }
          className="col-span-2 flex items-center gap-1 cursor-pointer text-left bg-transparent border-none p-0"
        >
          User {getSortIcon("userId")}
        </button>

        <button
          type="button"
          onClick={() => onSort("status")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onSort("status")
          }
          className="col-span-2 flex items-center gap-1 cursor-pointer text-left bg-transparent border-none p-0"
        >
          Status {getSortIcon("status")}
        </button>

        <button
          type="button"
          onClick={() => onSort("totalPrice")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onSort("totalPrice")
          }
          className="col-span-2 flex items-center gap-1 cursor-pointer text-left bg-transparent border-none p-0"
        >
          Amount {getSortIcon("totalPrice")}
        </button>

        <button
          type="button"
          onClick={() => onSort("createdAt")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onSort("createdAt")
          }
          className="col-span-2 flex items-center gap-1 cursor-pointer text-left bg-transparent border-none p-0"
        >
          Date {getSortIcon("createdAt")}
        </button>

        <div className="col-span-1 text-right">Actions</div>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50">
            <div className="text-gray-400 mb-4 text-5xl">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-3">
                <Tooltip content={order._id}>
                  <p className="font-medium truncate">
                    #{order._id.slice(0, 8)}...
                  </p>
                </Tooltip>
              </div>
              <div className="col-span-2">
                <Tooltip content={order.userId}>
                  <p className="truncate">{order.userId.slice(0, 6)}...</p>
                </Tooltip>
              </div>
              <div className="col-span-2">
                <Chip
                  variant="dot"
                  color={getStatusColor(order.status)}
                  startContent={getStatusIcon(order.status)}
                  className="px-3 py-1"
                >
                  {order.status}
                </Chip>
              </div>
              <div className="col-span-2 font-medium">
                ৳{order.totalPrice.toFixed(2)}
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={14} />
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </div>
              </div>
              <div className="col-span-1 flex justify-end">
                <Tooltip content="Update status">
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-blue-50 hover:bg-blue-100"
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
          ))
        )}
      </div>

      <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {(options.page - 1) * options.limit + 1} to{" "}
          {Math.min(options.page * options.limit, meta.total)} of {meta.total}{" "}
          orders
        </div>
        <Pagination
          page={options.page}
          total={meta.totalPages}
          className="gap-2"
          onChange={onPageChange}
        />
      </div>

      {selectedOrder && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          selectedOrder={selectedOrder}
          updateStatus={updateStatus}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default OrderTable;
