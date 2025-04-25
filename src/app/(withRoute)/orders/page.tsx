"use client";
import { useUserOrders, useCancelOrder } from "@/src/hooks/useOrder";
import { TOrder, ORDER_STATUS } from "@/src/types";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { Divider } from "@nextui-org/divider";
import { useRouter } from "next/navigation";
import { Badge } from "@nextui-org/badge";
import { Tooltip } from "@nextui-org/tooltip";
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
        return `${baseStyles} bg-yellow-50 text-yellow-800 border border-yellow-200`;
      case "PROCESSING":
        return `${baseStyles} bg-blue-50 text-blue-800 border border-blue-200`;
      case "SHIPPED":
        return `${baseStyles} bg-purple-50 text-purple-800 border border-purple-200`;
      case "DELIVERED":
        return `${baseStyles} bg-green-50 text-green-800 border border-green-200`;
      case "CANCELLED":
        return `${baseStyles} bg-red-50 text-red-800 border border-red-200`;
      default:
        return `${baseStyles} bg-gray-50 text-gray-800 border border-gray-200`;
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
          label="Loading your orders..."
          color="primary"
          labelColor="foreground"
          size="lg"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full bg-red-50 border border-red-200">
          <CardBody className="text-red-600 text-center p-6">
            <p className="text-lg font-semibold mb-2">Error loading orders</p>
            <p>{error.message}</p>
            <Button
              color="danger"
              variant="light"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-500 mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </div>
        <Button
          color="primary"
          variant="light"
          className="mt-4 md:mt-0"
          onPress={() => router.push("/")}
        >
          Continue Shopping
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="w-full border border-dashed border-gray-200 bg-gray-50">
          <CardBody className="text-center py-12">
            <div className="text-gray-400 mb-4 text-5xl">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-4">
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
              className="shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(0, 8).toUpperCase()}
                    </h2>
                    <Chip
                      variant="dot"
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
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {format(
                      new Date(order.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Total: ৳{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="p-0">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex p-6 hover:bg-gray-50 transition-colors"
                    >
                      <Badge
                        content={item.quantity}
                        color="primary"
                        shape="circle"
                        className="border-2 border-white"
                      >
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg"
                          classNames={{
                            wrapper: "bg-gray-100",
                          }}
                        />
                      </Badge>
                      <div className="ml-6 flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
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
                            <Button size="sm" variant="flat" color="success">
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
                          <span className="text-sm text-gray-600">
                            {history.status}
                          </span>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={() => router.push(`/orders/${order._id}`)}
                    className="w-full md:w-auto"
                  >
                    Order Details
                  </Button>
                  {order.status === ORDER_STATUS.PENDING && (
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => cancelOrder(order._id)}
                      isDisabled={isPending}
                      isLoading={isPending}
                      className="w-full md:w-auto"
                    >
                      Cancel Order
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.DELIVERED && (
                    <Button
                      color="success"
                      variant="flat"
                      className="w-full md:w-auto"
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
