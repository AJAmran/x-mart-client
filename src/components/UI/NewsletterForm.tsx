"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

type Status = "idle" | "done";
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  if (status === "done") {
    return (
      <p
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-brand/30 bg-brand-subtle px-3 text-body-sm font-medium text-brand"
        role="status"
      >
        <Check aria-hidden size={15} />
        You&apos;re on the list. See you Sunday.
      </p>
    );
  }

  return (
    <form
      className="flex max-w-sm flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("done");
      }}
    >
      <label className="text-label-sm font-medium text-content" htmlFor="newsletter-email">
        Get the weekly deal drop
      </label>
      <div className="flex gap-2">
        <input
          required
          autoComplete="email"
          className="h-10 min-w-0 flex-1 rounded-sm border border-line-hairline bg-surface-sunken px-3 text-body-sm text-content placeholder:text-content-subtle transition-colors duration-fast focus:border-brand focus:outline-none"
          id="newsletter-email"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
        <button
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm bg-brand px-4 text-body-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
          type="submit"
        >
          <span>Join</span>
          <Send aria-hidden size={14} />
        </button>
      </div>
    </form>
  );
}

export default NewsletterForm;