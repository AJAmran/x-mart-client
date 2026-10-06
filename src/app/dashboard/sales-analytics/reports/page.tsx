"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  ShoppingBag,
  XCircle,
  Banknote,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
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
  IconButton,
  SegmentTabs,
} from "@/src/components/dashboard/Controls";
import { chartPalette } from "@/src/config/theme";
import { useOrders } from "@/src/hooks/useOrder";
import { exportToCSV, exportToPDF } from "@/src/utils/exportUtils";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";

type Period = "weekly" | "monthly" | "yearly";

const periodOptions: { value: Period; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const periodLabel: Record<Period, string> = {
  weekly: "Last 7 days",
  monthly: "Last 30 days",
  yearly: "Last 12 months",
};

const axisTick = { fontSize: 11 } as const;

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const {
    data: ordersRes,
    isLoading,
    refetch,
  } = useOrders({}, { limit: 5000, sortBy: "createdAt", sortOrder: "desc" });

  const { reportData, summary } = useMemo(() => {
    const orders = ordersRes?.data || [];
    const now = new Date();
    let filtered = [...orders];

    if (period === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000);

      filtered = orders.filter((o: any) => new Date(o.createdAt) >= weekAgo);
    } else if (period === "monthly") {
      const monthAgo = new Date(now.getTime() - 30 * 86400000);

      filtered = orders.filter((o: any) => new Date(o.createdAt) >= monthAgo);
    } else {
      const yearAgo = new Date(now.getTime() - 365 * 86400000);

      filtered = orders.filter((o: any) => new Date(o.createdAt) >= yearAgo);
    }

    const totalRev = filtered.reduce(
      (s: number, o: any) => s + (o.totalPrice ?? 0),
      0
    );
    const totalOrd = filtered.length;
    const delivered = filtered.filter((o: any) => o.status === "DELIVERED")
      .length;
    const cancelled = filtered.filter((o: any) => o.status === "CANCELLED")
      .length;

    const dailyMap: Record<string, { revenue: number; orders: number }> = {};

    filtered.forEach((o: any) => {
      const d = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dailyMap[d]) dailyMap[d] = { revenue: 0, orders: 0 };
      dailyMap[d].revenue += o.totalPrice ?? 0;
      dailyMap[d].orders += 1;
    });

    return {
      reportData: Object.entries(dailyMap).map(([date, val]) => ({
        date,
        ...val,
      })),
      summary: { totalRev, totalOrd, delivered, cancelled },
    };
  }, [ordersRes, period]);

  const downloadExcel = () => {
    if (!ordersRes?.data?.length) {
      toast.error("No data to export");

      return;
    }
    const data = ordersRes.data.map((o: any, i: number) => ({
      "#": i + 1,
      "Order ID": o._id?.slice(-8).toUpperCase(),
      Customer: o.user?.name || o.customerName || "N/A",
      Status: o.status,
      Amount: o.totalPrice ?? 0,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));

    exportToCSV(
      data,
      `sales_report_${new Date().toISOString().split("T")[0]}`
    );
    toast.success("Report downloaded");
  };

  const downloadPDF = () => {
    if (!ordersRes?.data?.length) {
      toast.error("No data to export");

      return;
    }
    exportToPDF([], "sales_report");
    toast.success("PDF dialog opened — use the print menu to save as PDF");
  };

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            <SegmentTabs
              className="hidden sm:inline-flex"
              label="Report period"
              options={periodOptions}
              value={period}
              onChange={setPeriod}
            />
            <IconButton label="Export to CSV" onClick={downloadExcel}>
              <FileSpreadsheet className="size-4" />
            </IconButton>
            <IconButton label="Export to PDF" onClick={downloadPDF}>
              <FileText className="size-4" />
            </IconButton>
            <IconButton label="Refresh data" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        }
        description="Generate, review, and export sales reports."
        eyebrow="Sales & analytics"
        title="Sales reports"
      />

      <Container className="py-6 sm:py-8">
        <SegmentTabs
          className="mb-5 sm:hidden"
          label="Report period"
          options={periodOptions}
          value={period}
          onChange={setPeriod}
        />

        {/* Summary KPIs */}
        <div className={metricGrid}>
          <MetricCard
            hint={periodLabel[period]}
            icon={Banknote}
            label="Total revenue"
            loading={isLoading}
            tone="brand"
            value={formatCurrency(summary.totalRev)}
          />
          <MetricCard
            hint="Orders placed in period"
            icon={ShoppingBag}
            label="Total orders"
            loading={isLoading}
            tone="neutral"
            value={formatNumber(summary.totalOrd)}
          />
          <MetricCard
            hint="Successfully delivered"
            icon={CheckCircle2}
            label="Delivered"
            loading={isLoading}
            tone="success"
            value={formatNumber(summary.delivered)}
          />
          <MetricCard
            hint="Cancelled in period"
            icon={XCircle}
            label="Cancelled"
            loading={isLoading}
            tone="danger"
            value={formatNumber(summary.cancelled)}
          />
        </div>

        {/* Revenue chart */}
        <Panel
          className="mt-5"
          description={`Revenue per day · ${periodLabel[period]}`}
          empty={reportData.length === 0}
          loading={isLoading}
          title="Daily revenue"
        >
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={reportData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
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
      </Container>
    </>
  );
}
