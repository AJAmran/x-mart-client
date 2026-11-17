"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import {
  Banknote,
  Boxes,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

import { Container } from "@/src/components/UI/Container";
import { PageHeader } from "@/src/components/UI/Section";
import { Panel } from "@/src/components/dashboard/Panel";
import { MetricCard, metricGrid } from "@/src/components/dashboard/MetricCard";
import { RecentOrdersTable } from "@/src/components/dashboard/RecentOrdersTable";
import { StatusBreakdown } from "@/src/components/dashboard/StatusBreakdown";
import { ChartSkeleton } from "@/src/components/dashboard/charts/ChartSkeleton";
import { useOrders } from "@/src/hooks/useOrder";
import { useProducts } from "@/src/hooks/useProducts";
import { useUsers } from "@/src/hooks/useUser";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";

// Dynamic imports with lazy chunk loading and skeleton fallbacks
const DashboardRevenueChart = dynamic(
  () => import("@/src/components/dashboard/charts/DashboardRevenueChart"),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={250} />,
  }
);

const DashboardVolumeChart = dynamic(
  () => import("@/src/components/dashboard/charts/DashboardVolumeChart"),
  {
    ssr: false,
    loading: () => <ChartSkeleton height={250} />,
  }
);

export default function DashboardHome() {
  const { data: usersRes, isLoading: usersLoading } = useUsers({ limit: 1 });
  const { data: ordersRes, isLoading: ordersLoading } = useOrders(
    {},
    { limit: 1000, sortBy: "createdAt", sortOrder: "desc" }
  );
  const { data: productsRes, isLoading: productsLoading } = useProducts(
    {},
    { limit: 1, page: 1, sortBy: "createdAt", sortOrder: "desc" }
  );

  const orders: TOrder[] = useMemo(() => ordersRes?.data ?? [], [ordersRes]);

  const totalUsers = usersRes?.meta?.total ?? 0;
  const totalOrders = ordersRes?.meta?.total ?? orders.length;
  const totalProducts = productsRes?.meta?.total ?? 0;

  const billableOrders = useMemo(
    () => orders.filter((o) => o.status !== ORDER_STATUS.CANCELLED),
    [orders]
  );

  const totalRevenue = useMemo(
    () =>
      billableOrders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0),
    [billableOrders]
  );

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    [orders]
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [orders]
  );

  /** Last 7 calendar days, zero-filled so the axis never has gaps. */
  const chartData = useMemo(() => {
    const days: {
      key: string;
      label: string;
      revenue: number;
      orders: number;
    }[] = [];

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();

      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }

    const byDay = new Map(days.map((d) => [d.key, d]));

    for (const order of billableOrders) {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      const bucket = byDay.get(key);

      if (!bucket) continue;
      bucket.revenue += order.totalPrice ?? 0;
      bucket.orders += 1;
    }

    return days;
  }, [billableOrders]);

  const ordersSparkline = useMemo(() => chartData.map((d) => d.orders), [chartData]);
  const revenueSparkline = useMemo(() => chartData.map((d) => d.revenue), [chartData]);

  const hasChartData = useMemo(() => chartData.some((d) => d.orders > 0), [chartData]);

  return (
    <>
      {/* Full-bleed band — PageHeader supplies its own Container. */}
      <PageHeader
        action={
          <NextLink
            className="inline-flex h-9 items-center gap-2 rounded-md bg-brand px-3.5 text-body-sm font-semibold text-brand-contrast shadow-brand transition-all duration-fast ease-standard hover:bg-brand-hover active:scale-[0.98]"
            href="/dashboard/product-management/add-product"
          >
            <Package aria-hidden size={16} />
            Add product
          </NextLink>
        }
        description="Volume, revenue, and what still needs attention."
        title="Dashboard"
        variant="compact"
      />

      <Container className="py-6 sm:py-8">
        {/* ---- KPI row ---- */}
        <div className={metricGrid}>
          <MetricCard
            hint="Registered accounts"
            href="/dashboard/user-management"
            icon={Users}
            label="Total users"
            loading={usersLoading}
            tone="neutral"
            value={formatNumber(totalUsers)}
          />
          <MetricCard
            hint={
              pendingCount > 0
                ? `${formatNumber(pendingCount)} awaiting fulfilment`
                : "Nothing awaiting fulfilment"
            }
            href="/dashboard/order-management"
            icon={ShoppingBag}
            label="Orders"
            loading={ordersLoading}
            sparkline={ordersSparkline}
            tone="brand"
            value={formatNumber(totalOrders)}
          />
          <MetricCard
            hint="Across all orders placed"
            href="/dashboard/sales-analytics"
            icon={Banknote}
            label="Revenue"
            loading={ordersLoading}
            sparkline={revenueSparkline}
            tone="brand"
            value={formatCurrency(totalRevenue)}
          />
          <MetricCard
            hint="Live in the catalogue"
            href="/dashboard/product-management/product-list"
            icon={Boxes}
            label="Products"
            loading={productsLoading}
            tone="neutral"
            value={formatNumber(totalProducts)}
          />
        </div>

        {/* ---- Charts ---- */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel
            action={
              <NextLink
                className="text-label-sm font-semibold text-brand hover:underline"
                href="/dashboard/sales-analytics"
              >
                Details
              </NextLink>
            }
            description="Tak collected per day, last 7 days"
            empty={!hasChartData}
            emptyDescription="Once orders start coming in, daily revenue plots here."
            emptyIcon={TrendingUp}
            loading={ordersLoading}
            title="Revenue"
          >
            <DashboardRevenueChart data={chartData} />
          </Panel>

          <Panel
            description="Orders received per day, last 7 days"
            empty={!hasChartData}
            emptyDescription="Once orders start coming in, daily volume plots here."
            emptyIcon={TrendingUp}
            loading={ordersLoading}
            title="Order volume"
          >
            <DashboardVolumeChart data={chartData} />
          </Panel>
        </div>

        {/* ---- Recent orders + status breakdown ---- */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <RecentOrdersTable loading={ordersLoading} orders={recentOrders} />
          <StatusBreakdown
            loading={ordersLoading}
            orders={orders}
            total={totalOrders}
          />
        </div>
      </Container>
    </>
  );
}
