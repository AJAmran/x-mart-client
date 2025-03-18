"use client";

import { useCart } from "@/src/hooks/useCart";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "../../context/user.provider";

const CheckoutPage = () => {
  const { cart, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useUser(); // Get user info
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: user?.mobileNumber || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update shipping info when user data changes
  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.mobileNumber || "",
      }));
    }
  }, [user]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.name) newErrors.name = "Name is required.";
    if (!shippingInfo.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!shippingInfo.address) newErrors.address = "Address is required.";
    if (!shippingInfo.city) newErrors.city = "City is required.";
    if (!shippingInfo.state) newErrors.state = "State is required.";
    if (!shippingInfo.zip) newErrors.zip = "ZIP code is required.";
    if (!shippingInfo.country) newErrors.country = "Country is required.";
    if (!shippingInfo.phone) newErrors.phone = "Phone number is required.";
    else if (!/^\d{11}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Phone number must be 11 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    // Simulate order placement
    toast.success("Order placed successfully! You will pay on delivery.");
    clearCart();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">Order Summary</h2>
          </CardHeader>
          <CardBody>
            {cart.items.length > 0 ? (
              <>
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ৳{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onPress={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        isDisabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        size="sm"
                        onPress={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => removeItem(item.productId)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                  <h4 className="font-bold">Total</h4>
                  <p className="text-lg font-bold">
                    ৳{cart.totalPrice.toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </CardBody>
        </Card>

        {/* Shipping Information */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={shippingInfo.name}
                onChange={handleShippingChange}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                required
              />
              <Input
                label="Email"
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                required
              />
              <Input
                label="Address"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                isInvalid={!!errors.address}
                errorMessage={errors.address}
                required
              />
              <Input
                label="City"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                isInvalid={!!errors.city}
                errorMessage={errors.city}
                required
              />
              <Input
                label="State"
                name="state"
                value={shippingInfo.state}
                onChange={handleShippingChange}
                isInvalid={!!errors.state}
                errorMessage={errors.state}
                required
              />
              <Input
                label="ZIP Code"
                name="zip"
                value={shippingInfo.zip}
                onChange={handleShippingChange}
                isInvalid={!!errors.zip}
                errorMessage={errors.zip}
                required
              />
              <Input
                label="Country"
                name="country"
                value={shippingInfo.country}
                onChange={handleShippingChange}
                isInvalid={!!errors.country}
                errorMessage={errors.country}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
                required
              />
            </CardBody>
          </Card>

          {/* Place Order Button */}
          <Button
            color="success"
            size="lg"
            className="w-full"
            onPress={handlePlaceOrder}
            isDisabled={cart.items.length === 0}
          >
            Place Order (Cash on Delivery)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
