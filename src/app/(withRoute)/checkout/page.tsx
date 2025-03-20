"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";

import { useUser } from "../../context/user.provider";

import { useCart } from "@/src/hooks/useCart";
import OrderSummary from "@/src/components/Order/OrderSummary";
import ShippingInformation from "@/src/components/Order/ShippingInformation";

const CheckoutPage = () => {
  const { cart, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useUser();
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    division: "",
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
    if (!shippingInfo.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required.";
    if (!shippingInfo.city) newErrors.city = "City/District is required.";
    if (!shippingInfo.postalCode)
      newErrors.postalCode = "Postal Code is required.";
    else if (!/^\d{4}$/.test(shippingInfo.postalCode)) {
      newErrors.postalCode = "Postal Code must be 4 digits.";
    }
    if (!shippingInfo.division) newErrors.division = "Division is required.";
    if (!shippingInfo.phone) newErrors.phone = "Phone number is required.";
    else if (!/^01\d{9}$/.test(shippingInfo.phone)) {
      newErrors.phone = "Phone number must be 11 digits and start with 01.";
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
        <OrderSummary
          cart={cart}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />

        {/* Shipping Information */}
        <div className="space-y-8">
          <ShippingInformation
            shippingInfo={shippingInfo}
            errors={errors}
            handleShippingChange={handleShippingChange}
          />

          {/* Place Order Button */}
          <Button
            className="w-full"
            color="success"
            size="lg"
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
