"use client";
import { useOrderById } from "@/src/hooks/useOrder";
import { TOrder, ORDER_STATUS } from "@/src/types";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { use } from "react";
import { Container } from "@/src/components/UI/Container";

const OrderDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data, isLoading, error } = useOrderById(id);
  const router = useRouter();
  const order = data?.data as TOrder | undefined;

  const getStatusColor = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case "PENDING": return "warning";
      case "PROCESSING": return "primary";
      case "SHIPPED": return "secondary";
      case "DELIVERED": return "success";
      case "CANCELLED": return "danger";
      default: return "default";
    }
  };

  const getStatusIcon = (status: keyof typeof ORDER_STATUS) => {
    switch (status) {
      case "PENDING": return <Clock size={16} />;
      case "PROCESSING": return <Package size={16} />;
      case "SHIPPED": return <Truck size={16} />;
      case "DELIVERED": return <CheckCircle size={16} />;
      case "CANCELLED": return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner 
        color="primary" 
        label="Loading order details..." 
        labelColor="foreground"
        size="lg"
      />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30">
        <CardBody className="text-red-600 dark:text-red-400 text-center p-6">
          <p className="text-lg font-semibold mb-2">Error loading order</p>
          <p>{error.message}</p>
          <Button 
            className="mt-4" 
            color="danger" 
            variant="light"
            onPress={() => router.push('/orders')}
          >
            Back to Orders
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  if (!order) return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <CardBody className="text-gray-600 dark:text-gray-400 text-center p-6">
          <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">Order not found</p>
          <p>The requested order could not be located.</p>
          <Button 
            className="mt-4" 
            color="primary" 
            variant="light"
            onPress={() => router.push('/orders')}
          >
            View Your Orders
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button
          className="mb-4"
          startContent={<ArrowLeft size={18} />}
          variant="light"
          onPress={() => router.push("/orders")}
        >
          Back to Orders
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">Order Details</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              #{order._id.slice(0, 8).toUpperCase()} • Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Chip 
              classNames={{
                base: "px-4 py-2",
                content: "flex items-center gap-2"
              }} 
              color={getStatusColor(order.status)}
              startContent={getStatusIcon(order.status)}
              variant="dot"
            >
              {order.status}
            </Chip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Items Ordered</h2>
            </CardHeader>
            <CardBody className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {order.items.map((item) => (
                <div key={item.productId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex gap-4">
                    <Badge 
                      className="border-2 border-white" 
                      color="primary"
                      content={item.quantity}
                      shape="circle"
                    >
                      <Image
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                        height={96}
                        src={item.image || "/placeholder.jpg"}
                        width={96}
                      />
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-50">{item.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">৳{item.price.toFixed(2)} each</p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => router.push(`/products/${item.productId}`)}
                        >
                          View Product
                        </Button>
                        {order.status === "DELIVERED" && (
                          <Button
                            color="success"
                            size="sm"
                            variant="flat"
                          >
                            Buy Again
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
            <CardFooter className="flex justify-between items-center border-t border-gray-200 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">৳{order.totalPrice.toFixed(2)}</span>
              </div>
            </CardFooter>
          </Card>

          {/* Tracking History */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Order Timeline</h2>
            </CardHeader>
            <CardBody>
              <div className="relative">
                <div className="absolute left-4 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />
                <ul className="space-y-6">
                  {order.trackingHistory.map((history, index) => (
                    <li key={index} className="relative pl-10">
                      <div className={`absolute left-4 w-3 h-3 rounded-full -translate-x-1/2 ${
                        history.status === "PENDING" ? "bg-yellow-500" : 
                        history.status === "PROCESSING" ? "bg-blue-500" :
                        history.status === "SHIPPED" ? "bg-purple-500" :
                        history.status === "DELIVERED" ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-50">{history.status}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {format(new Date(history.updatedAt), "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        {history.note && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{history.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Shipping Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                  <p className="text-gray-900 dark:text-gray-50">{order.shippingInfo.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                  <p className="text-gray-900 dark:text-gray-50">{order.shippingInfo.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                  <p className="text-gray-900 dark:text-gray-50">{order.shippingInfo.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
                  <p className="text-gray-900 dark:text-gray-50">
                    {order.shippingInfo.addressLine1}
                    {order.shippingInfo.addressLine2 && (
                      <>, {order.shippingInfo.addressLine2}</>
                    )}
                    <br />
                    {order.shippingInfo.city}, {order.shippingInfo.division}
                    <br />
                    {order.shippingInfo.postalCode}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payment Information */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Payment</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Method</h4>
                  <p className="text-gray-900 dark:text-gray-50 capitalize">{order.paymentMethod}</p>
                </div>
                <Divider />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-gray-50">৳{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-gray-50">৳0.00</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-50">
                    <span>Total</span>
                    <span>৳{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Order Actions */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Order Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="flat"
                  onPress={() => window.print()}
                >
                  Print Receipt
                </Button>
                {order.status === "DELIVERED" && (
                  <Button
                    fullWidth
                    color="success"
                    variant="flat"
                  >
                    Leave Review
                  </Button>
                )}
                {order.status === "PENDING" && (
                  <Button
                    fullWidth
                    color="danger"
                    variant="flat"
                  >
                    Cancel Order
                  </Button>
                )}
                <Button
                  fullWidth
                  variant="light"
                  onPress={() => router.push('/')}
                >
                  Continue Shopping
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetailsPage;

