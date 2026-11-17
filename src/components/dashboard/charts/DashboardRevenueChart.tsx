"use client";

import React, { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartPalette } from "@/src/config/theme";
import { formatCurrency } from "@/src/lib/productUtils";

interface ChartDataPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

interface DashboardRevenueChartProps {
  data: ChartDataPoint[];
}

const axisTick = { fontSize: 11 } as const;

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);

  return (
    <div className="rounded-md border border-line-hairline bg-surface-raised px-3 py-2 shadow-lg">
      <p className="text-label-sm text-content-subtle">{label}</p>
      <p className="tabular mt-0.5 text-body-sm font-semibold text-content">
        {formatCurrency(value)}
      </p>
    </div>
  );
}

export const DashboardRevenueChart = memo(function DashboardRevenueChart({
  data,
}: DashboardRevenueChartProps) {
  return (
    <ResponsiveContainer height={250} width="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
        <CartesianGrid
          stroke="rgb(var(--line))"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          axisLine={false}
          dataKey="label"
          tick={axisTick}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tick={axisTick}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
          }
          tickLine={false}
        />
        <Tooltip
          content={<RevenueTooltip />}
          cursor={{ fill: "rgb(var(--surface-sunken))" }}
        />
        <Bar
          dataKey="revenue"
          fill={chartPalette[0]}
          maxBarSize={40}
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

export default DashboardRevenueChart;
