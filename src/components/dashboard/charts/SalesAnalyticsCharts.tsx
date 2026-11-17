"use client";

import React, { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartPalette, statusPalette, statusPaletteFallback } from "@/src/config/theme";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";

const axisTick = { fontSize: 11 } as const;

export const AnalyticsRevenueBarChart = memo(function AnalyticsRevenueBarChart({
  data,
}: {
  data: { date: string; revenue: number }[];
}) {
  return (
    <ResponsiveContainer height={260} width="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
        <CartesianGrid
          stroke="rgb(var(--line))"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis dataKey="date" tick={axisTick} tickLine={false} />
        <YAxis
          axisLine={false}
          tick={axisTick}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
          }
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload, label }: any) =>
            active && payload?.length ? (
              <div className="rounded-md border border-line-hairline bg-surface-raised px-3 py-2 shadow-lg">
                <p className="text-label-sm text-content-subtle">{label}</p>
                <p className="tabular mt-0.5 text-body-sm font-semibold text-content">
                  {formatCurrency(Number(payload[0].value ?? 0))}
                </p>
              </div>
            ) : null
          }
          cursor={{ fill: "rgb(var(--surface-sunken))" }}
        />
        <Bar
          dataKey="revenue"
          fill={chartPalette[0]}
          maxBarSize={32}
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

export const AnalyticsOrdersLineChart = memo(function AnalyticsOrdersLineChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <ResponsiveContainer height={260} width="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid
          stroke="rgb(var(--line))"
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis dataKey="date" tick={axisTick} tickLine={false} />
        <YAxis
          allowDecimals={false}
          axisLine={false}
          tick={axisTick}
          tickLine={false}
        />
        <Tooltip
          content={({ active, payload, label }: any) =>
            active && payload?.length ? (
              <div className="rounded-md border border-line-hairline bg-surface-raised px-3 py-2 shadow-lg">
                <p className="text-label-sm text-content-subtle">{label}</p>
                <p className="tabular mt-0.5 text-body-sm font-semibold text-content">
                  {formatNumber(Number(payload[0].value ?? 0))} orders
                </p>
              </div>
            ) : null
          }
          cursor={{ stroke: "rgb(var(--line))" }}
        />
        <Line
          dataKey="count"
          dot={false}
          stroke={chartPalette[1]}
          strokeWidth={2.5}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export const AnalyticsStatusPieChart = memo(function AnalyticsStatusPieChart({
  data,
  totalRevenue,
}: {
  data: { status: string; value: number }[];
  totalRevenue: number;
}) {
  return (
    <div className="relative h-56">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={data}
            dataKey="value"
            innerRadius={62}
            outerRadius={86}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
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
          <p className="tabular text-body-sm font-bold text-content">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle">
            In period
          </p>
        </div>
      </div>
    </div>
  );
});
