"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody } from "@nextui-org/card";
import { Badge } from "@nextui-org/badge";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useOrderById } from "@/src/hooks/useOrder";
import { TOrder, ORDER_STATUS } from "@/src/types";

type StatusKey = keyof typeof ORDER_STATUS;

const statusConfig: Record<
  StatusKey,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeColor: "primary" | "secondary" | "warning" | "success" | "danger";
  }
> = {
  PENDING: { label: "Pending", color: "bg-yellow-500", icon: Clock, badgeColor: "warning" },
  PROCESSING: { label: "Processing", color: "bg-blue-500", icon: Package, badgeColor: "primary" },
  SHIPPED: { label: "Shipped", color: "bg-purple-500", icon: Truck, badgeColor: "secondary" },
  DELIVERED: { label: "Delivered", color: "bg-green-500", icon: CheckCircle, badgeColor: "success" },
  CANCELLED: { label: "Cancelled", color: "bg-red-500", icon: AlertCircle, badgeColor: "danger" },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading: isFetching, error: queryError } = useOrderById(submittedId);
  const orderData: TOrder | null = data?.data ?? null;

  useEffect(() => {
    if (submittedId) {
      if (queryError) {
        setError("Order not found. Please check your tracking ID and try again.");
      } else if (orderData) {
        setError("");
      }
    }
  }, [queryError, orderData, submittedId]);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter a tracking number");
      return;
    }
    setError("");
    setSubmittedId(trackingId);
  };

  const getStatusIcon = (status: StatusKey) => {
    const IconComponent = statusConfig[status]?.icon || Package;
    return <IconComponent className="w-5 h-5" />;
  };

  const currentStatusIndex = orderData ? orderData.trackingHistory.length - 1 : -1;
  const isLoading = isFetching && !!submittedId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter your order ID or tracking number to get real-time updates on your package delivery status
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl mx-auto">
            <CardBody className="p-6 sm:p-8">
              <form onSubmit={handleTrackOrder}>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <Input
                      classNames={{
                        base: "w-full",
                        label: "text-gray-700 dark:text-gray-300 font-semibold mb-2",
                        inputWrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary/60 transition-colors h-14",
                        input: "text-gray-800 dark:text-gray-100 text-base",
                        description: "text-gray-500 dark:text-gray-400 text-sm mt-1",
                      }}
                      description="You can find this in your order confirmation email"
                      label="Order ID or Tracking Number"
                      placeholder="e.g., ORD-123456 or 1Z999AA10123456784"
                      radius="lg"
                      size="lg"
                      startContent={<Search className="w-5 h-5 text-gray-400" />}
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0 lg:w-auto w-full">
                    <Button
                      className="w-full lg:w-[160px] h-14 font-semibold text-base transition-all duration-300 hover:scale-[1.02]"
                      color="primary"
                      isLoading={isLoading}
                      radius="lg"
                      size="lg"
                      type="submit"
                    >
                      {isLoading ? "Tracking..." : "Track Order"}
                    </Button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 flex items-center gap-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}
              </form>
            </CardBody>
          </Card>
        </motion.div>

        {/* Order Details */}
        {orderData && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            {/* Order Header */}
            <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl">
              <CardBody className="p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        color={statusConfig[orderData.status]?.badgeColor}
                        size="lg"
                        variant="flat"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(orderData.status)}
                          <span className="font-semibold">
                            {statusConfig[orderData.status]?.label}
                          </span>
                        </div>
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Order #: {orderData._id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Placed on{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(orderData.createdAt)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ৳{orderData.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Amount
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Tracking Timeline */}
              <div className="xl:col-span-2">
                <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl h-full">
                  <CardBody className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <Truck className="w-6 h-6" />
                      Delivery Progress
                    </h2>

                    <div className="relative">
                      {orderData.trackingHistory.map((step, index) => {
                        const isActive = index === currentStatusIndex;
                        const isCompleted = true;

                        return (
                          <motion.div
                            key={index}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-6 mb-8 last:mb-0"
                            initial={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {/* Timeline Line & Dot */}
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  isCompleted
                                    ? statusConfig[step.status]?.color +
                                      " border-white dark:border-gray-800"
                                    : isActive
                                    ? "bg-white border-2 " +
                                      statusConfig[step.status]?.color
                                    : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600"
                                }`}
                              />
                              {index < orderData.trackingHistory.length - 1 && (
                                <div
                                  className={`flex-1 w-0.5 ${
                                    isCompleted
                                      ? statusConfig[step.status]?.color
                                      : "bg-gray-300 dark:bg-gray-600"
                                  }`}
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-8 last:pb-0">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(step.status)}
                                <h3
                                  className={`font-semibold ${
                                    isActive
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {statusConfig[step.status]?.label || step.status}
                                </h3>
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {isActive && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              {step.note && (
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                  {step.note}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {formatDate(step.updatedAt)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Order & Shipping Details */}
              <div className="space-y-6">
                {/* Order Summary */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      {orderData.items.map((item, index) => (
                        <div
                          key={item.productId || index}
                          className="flex justify-between items-center py-2"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            ৳{item.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <div className="border-t dark:border-gray-700 pt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total</span>
                          <span className="text-green-600">
                            ৳{orderData.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Payment Method */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Payment
                    </h3>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">
                      {orderData.paymentMethod.replace(/_/g, " ")}
                    </p>
                  </CardBody>
                </Card>

                {/* Delivery Address */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {orderData.shippingInfo.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.shippingInfo.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.shippingInfo.phone}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.shippingInfo.addressLine1}
                        {orderData.shippingInfo.addressLine2 && `, ${orderData.shippingInfo.addressLine2}`}
                        <br />
                        {orderData.shippingInfo.city}, {orderData.shippingInfo.division}
                        <br />
                        {orderData.shippingInfo.postalCode}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>

            {/* Support Section */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <CardBody className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Need Help With Your Order?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                  Our customer support team is available 24/7 to assist you
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="px-8" color="primary" size="lg">
                    Contact Support
                  </Button>
                  <Button className="px-8" size="lg" variant="flat">
                    View Order Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Empty State */}
        {!orderData && !isLoading && !error && !submittedId && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Package className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Package
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-12 text-lg">
              Enter your order ID or tracking number above to see the current
              status, estimated delivery date, and real-time shipping updates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
                <Search className="w-12 h-12 text-blue-500 mx-auto mb-4 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                  Find Your Order
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your order ID from confirmation email
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
                <Truck className="w-12 h-12 text-green-500 mx-auto mb-4 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                  Real-time Tracking
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Get live updates on your package location
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                  Delivery Confirmation
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Know exactly when your order arrives
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
