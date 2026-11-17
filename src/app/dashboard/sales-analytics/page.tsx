"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Banknote,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

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
  statusPalette,
  statusPaletteFallback,
} from "@/src/config/theme";
import { useOrders } from "@/src/hooks/useOrder";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";
import { ChartSkeleton } from "@/src/components/dashboard/charts/ChartSkeleton";

// Dynamic imports with lazy chunk loading and skeleton fallbacks
const AnalyticsRevenueBarChart = dynamic(
  () =>
    import("@/src/components/dashboard/charts/SalesAnalyticsCharts").then(
      (mod) => mod.AnalyticsRevenueBarChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={260} />,
  }
);

const AnalyticsOrdersLineChart = dynamic(
  () =>
    import("@/src/components/dashboard/charts/SalesAnalyticsCharts").then(
      (mod) => mod.AnalyticsOrdersLineChart
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={260} />,
  }
);

const AnalyticsStatusPieChart = dynamic(
  () =>
    import("@/src/components/dashboard/charts/SalesAnalyticsCharts").then(
      (mod) => mod.AnalyticsStatusPieChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 w-full animate-pulse items-center justify-center rounded-lg bg-surface-sunken/40">
        <div className="size-32 rounded-full border-8 border-line-hairline/60" />
      </div>
    ),
  }
);

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
  const cancelledOrders = useMemo(
    () => orders.filter((o: any) => o.status === "CANCELLED").length,
    [orders]
  );
  const cancellationRate =
    totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  // Daily revenue series (last 14 days)
  const dailyRevenue = useMemo(() => {
    const map = new Map<string, number>();
    const days: string[] = [];

    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date();

      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      map.set(key, 0);
      days.push(key);
    }

    orders.forEach((o: any) => {
      const key = new Date(o.createdAt).toISOString().split("T")[0];

      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + (o.totalPrice ?? 0));
      }
    });

    return days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: map.get(date) || 0,
    }));
  }, [orders]);

  // Orders per day series
  const dailyOrders = useMemo(() => {
    const map = new Map<string, number>();
    const days: string[] = [];

    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date();

      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      map.set(key, 0);
      days.push(key);
    }

    orders.forEach((o: any) => {
      const key = new Date(o.createdAt).toISOString().split("T")[0];

      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    return days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: map.get(date) || 0,
    }));
  }, [orders]);

  // Revenue by status (donut)
  const revenueByStatus = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const s = o.status || "UNKNOWN";

      map[s] = (map[s] || 0) + (o.totalPrice ?? 0);
    });

    return Object.entries(map).map(([status, value]) => ({
      name: status,
      status,
      value,
    }));
  }, [orders]);

  // Orders by status (breakdown list)
  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};

    orders.forEach((o: any) => {
      const s = o.status || "UNKNOWN";

      map[s] = (map[s] || 0) + 1;
    });

    return Object.entries(map).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [orders]);

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-3">
            <SegmentTabs
              options={rangeOptions}
              value={dateRange}
              onChange={setDateRange}
            />
            <IconButton label="Refresh" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        }
        description="Tak collected, order volume, and cancellation rates over time."
        eyebrow="Analytics"
        title="Sales & revenue"
      />

      <Container className="py-6 sm:py-8">
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
            <AnalyticsRevenueBarChart data={dailyRevenue} />
          </Panel>

          <Panel
            description="Orders received per day, last 14 recorded days"
            empty={dailyOrders.length === 0}
            loading={isLoading}
            title="Daily orders"
          >
            <AnalyticsOrdersLineChart data={dailyOrders} />
          </Panel>

          <Panel
            description="Revenue share by order status"
            empty={revenueByStatus.length === 0}
            loading={isLoading}
            title="Revenue by status"
          >
            <AnalyticsStatusPieChart
              data={revenueByStatus}
              totalRevenue={totalRevenue}
            />
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
