"use client";

import { useMemo } from "react";
import {
  Banknote,
  Package,
  Percent,
  ShoppingBag,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  StatTile,
  metricGrid,
} from "@/src/components/dashboard/MetricCard";
import {
  chartPalette,
  statusPalette,
  statusPaletteFallback,
} from "@/src/config/theme";
import { useOrders } from "@/src/hooks/useOrder";
import { useUsers } from "@/src/hooks/useUser";
import { useProducts } from "@/src/hooks/useProducts";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";

const axisTick = { fontSize: 11 } as const;

export default function InsightsPage() {
  const {
    data: ordersRes,
    isLoading: ordersLoading,
  } = useOrders({}, { limit: 5000, sortBy: "createdAt", sortOrder: "desc" });
  const { data: usersRes, isLoading: usersLoading } = useUsers({ limit: 1 });
  const {
    data: productsRes,
    isLoading: productsLoading,
  } = useProducts({}, { limit: 1 });

  const insights = useMemo(() => {
    const orders = ordersRes?.data || [];
    const totalUsers = usersRes?.meta?.total || usersRes?.data?.length || 0;
    const totalProducts =
      productsRes?.meta?.total || productsRes?.data?.length || 0;
    const totalRevenue = orders.reduce(
      (s: number, o: any) => s + (o.totalPrice ?? 0),
      0
    );
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const revenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    const delivered = orders.filter((o: any) => o.status === "DELIVERED")
      .length;
    const cancelled = orders.filter((o: any) => o.status === "CANCELLED")
      .length;
    const deliveryRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;
    const cancellationRate =
      totalOrders > 0 ? (cancelled / totalOrders) * 100 : 0;

    const statusCounts: Record<string, number> = {};

    orders.forEach((o: any) => {
      const s = o.status || "UNKNOWN";

      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(
      ([name, value]) => ({ name, value })
    );

    const topProducts: Record<string, { qty: number; revenue: number }> = {};

    orders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        const name = item.name || item.productId || "Unknown";

        if (!topProducts[name])
          topProducts[name] = { qty: 0, revenue: 0 };
        topProducts[name].qty += item.quantity || 1;
        topProducts[name].revenue +=
          (item.price || 0) * (item.quantity || 1);
      });
    });
    const topSelling = Object.entries(topProducts)
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalUsers,
      totalProducts,
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenuePerUser,
      delivered,
      cancelled,
      deliveryRate,
      cancellationRate,
      statusData,
      topSelling,
    };
  }, [ordersRes, usersRes, productsRes]);

  const isLoading = ordersLoading || usersLoading || productsLoading;

  return (
    <>
      <PageHeader
        description="Key metrics and performance indicators across the store."
        eyebrow="Sales & analytics"
        title="Business insights"
      />

      <Container className="py-6 sm:py-8">
        {/* Primary KPIs */}
        <div className={metricGrid}>
          <MetricCard
            icon={Banknote}
            label="Total revenue"
            loading={isLoading}
            tone="brand"
            value={formatCurrency(insights.totalRevenue)}
          />
          <MetricCard
            icon={ShoppingBag}
            label="Total orders"
            loading={isLoading}
            tone="neutral"
            value={formatNumber(insights.totalOrders)}
          />
          <MetricCard
            icon={Wallet}
            label="Avg. order value"
            loading={isLoading}
            tone="neutral"
            value={formatCurrency(insights.avgOrderValue)}
          />
          <MetricCard
            hint={`${formatNumber(insights.delivered)} delivered`}
            icon={Target}
            label="Delivery rate"
            loading={isLoading}
            tone="success"
            value={`${insights.deliveryRate.toFixed(1)}%`}
          />
        </div>

        {/* Secondary indicators */}
        <Panel
          className="mt-5"
          description="Supporting metrics at a glance"
          loading={isLoading}
          title="Quick indicators"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={Users}
              label="Users"
              loading={isLoading}
              tone="brand"
              value={formatNumber(insights.totalUsers)}
            />
            <StatTile
              icon={Package}
              label="Products"
              loading={isLoading}
              tone="neutral"
              value={formatNumber(insights.totalProducts)}
            />
            <StatTile
              icon={Percent}
              label="Cancellation rate"
              loading={isLoading}
              tone={insights.cancellationRate > 10 ? "danger" : "warning"}
              value={`${insights.cancellationRate.toFixed(1)}%`}
            />
            <StatTile
              icon={TrendingUp}
              label="Revenue / user"
              loading={isLoading}
              tone="success"
              value={formatCurrency(insights.revenuePerUser)}
            />
          </div>
        </Panel>

        {/* Charts */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Panel
            description="Share of orders by pipeline stage"
            empty={insights.statusData.length === 0}
            loading={isLoading}
            title="Order status distribution"
          >
            <div className="relative h-64">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={insights.statusData}
                    dataKey="value"
                    innerRadius={64}
                    outerRadius={96}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {insights.statusData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          statusPalette[entry.name] ?? statusPaletteFallback
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="tabular text-display-sm font-bold text-content">
                    {formatNumber(insights.totalOrders)}
                  </p>
                  <p className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
                    Orders
                  </p>
                </div>
              </div>
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {insights.statusData.map((entry) => (
                <li
                  key={entry.name}
                  className="flex items-center gap-2 text-label-sm text-content-muted"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        statusPalette[entry.name] ?? statusPaletteFallback,
                    }}
                  />
                  {entry.name}
                  <span className="tabular font-semibold text-content">
                    {entry.value}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            description="Best sellers by quantity"
            empty={insights.topSelling.length === 0}
            emptyDescription="Top sellers appear once orders contain product items."
            loading={isLoading}
            title="Top selling products"
          >
            {insights.topSelling.length === 0 ? (
              <div className="grid h-64 place-items-center" />
            ) : (
              <ResponsiveContainer height={280} width="100%">
                <BarChart
                  data={insights.topSelling}
                  height={280}
                  layout="vertical"
                  margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="rgb(var(--line))"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    allowDecimals={false}
                    tick={axisTick}
                    tickLine={false}
                    type="number"
                  />
                  <YAxis
                    dataKey="name"
                    tick={axisTick}
                    tickLine={false}
                    type="category"
                    width={140}
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
                            units
                          </p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar
                    dataKey="qty"
                    fill={chartPalette[0]}
                    maxBarSize={18}
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </div>
      </Container>
    </>
  );
}
