"use client";

import { Tag } from "lucide-react";
import { MyButton } from "@/src/components/UI/MyButton";

export default function DealsErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Tag className="mb-4 h-16 w-16 text-red-400" />
      <h2 className="text-xl font-semibold">Failed to Load Deals</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Something went wrong. Please try again later.
      </p>
      <MyButton
        className="mt-6"
        color="primary"
        variant="flat"
        onClick={() => window.location.reload()}
      >
        Retry
      </MyButton>
    </div>
  );
}
