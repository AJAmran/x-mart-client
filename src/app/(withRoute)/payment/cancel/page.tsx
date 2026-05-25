"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import Link from "next/link";

const PaymentCancelPage = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warning/20">
            <svg className="h-12 w-12 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          You have cancelled the payment. Your order has not been placed.
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Redirecting to checkout in {countdown} seconds...
        </p>
        <div className="flex justify-center gap-4">
          <Button as={Link} href="/checkout" color="primary" size="lg">
              Back to Checkout
          </Button>
          <Button as={Link} href="/shop" variant="flat" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
