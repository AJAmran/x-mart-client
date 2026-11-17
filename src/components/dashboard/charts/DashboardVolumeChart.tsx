"use client";

import React, { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartPalette } from "@/src/config/theme";
import { formatNumber } from "@/src/lib/productUtils";

interface ChartDataPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

interface DashboardVolumeChartProps {
  data: ChartDataPoint[];
}

const axisTick = { fontSize: 11 } as const;

function VolumeTooltip({
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
        {formatNumber(value)} orders
      </p>
    </div>
  );
}

export const DashboardVolumeChart = memo(function DashboardVolumeChart({
  data,
}: DashboardVolumeChartProps) {
  return (
    <ResponsiveContainer height={250} width="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
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
          allowDecimals={false}
          axisLine={false}
          tick={axisTick}
          tickLine={false}
        />
        <Tooltip
          content={<VolumeTooltip />}
          cursor={{ stroke: "rgb(var(--line))" }}
        />
        <Line
          activeDot={{
            r: 4,
            strokeWidth: 2,
            stroke: "rgb(var(--surface-raised))",
          }}
          dataKey="orders"
          dot={{
            r: 3,
            strokeWidth: 2,
            stroke: "rgb(var(--surface-raised))",
          }}
          stroke={chartPalette[1]}
          strokeWidth={2.5}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default DashboardVolumeChart;
