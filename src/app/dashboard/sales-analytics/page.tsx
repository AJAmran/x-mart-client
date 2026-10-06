"use client";

import { useState, useMemo } from "react";
import {
  Banknote,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

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

import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import { Panel } from "@/src/components/dashboard/Panel";
import {
  MetricCard,
  metricGrid,
} from "@/src/components/dashboard/MetricCard";
import {
  StatusBadge,
  orderStatusTone,
} from "@/src/components/dashboard/StatusBadge";
import {
  IconButton,
  SegmentTabs,
} from "@/src/components/dashboard/Controls";
import {
  chartPalette,
  statusPalette,
  statusPaletteFallback,
} from "@/src/config/theme";
import { useOrders } from "@/src/hooks/useOrder";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";

type Range = "7d" | "30d" | "90d" | "all";

const RANGE_LABELS: Record<Range, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  all: "All time",
};

const rangeOptions: { value: Range; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "All" },
];

const axisTick = { fontSize: 11 } as const;

export default function SalesAnalyticsPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const {
    data: ordersRes,
    isLoading,
    refetch,
  } = useOrders({}, { limit: 1000, sortBy: "createdAt", sortOrder: "desc" });

  const orders = useMemo(() => {
    if (!ordersRes?.data) return [];
    let items = [...ordersRes.data];
    const now = new Date();

    if (dateRange === "7d") {
      const cutoff = new Date(now.getTime() - 7 * 86400000);

      items = items.filter((o: any) => new Date(o.createdAt) >= cutoff);
    } else if (dateRange === "30d") {
      const cutoff = new Date(now.getTime() - 30 * 86400000);

      items = items.filter((o: any) => new Date(o.createdAt) >= cutoff);
    } else if (dateRange === "90d") {
      const cutoff = new Date(now.getTime() - 90 * 86400000);

      items = items.filter((o: any) => new Date(o.createdAt) >= cutoff);
    }

    return items;
  }, [ordersRes, dateRange]);

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o: any) => sum + (o.totalPrice ?? 0), 0),
    [orders]
  );
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelledOrders = orders.filter(
    (o: any) => o.status === "CANCELLED"
  ).length;
  const cancellationRate =
    totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  const revenueByStatus = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const status = o.status || "UNKNOWN";

      map[status] = (map[status] || 0) + (o.totalPrice ?? 0);
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const status = o.status || "UNKNOWN";

      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const dailyRevenue = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      map[date] = (map[date] || 0) + (o.totalPrice ?? 0);
    });

    return Object.entries(map)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-14);
  }, [orders]);

  const dailyOrders = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      map[date] = (map[date] || 0) + 1;
    });

    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .slice(-14);
  }, [orders]);

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            <SegmentTabs
              className="hidden sm:inline-flex"
              label="Date range"
              options={rangeOptions}
              value={dateRange}
              onChange={setDateRange}
            />
            <IconButton label="Refresh data" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        }
        description="Sales performance, revenue, and order health over time."
        eyebrow="Sales & analytics"
        title="Analytics overview"
      />

      <Container className="py-6 sm:py-8">
        <SegmentTabs
          className="mb-5 sm:hidden"
          label="Date range"
          options={rangeOptions}
          value={dateRange}
          onChange={setDateRange}
        />

        {/* KPI row */}
        <div className={metricGrid}>
          <MetricCard
            hint={`Last ${RANGE_LABELS[dateRange]}`}
            icon={Banknote}
            label="Total revenue"
            loading={isLoading}
            tone="brand"
            value={formatCurrency(totalRevenue)}
          />
          <MetricCard
            hint={`${cancelledOrders} ${cancelledOrders === 1 ? "order" : "orders"} cancelled`}
            icon={ShoppingBag}
            label="Total orders"
            loading={isLoading}
            tone="neutral"
            value={formatNumber(totalOrders)}
          />
          <MetricCard
            hint="Revenue per order"
            icon={Wallet}
            label="Avg. order value"
            loading={isLoading}
            tone="neutral"
            value={formatCurrency(avgOrderValue)}
          />
          <MetricCard
            hint={
              cancellationRate > 10
                ? "Higher than ideal — investigate"
                : "Within a healthy range"
            }
            icon={cancellationRate > 10 ? TrendingDown : TrendingUp}
            label="Cancellation rate"
            loading={isLoading}
            tone={cancellationRate > 10 ? "danger" : "success"}
            value={`${cancellationRate.toFixed(1)}%`}
          />
        </div>

        {/* Charts */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Panel
            description="Revenue per day, last 14 recorded days"
            empty={dailyRevenue.length === 0}
            loading={isLoading}
            title="Daily revenue"
          >
            <ResponsiveContainer height={260} width="100%">
              <BarChart data={dailyRevenue} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
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
                        <p className="text-label-sm text-content-subtle">
                          {label}
                        </p>
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
          </Panel>

          <Panel
            description="Orders received per day, last 14 recorded days"
            empty={dailyOrders.length === 0}
            loading={isLoading}
            title="Daily orders"
          >
            <ResponsiveContainer height={260} width="100%">
              <LineChart data={dailyOrders} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
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
                        <p className="text-label-sm text-content-subtle">
                          {label}
                        </p>
                        <p className="tabular mt-0.5 text-body-sm font-semibold text-content">
                          {formatNumber(Number(payload[0].value ?? 0))}{" "}
                          orders
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
          </Panel>

          <Panel
            description="Revenue share by order status"
            empty={revenueByStatus.length === 0}
            loading={isLoading}
            title="Revenue by status"
          >
            <div className="relative h-56">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={revenueByStatus}
                    dataKey="value"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {revenueByStatus.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={statusPalette[entry.name] ?? statusPaletteFallback}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="tabular text-title-md font-bold text-content">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
                    Total
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            description="Order count share by pipeline stage"
            empty={ordersByStatus.length === 0}
            loading={isLoading}
            title="Orders by status"
          >
            <div className="flex h-full flex-col justify-center gap-4">
              {ordersByStatus.map((item) => (
                <div key={item.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <StatusBadge dot tone={orderStatusTone(item.name)}>
                      {item.name}
                    </StatusBadge>
                    <span className="tabular text-body-sm font-semibold text-content">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                    <div
                      className="h-full rounded-full transition-all duration-slower ease-entrance"
                      style={{
                        width: `${
                          totalOrders > 0
                            ? (item.value / totalOrders) * 100
                            : 0
                        }%`,
                        backgroundColor:
                          statusPalette[item.name] ?? statusPaletteFallback,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Container>
    </>
  );
}
