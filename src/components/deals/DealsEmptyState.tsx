"use client";

import { Tag } from "lucide-react";
import { MyButton } from "@/src/components/UI/MyButton";

type Props = {
  category: string;
  onClear: () => void;
};

export default function DealsEmptyState({ category, onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Tag className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 className="text-xl font-semibold">No Deals Found</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {category
          ? "No discounted products in this category right now."
          : "There are no active deals at the moment. Check back soon!"}
      </p>
      {category && (
        <MyButton
          className="mt-6"
          color="primary"
          variant="flat"
          onClick={onClear}
        >
          View All Deals
        </MyButton>
      )}
    </div>
  );
}
