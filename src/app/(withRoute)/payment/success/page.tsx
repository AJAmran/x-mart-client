"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import Link from "next/link";
import { usePaymentStatus } from "@/src/hooks/usePayment";
import { useCart } from "@/src/hooks/useCart";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get("tranId");
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  const { data: paymentData, isLoading } = usePaymentStatus(orderId);
  const paymentStatus = paymentData?.data?.status;
  const isVerified = paymentStatus === "SUCCESS";

  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  /**
   * Empty the cart once payment is actually confirmed.
   *
   * The order is created before the gateway redirect, so clearing on order
   * creation would wipe the cart even if the customer abandoned or failed the
   * payment. `usePaymentStatus` polls until the status is terminal, so the ref
   * guards against clearing on every tick.
   */
  useEffect(() => {
    if (isVerified && !cartCleared.current) {
      cartCleared.current = true;
      clearCart({ silent: true });
    }
  }, [isVerified, clearCart]);

  useEffect(() => {
    if (isVerified && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    }
  }, [isVerified, countdown]);

  useEffect(() => {
    if (isVerified && countdown === 0) {
      router.push("/orders");
    }
  }, [isVerified, countdown, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-body-sm text-content-subtle">
          Verifying payment…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full ${isVerified ? "bg-success/20" : "bg-warning/20"}`}>
            {isVerified ? (
              <svg className="h-12 w-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            ) : (
              <svg className="h-12 w-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            )}
          </div>
        </div>
        <h1 className="mb-2 text-display-sm font-bold text-content">
          {isVerified ? "Payment successful!" : "Verifying payment…"}
        </h1>
        <p className="mb-6 text-body-sm text-content-muted">
          {isVerified
            ? "Thank you for your purchase. Your order has been placed successfully."
            : "Please wait while we confirm your payment with the gateway."}
        </p>
        {tranId && (
          <p className="mb-6 text-label-sm text-content-subtle">
            Transaction ID:{" "}
            <span className="tabular font-medium text-content-muted">
              {tranId}
            </span>
          </p>
        )}
        {isVerified && (
          <>
            <p className="mb-4 text-label-sm text-content-subtle">
              Your cart has been emptied. Redirecting to your orders in{" "}
              {countdown} second{countdown === 1 ? "" : "s"}…
            </p>
            <div className="flex justify-center gap-3">
              <Button as={Link} color="primary" href="/orders" size="lg">
                View my orders
              </Button>
              <Button as={Link} href="/shop" size="lg" variant="flat">
                Continue shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-body-sm text-content-subtle">
          Loading payment details…
        </p>
      </div>
    }>
      <PaymentSuccess />
    </Suspense>
  );
};

export default PaymentSuccessPage;
