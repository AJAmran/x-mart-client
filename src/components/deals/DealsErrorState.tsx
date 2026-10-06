"use client";

import { CloudOff } from "lucide-react";

type Props = {
  onRetry?: () => void;
};

export default function DealsErrorState({ onRetry }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      role="alert"
    >
      <span className="mb-5 grid size-16 place-items-center rounded-xl bg-danger/10 text-danger">
        <CloudOff aria-hidden className="size-7" strokeWidth={1.75} />
      </span>
      <h2 className="text-display-sm font-bold text-content">
        We could not load the deals
      </h2>
      <p className="mt-2 max-w-prose text-body-sm text-content-muted">
        Something went wrong on our end. This is usually temporary.
      </p>
      <button
        className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-body-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
        type="button"
        onClick={onRetry ?? (() => window.location.reload())}
      >
        Try again
      </button>
    </div>
  );
}