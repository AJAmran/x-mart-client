"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { usePaymentStatus } from "@/src/hooks/usePayment";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get("tranId");
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  const { data: paymentData, isLoading } = usePaymentStatus(orderId);
  const paymentStatus = paymentData?.data?.status;
  const isVerified = paymentStatus === "SUCCESS";

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
        <p className="text-gray-500">Verifying payment...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-12 w-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {isVerified ? "Payment Successful!" : "Verifying Payment..."}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {isVerified
            ? "Thank you for your purchase. Your order has been placed successfully."
            : "Please wait while we confirm your payment with the gateway."}
        </p>
        {tranId && (
          <p className="mb-6 text-sm text-gray-500">
            Transaction ID: <span className="font-mono font-medium">{tranId}</span>
          </p>
        )}
        {isVerified && (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Redirecting to orders page in {countdown} seconds...
            </p>
            <div className="flex justify-center gap-4">
              <Button as={Link} href="/orders" color="primary" size="lg">
                View My Orders
              </Button>
              <Button as={Link} href="/shop" variant="flat" size="lg">
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
