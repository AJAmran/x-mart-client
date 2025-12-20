// app/tracking/page.tsx
"use client";

import { useState } from "react";
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

// Mock data - replace with actual API calls
const mockTrackingData = {
  "ORD-123456": {
    orderId: "ORD-123456",
    status: "delivered",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
    },
    items: [
      {
        name: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 99.99,
        image: "/images/headphones.jpg",
      },
      {
        name: "Premium Phone Case",
        quantity: 2,
        price: 15.99,
        image: "/images/phone-case.jpg",
      },
    ],
    total: 131.97,
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    timeline: [
      {
        status: "ordered",
        description: "Order placed successfully",
        date: "2024-01-15T10:30:00Z",
        completed: true,
      },
      {
        status: "confirmed",
        description: "Order confirmed and payment processed",
        date: "2024-01-15T11:15:00Z",
        completed: true,
      },
      {
        status: "processing",
        description: "Items being prepared for shipment",
        date: "2024-01-15T14:20:00Z",
        completed: true,
      },
      {
        status: "shipped",
        description: "Shipped via FedEx Ground",
        date: "2024-01-16T09:45:00Z",
        completed: true,
      },
      {
        status: "out_for_delivery",
        description: "Out for delivery in your area",
        date: "2024-01-17T08:30:00Z",
        completed: true,
      },
      {
        status: "delivered",
        description: "Delivered to recipient at front door",
        date: "2024-01-17T14:15:00Z",
        completed: true,
      },
    ],
    carrier: {
      name: "FedEx",
      trackingNumber: "789012345678",
      estimatedDelivery: "2024-01-17",
      phone: "+1-800-463-3339",
    },
  },
};

const statusConfig = {
  ordered: {
    label: "Order Placed",
    color: "bg-blue-500",
    icon: Package,
    badgeColor: "primary",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-purple-500",
    icon: CheckCircle,
    badgeColor: "secondary",
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-500",
    icon: Clock,
    badgeColor: "warning",
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-500",
    icon: Truck,
    badgeColor: "primary",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-500",
    icon: Truck,
    badgeColor: "warning",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500",
    icon: CheckCircle,
    badgeColor: "success",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    icon: AlertCircle,
    badgeColor: "danger",
  },
};

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError("Please enter a tracking number");

      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingId as keyof typeof mockTrackingData];

      if (data) {
        setOrderData(data);
      } else {
        setError("Order not found. Please check your tracking ID and try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusConfig[status as keyof typeof statusConfig]?.icon || Package;

    return <IconComponent className="w-5 h-5" />;
  };

  const getCurrentStatusIndex = () => {
    if (!orderData) return -1;

    return orderData.timeline.findIndex((step: any) => !step.completed);
  };

  const currentStatusIndex = getCurrentStatusIndex();

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

        {/* Search Form - Fixed Centering */}
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
                  {/* Input Field - Takes available space */}
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

                  {/* Submit Button - Fixed width */}
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

        {/* Rest of the component remains the same */}
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
                        color={statusConfig[orderData.status as keyof typeof statusConfig]?.badgeColor as any}
                        size="lg"
                        variant="flat"
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(orderData.status)}
                          <span className="font-semibold">
                            {statusConfig[orderData.status as keyof typeof statusConfig]?.label}
                          </span>
                        </div>
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Order #: {orderData.orderId}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Estimated delivery:{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(orderData.carrier.estimatedDelivery).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${orderData.total}
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
                      {orderData.timeline.map((step: any, index: number) => {
                        const isActive = index === currentStatusIndex;
                        const isCompleted = step.completed;

                        return (
                          <motion.div
                            key={step.status}
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
                                    ? statusConfig[step.status as keyof typeof statusConfig]?.color +
                                      " border-white dark:border-gray-800"
                                    : isActive
                                    ? "bg-white border-2 " +
                                      statusConfig[step.status as keyof typeof statusConfig]?.color
                                    : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600"
                                }`}
                              />
                              {index < orderData.timeline.length - 1 && (
                                <div
                                  className={`flex-1 w-0.5 ${
                                    isCompleted
                                      ? statusConfig[step.status as keyof typeof statusConfig]?.color
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
                                  {statusConfig[step.status as keyof typeof statusConfig]?.label || step.status}
                                </h3>
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {isActive && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-1">
                                {step.description}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-500">
                                {new Date(step.date).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
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
                      {orderData.items.map((item: any, index: number) => (
                        <div
                          key={index}
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
                            ${item.price}
                          </p>
                        </div>
                      ))}
                      <div className="border-t dark:border-gray-700 pt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span>Total</span>
                          <span className="text-green-600">
                            ${orderData.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Shipping Information */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-2xl">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Carrier
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {orderData.carrier.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Tracking Number
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white font-mono">
                          {orderData.carrier.trackingNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Customer Service
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {orderData.carrier.phone}
                        </p>
                      </div>
                    </div>
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
                        {orderData.shippingAddress.street}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.shippingAddress.city},{" "}
                        {orderData.shippingAddress.state}{" "}
                        {orderData.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.shippingAddress.country}
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
        {!orderData && !isLoading && !error && (
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
