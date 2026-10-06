"use client";

import { useMemo } from "react";
import NextLink from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { chartPalette } from "@/src/config/theme";
import { useOrders } from "@/src/hooks/useOrder";
import { useProducts } from "@/src/hooks/useProducts";
import { useUsers } from "@/src/hooks/useUser";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";

/* ── Chart tooltip, themed to match the rest of the product ──────────────── */

function ChartTooltip({
  active,
  payload,
  label,
  kind,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string;
  kind: "currency" | "count";
}) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);

  return (
    <div className="rounded-md border border-line-hairline bg-surface-raised px-3 py-2 shadow-lg">
      <p className="text-label-sm text-content-subtle">{label}</p>
      <p className="tabular mt-0.5 text-body-sm font-semibold text-content">
        {kind === "currency"
          ? formatCurrency(value)
          : `${formatNumber(value)} orders`}
      </p>
    </div>
  );
}

const axisTick = { fontSize: 11 } as const;

export default function DashboardHome() {
  const { data: usersRes, isLoading: usersLoading } = useUsers({ limit: 1 });
  /**
   * Revenue is summed client-side from these rows, so the fetch has to cover
   * every order or the figure silently under-counts once the catalogue passes
   * the limit. 1000 leaves ample headroom for a demo dataset; the API does not
   * cap `limit`.
   */
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

  /**
   * Revenue counts orders that can actually be collected, so cancelled orders
   * are excluded. Including them inflated the figure with money never taken.
   */
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

  const hasChartData = chartData.some((d) => d.orders > 0);

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
            sparkline={chartData.map((d) => d.orders)}
            tone="brand"
            value={formatNumber(totalOrders)}
          />
          <MetricCard
            hint="Across all orders placed"
            href="/dashboard/sales-analytics"
            icon={Banknote}
            label="Revenue"
            loading={ordersLoading}
            sparkline={chartData.map((d) => d.revenue)}
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
            <ResponsiveContainer height={250} width="100%">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, bottom: 0, left: -18 }}
              >
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
                  content={<ChartTooltip kind="currency" />}
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
          </Panel>

          <Panel
            description="Orders received per day, last 7 days"
            empty={!hasChartData}
            emptyDescription="Once orders start coming in, daily volume plots here."
            emptyIcon={TrendingUp}
            loading={ordersLoading}
            title="Order volume"
          >
            <ResponsiveContainer height={250} width="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 8, bottom: 0, left: -24 }}
              >
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
                  content={<ChartTooltip kind="count" />}
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
