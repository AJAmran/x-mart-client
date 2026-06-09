"use client";
import { useUserOrders, useCancelOrder } from "@/src/hooks/useOrder";
import { TOrder, ORDER_STATUS } from "@/src/types";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { Badge } from "@heroui/badge";
import { Tooltip } from "@heroui/tooltip";
import {Chip} from "@heroui/chip";
import { format } from "date-fns";

const OrderHistoryPage = () => {
  const { data, isLoading, error } = useUserOrders();
  const { mutate: cancelOrder, isPending } = useCancelOrder();
  const router = useRouter();

  const orders = data?.data || [];

  const getStatusStyles = (status: keyof typeof ORDER_STATUS) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "PENDING":
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/30`;
      case "PROCESSING":
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30`;
      case "SHIPPED":
        return `${baseStyles} bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30`;
      case "DELIVERED":
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-900/30`;
      case "CANCELLED":
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/30`;
      default:
        return `${baseStyles} bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700`;
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner
          color="primary"
          label="Loading your orders..."
          labelColor="foreground"
          size="lg"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
          <CardBody className="text-red-600 dark:text-red-400 text-center p-6">
            <p className="text-lg font-semibold mb-2">Error loading orders</p>
            <p>{error.message}</p>
            <Button
              className="mt-4"
              color="danger"
              variant="light"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Your Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          color="primary"
          variant="light"
          onPress={() => router.push("/")}
        >
          Continue Shopping
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="w-full border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <CardBody className="text-center py-12">
            <div className="text-gray-400 mb-4 text-5xl">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven&apost placed any orders yet.
            </p>
            <Button color="primary" onPress={() => router.push("/")}>
              Start Shopping
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order: TOrder) => (
            <Card
              key={order._id}
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      Order #{order._id.slice(0, 8).toUpperCase()}
                    </h2>
                    <Chip
                      classNames={{
                        base: getStatusStyles(order.status),
                        dot:
                          order.status === "PENDING"
                            ? "bg-yellow-500"
                            : order.status === "PROCESSING"
                              ? "bg-blue-500"
                              : order.status === "SHIPPED"
                                ? "bg-purple-500"
                                : order.status === "DELIVERED"
                                  ? "bg-green-500"
                                  : "bg-red-500",
                      }}
                      variant="dot"
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placed on{" "}
                    {format(
                      new Date(order.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total: ৳{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <Badge
                        className="border-2 border-white"
                        color="primary"
                        content={item.quantity}
                        shape="circle"
                      >
                        <Image
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          classNames={{
                            wrapper: "bg-gray-100",
                          }}
                          height={96}
                          src={item.image || "/placeholder.jpg"}
                          width={96}
                        />
                      </Badge>
                      <div className="ml-6 flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-50">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          ৳{item.price.toFixed(2)} each
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() =>
                              router.push(`/product/${item.productId}`)
                            }
                          >
                            View Product
                          </Button>
                          {order.status === "DELIVERED" && (
                            <Button color="success" size="sm" variant="flat">
                              Buy Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>

              <Divider />

              <CardFooter className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
                <div className="w-full md:w-auto">
                  <h4 className="font-medium mb-2">Tracking History</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {order.trackingHistory.map((history, index) => (
                      <Tooltip
                        key={index}
                        content={
                          <div className="px-1 py-2">
                            <div className="text-small font-bold">
                              {history.status}
                            </div>
                            <div className="text-tiny">
                              {format(
                                new Date(history.updatedAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </div>
                            {history.note && (
                              <div className="text-tiny mt-1 max-w-xs">
                                {history.note}
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              history.status === "PENDING"
                                ? "bg-yellow-500"
                                : history.status === "PROCESSING"
                                  ? "bg-blue-500"
                                  : history.status === "SHIPPED"
                                    ? "bg-purple-500"
                                    : history.status === "DELIVERED"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {history.status}
                          </span>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <Button
                    className="w-full md:w-auto"
                    color="primary"
                    variant="solid"
                    onPress={() => router.push(`/orders/${order._id}`)}
                  >
                    Order Details
                  </Button>
                  {order.status === ORDER_STATUS.PENDING && (
                    <Button
                      className="w-full md:w-auto"
                      color="danger"
                      isDisabled={isPending}
                      isLoading={isPending}
                      variant="flat"
                      onPress={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.DELIVERED && (
                    <Button
                      className="w-full md:w-auto"
                      color="success"
                      variant="flat"
                    >
                      Leave Review
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
