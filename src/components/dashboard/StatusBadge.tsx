import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Themed status pills for the admin console.
 *
 * Replaces ad-hoc HeroUI Chip colour swaps with one consistent, token-safe
 * pill so order / product / stock states read identically everywhere.
 */

export type BadgeTone =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "active"
  | "inactive"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  pending: "bg-warning/15 text-warning",
  processing: "bg-primary/15 text-primary",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-danger/15 text-danger",
  active: "bg-success/15 text-success",
  inactive: "bg-danger/15 text-danger",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  neutral: "bg-surface-sunken text-content-muted",
};

type StatusBadgeProps = {
  tone: BadgeTone;
  /** Render a leading status dot. */
  dot?: boolean;
  /** Optional leading icon. */
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({
  tone,
  dot,
  icon,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        toneClasses[tone],
        className
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {icon}
      {children}
    </span>
  );
}

/* ── Domain helpers ───────────────────────────────────────────────────────── */

/** Map an ORDER_STATUS value to a badge tone. */
export function orderStatusTone(status?: string): BadgeTone {
  switch (status) {
    case "PENDING":
      return "pending";
    case "PROCESSING":
      return "processing";
    case "SHIPPED":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "CANCELLED":
      return "cancelled";
    default:
      return "neutral";
  }
}

/** Map a product status to a badge tone (case-insensitive). */
export function productStatusTone(status?: string): BadgeTone {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
    case "IN_STOCK":
      return "active";
    case "INACTIVE":
      return "neutral";
    case "OUT_OF_STOCK":
      return "danger";
    case "COMING_SOON":
    case "PENDING":
      return "pending";
    default:
      return "neutral";
  }
}

/** Map a stock level to a badge tone. */
export function stockTone(stock: number, threshold = 10): BadgeTone {
  if (stock <= 0) return "danger";
  if (stock < threshold) return "warning";

  return "success";
}

/** Map a user status to a badge tone. */
export function userStatusTone(status?: string): BadgeTone {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "PENDING":
      return "pending";
    case "BLOCKED":
    case "INACTIVE":
      return "cancelled";
    default:
      return "neutral";
  }
}
