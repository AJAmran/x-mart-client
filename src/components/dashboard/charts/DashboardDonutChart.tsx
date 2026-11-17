"use client";

import React, { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { statusPalette, statusPaletteFallback } from "@/src/config/theme";
import { formatNumber } from "@/src/lib/productUtils";

interface BreakdownItem {
  status: string;
  value: number;
}

interface DashboardDonutChartProps {
  breakdown: BreakdownItem[];
  total: number;
}

export const DashboardDonutChart = memo(function DashboardDonutChart({
  breakdown,
  total,
}: DashboardDonutChartProps) {
  return (
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
  );
});

export default DashboardDonutChart;
