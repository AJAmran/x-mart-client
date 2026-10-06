"use client";

import { useMemo } from "react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Panel } from "./Panel";
import { StatusBadge, orderStatusTone } from "./StatusBadge";
import {
  statusPalette,
  statusPaletteFallback,
} from "@/src/config/theme";
import { formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";

/**
 * Donut + legend of every order grouped by pipeline stage.
 */
export function StatusBreakdown({
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
      <div className="relative h-44">
        <ResponsiveContainer height="100%" width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={breakdown}
              dataKey="value"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              stroke="none"
            >
              {breakdown.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={statusPalette[entry.status] ?? statusPaletteFallback}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="tabular text-display-sm font-bold text-content">
              {formatNumber(total)}
            </p>
            <p className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
              Orders
            </p>
          </div>
        </div>
      </div>

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
}
