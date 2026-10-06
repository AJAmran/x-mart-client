"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CreditCard,
  MapPin,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "../../../context/user.provider";
import OrderSummary from "@/src/components/Order/OrderSummary";
import ShippingInformation from "@/src/components/Order/ShippingInformation";
import { useBranches } from "@/src/hooks/useBranch";
import { useCart } from "@/src/hooks/useCart";
import { useCreateOrder } from "@/src/hooks/useOrder";
import { useInitPayment } from "@/src/hooks/usePayment";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { isValidBdPhone, normaliseBdPhone } from "@/src/lib/phone";
import { Container } from "@/src/components/UI/Container";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, clearCart, updateQuantity, removeItem } = useCart();
  const { user } = useUser();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutate: initPayment, isPending: isPaying } = useInitPayment();
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "ONLINE"
  >("CASH_ON_DELIVERY");
  const [pageError, setPageError] = useState("");
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
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const { data: branchesData, isLoading: branchesLoading } = useBranches(
    { status: "active" },
    { limit: 100 },
  );
  const branches = branchesData?.data || [];

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
    setPageError("");
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
    else if (!isValidBdPhone(shippingInfo.phone)) {
      newErrors.phone = "Invalid Bangladeshi phone number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    setPageError("");

    if (!user) {
      const message = "Please login before placing an order.";

      setPageError(message);
      toast.error(message);
      router.push("/auth/login");

      return;
    }

    if (cart.items.length === 0) {
      const message =
        "Your cart is empty. Add at least one item before checkout.";

      setPageError(message);
      toast.error(message);

      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the highlighted shipping fields.");

      return;
    }

    const orderData = {
      items: cart.items,
      shippingInfo: {
        ...shippingInfo,
        // The API only accepts `01XXXXXXXXX`, but this field is pre-filled with
        // the account's stored `+8801…` number. Send the canonical form so a
        // valid-looking number is never rejected at the last step.
        phone: normaliseBdPhone(shippingInfo.phone) ?? shippingInfo.phone,
      },
      branchId: selectedBranchId || undefined,
      paymentMethod,
    };

    if (paymentMethod === "ONLINE") {
      createOrder(orderData, {
        onSuccess: (data) => {
          const orderId = data?.data?._id;

          if (!orderId) {
            const message =
              "Order was created, but the payment session could not find the order ID.";

            setPageError(message);
            toast.error(message);

            return;
          }

          initPayment(orderId, {
            onSuccess: (res) => {
              if (res?.data?.GatewayPageURL) {
                window.location.href = res.data.GatewayPageURL;
              } else {
                const message =
                  "Payment gateway did not return a checkout URL. Please try again.";

                setPageError(message);
                toast.error(message);
              }
            },
            onError: (error) => {
              setPageError(
                getErrorMessage(
                  error,
                  "Could not start online payment. Please try again.",
                ),
              );
            },
          });
        },
        onError: (error) => {
          setPageError(
            getErrorMessage(
              error,
              "Could not place your order. Please review your cart and shipping details.",
            ),
          );
        },
      });
    } else {
      createOrder(orderData, {
        onSuccess: (data) => {
          clearCart();
          const orderId = data?.data?._id;

          router.push(orderId ? `/orders/${orderId}` : "/orders");
        },
        onError: (error) => {
          setPageError(
            getErrorMessage(
              error,
              "Could not place your order. Please review your cart and shipping details.",
            ),
          );
        },
      });
    }
  };

  const isPending = isCreating || isPaying;

  return (
    <Container className="py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Secure checkout
          </p>
          <h1 className="text-3xl font-bold text-gray-950 dark:text-gray-50">
            Review and place your order
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
            Confirm your delivery details, choose a payment method, and we will
            reserve available stock when the order is placed.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success">
          <ShieldCheck size={18} />
          SSL protected
        </div>
      </div>

      {pageError && (
        <Card className="mb-6 border border-danger-200 bg-danger-50 shadow-none dark:border-danger-900/60 dark:bg-danger-950/20">
          <CardBody className="flex flex-row items-start gap-3 text-danger">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm font-medium">{pageError}</p>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <ShippingInformation
            errors={errors}
            handleShippingChange={handleShippingChange}
            shippingInfo={shippingInfo}
          />

          <Card className="shadow-sm">
            <CardBody className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="text-primary" size={22} />
                <div>
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                  <p className="text-sm text-gray-500">
                    Choose how you want to complete this order.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className={`flex min-h-24 items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-success bg-success/10"
                      : "border-default-200 hover:border-default-400"
                  }`}
                  type="button"
                  onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                >
                  <Truck className="shrink-0 text-success" size={26} />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </button>
                <button
                  className={`flex min-h-24 items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-primary bg-primary/10"
                      : "border-default-200 hover:border-default-400"
                  }`}
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <CreditCard className="shrink-0 text-primary" size={26} />
                  <div>
                    <p className="font-semibold">Online Payment</p>
                    <p className="text-xs text-gray-500">
                      Pay securely via SSLCommerz
                    </p>
                  </div>
                </button>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm">
            <CardBody className="space-y-3">
<div className="flex items-center gap-3">
                  <Store className="text-primary" size={22} />
                  <div>
                    <h2 className="text-lg font-semibold">Fulfillment Branch</h2>
                    <p className="text-sm text-content-subtle">
                      Pick a preferred branch or let us assign the best match.
                    </p>
                  </div>
                </div>
                <Select
                  classNames={{
                    trigger:
                      "border border-line-hairline bg-surface-sunken text-content",
                    label: "text-label-sm font-medium text-content",
                    popoverContent:
                      "bg-surface-raised border border-line-hairline",
                  }}
                  isDisabled={branchesLoading}
                  label="Fulfillment branch"
                  labelPlacement="outside-left"
                  placeholder={
                    branchesLoading ? "Loading branches..." : "Choose a branch"
                  }
                  radius="md"
                  selectedKeys={selectedBranchId ? [selectedBranchId] : []}
                  startContent={<MapPin size={18} />}
                  onSelectionChange={(keys) => {
                    // HeroUI reports "all" when nothing is selected on a
                    // multi-select; this is single-select so it only ever
                    // yields real ids (or an empty set).
                    const next = Array.from(keys).filter(
                      (key): key is string =>
                        typeof key === "string" && key !== "all"
                    );

                    setSelectedBranchId(next[0] ?? "");
                  }}
                >
                  {/* HeroUI's Select is a Listbox: the React `key` IS the selection
                      identity (`ItemProps` has no `value` prop), so `selectedKeys`
                      is matched against these keys. */}
                  {branches.map((branch) => (
                    <SelectItem key={branch._id}>{branch.name}</SelectItem>
                  ))}
                </Select>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            cart={cart}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
          />
          <Button
            className="w-full font-semibold"
            color={paymentMethod === "ONLINE" ? "primary" : "success"}
            isDisabled={cart.items.length === 0 || isPending}
            isLoading={isPending}
            size="lg"
            onPress={handlePlaceOrder}
          >
            {paymentMethod === "ONLINE" ? "Proceed to Payment" : "Place Order"}
          </Button>
          <p className="text-center text-xs text-gray-500">
            By placing your order, you confirm your cart, delivery address, and
            payment choice.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutPage;

