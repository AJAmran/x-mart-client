"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import Link from "next/link";

const PaymentFailPage = () => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");
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
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-danger/20">
            <svg className="h-12 w-12 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Payment Failed
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        {tranId && (
          <p className="mb-6 text-sm text-gray-500">
            Transaction ID: <span className="font-mono font-medium">{tranId}</span>
          </p>
        )}
        <p className="mb-4 text-sm text-gray-500">
          Redirecting to checkout in {countdown} seconds...
        </p>
        <div className="flex justify-center gap-4">
          <Button as={Link} href="/checkout" color="primary" size="lg">
            Try Again
          </Button>
          <Button as={Link} href="/shop" variant="flat" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;
