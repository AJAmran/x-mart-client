"use client";

import { useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { TrendingUp } from "lucide-react";

import { Panel } from "./Panel";
import { StatusBadge, orderStatusTone } from "./StatusBadge";
import { formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";

// Dynamic import for Recharts Donut Chart to minimize initial JS bundle
const DashboardDonutChart = dynamic(
  () => import("./charts/DashboardDonutChart"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-44 w-full animate-pulse items-center justify-center rounded-lg bg-surface-sunken/40">
        <div className="size-28 rounded-full border-8 border-line-hairline/60" />
      </div>
    ),
  }
);

/**
 * Donut + legend of every order grouped by pipeline stage.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent states change.
 */
export const StatusBreakdown = memo(function StatusBreakdown({
  orders,
  total,
  loading,
}: {
  orders: TOrder[];
  total: number;
  loading: boolean;
}) {
  /** Ordered by pipeline stage so the legend reads left → right. */
  const breakdown = useMemo(() => {
    const order: string[] = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
    ];

    const counts = new Map<string, number>();

    for (const o of orders) {
      const s = o.status ?? ORDER_STATUS.PENDING;

      counts.set(s, (counts.get(s) ?? 0) + 1);
    }

    return order
      .filter((s) => (counts.get(s) ?? 0) > 0)
      .map((s) => ({ status: s, value: counts.get(s) ?? 0 }));
  }, [orders]);

  return (
    <Panel
      className="xl:col-span-1"
      description="Every order, by pipeline stage"
      empty={breakdown.length === 0}
      emptyDescription="Statuses appear as soon as the first order is placed."
      emptyIcon={TrendingUp}
      loading={loading}
      title="Order status"
    >
      <DashboardDonutChart breakdown={breakdown} total={total} />

      <ul className="mt-5 space-y-2.5">
        {breakdown.map((entry) => (
          <li key={entry.status} className="flex items-center justify-between gap-3">
            <StatusBadge dot tone={orderStatusTone(entry.status)}>
              {entry.status}
            </StatusBadge>
            <span className="tabular text-body-sm font-semibold text-content">
              {formatNumber(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
});

export default StatusBreakdown;
