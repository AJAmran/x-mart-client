"use client";

import { Tag } from "lucide-react";
import { Button } from "@heroui/button";

type Props = {
  category: string;
  onClear: () => void;
};

export default function DealsEmptyState({ category, onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="mb-5 grid size-16 place-items-center rounded-xl bg-brand-subtle text-brand">
        <Tag aria-hidden className="size-7" strokeWidth={1.75} />
      </span>
      <h2 className="text-display-sm font-bold text-content">
        No deals found
      </h2>
      <p className="mt-2 max-w-prose text-body-sm text-content-muted">
        {category
          ? "No discounted products in this category right now."
          : "There are no active deals at the moment. Check back soon."}
      </p>
      {category && (
        <Button
          className="mt-6"
          color="primary"
          radius="md"
          variant="flat"
          onClick={onClear}
        >
          View all deals
        </Button>
      )}
    </div>
  );
}