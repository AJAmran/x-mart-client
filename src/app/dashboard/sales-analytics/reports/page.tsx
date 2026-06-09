"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import { toast } from "sonner";
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { exportToCSV, exportToPDF } from "@/src/utils/exportUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useOrders } from "@/src/hooks/useOrder";

export default function ReportsPage() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const { data: ordersRes, isLoading, refetch } = useOrders({}, { limit: 5000, sortBy: "createdAt", sortOrder: "desc" });

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

    const totalRev = filtered.reduce((s: number, o: any) => s + (o.totalAmount || o.totalPrice || 0), 0);
    const totalOrd = filtered.length;
    const delivered = filtered.filter((o: any) => o.status === "DELIVERED").length;
    const cancelled = filtered.filter((o: any) => o.status === "CANCELLED").length;

    const dailyMap: Record<string, { revenue: number; orders: number }> = {};

    filtered.forEach((o: any) => {
      const d = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

      if (!dailyMap[d]) dailyMap[d] = { revenue: 0, orders: 0 };
      dailyMap[d].revenue += o.totalAmount || o.totalPrice || 0;
      dailyMap[d].orders += 1;
    });

    return {
      reportData: Object.entries(dailyMap).map(([date, val]) => ({ date, ...val })),
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
      Amount: o.totalAmount || o.totalPrice || 0,
      Date: new Date(o.createdAt).toLocaleDateString(),
    }));

    exportToCSV(data, `sales_report_${new Date().toISOString().split("T")[0]}`);
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Reports</h1>
          <p className="text-sm text-default-500">Generate and download sales reports</p>
        </div>
        <div className="flex gap-2">
          {(["weekly", "monthly", "yearly"] as const).map((p) => (
            <Button key={p} color={period === p ? "primary" : "default"} size="sm" variant={period === p ? "solid" : "flat"} onPress={() => setPeriod(p)}>
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
          <Button isIconOnly size="sm" variant="flat" onPress={downloadExcel}>
            <FileSpreadsheet className="w-4 h-4" />
          </Button>
          <Button isIconOnly size="sm" variant="flat" onPress={downloadPDF}>
            <FileText className="w-4 h-4" />
          </Button>
          <Button isIconOnly size="sm" variant="flat" onPress={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardBody><Skeleton className="h-24 rounded-lg" /></CardBody></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm bg-gradient-to-br from-blue-500/10">
            <CardBody>
              <p className="text-tiny uppercase font-bold text-blue-500">Total Revenue</p>
              <h3 className="text-2xl font-extrabold mt-1">৳{summary.totalRev.toLocaleString()}</h3>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-green-500/10">
            <CardBody>
              <p className="text-tiny uppercase font-bold text-green-500">Total Orders</p>
              <h3 className="text-2xl font-extrabold mt-1">{summary.totalOrd}</h3>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-emerald-500/10">
            <CardBody>
              <p className="text-tiny uppercase font-bold text-emerald-500">Delivered</p>
              <h3 className="text-2xl font-extrabold mt-1">{summary.delivered}</h3>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-red-500/10">
            <CardBody>
              <p className="text-tiny uppercase font-bold text-red-500">Cancelled</p>
              <h3 className="text-2xl font-extrabold mt-1">{summary.cancelled}</h3>
            </CardBody>
          </Card>
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader><h3 className="text-lg font-bold">Daily Revenue - {period.charAt(0).toUpperCase() + period.slice(1)}</h3></CardHeader>
        <CardBody>
          {isLoading ? (
            <Skeleton className="h-72 rounded-lg" />
          ) : (
            <ResponsiveContainer height={350} width="100%">
              <BarChart data={reportData}>
                <CartesianGrid opacity={0.3} strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
