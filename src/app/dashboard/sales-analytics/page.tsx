"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@nextui-org/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useOrders } from "@/src/hooks/useOrder";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const statusColor: Record<string, string> = {
  PENDING: "warning",
  PROCESSING: "primary",
  SHIPPED: "secondary",
  DELIVERED: "success",
  CANCELLED: "danger",
};

export default function SalesAnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const { data: ordersRes, isLoading, refetch } = useOrders({}, { limit: 1000, sortBy: "createdAt", sortOrder: "desc" });

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
    () => orders.reduce((sum: number, o: any) => sum + (o.totalAmount || o.totalPrice || 0), 0),
    [orders]
  );
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelledOrders = orders.filter((o: any) => o.status === "CANCELLED").length;
  const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  const revenueByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o: any) => {
      const status = o.status || "UNKNOWN";
      map[status] = (map[status] || 0) + (o.totalAmount || o.totalPrice || 0);
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
      const date = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[date] = (map[date] || 0) + (o.totalAmount || o.totalPrice || 0);
    });
    return Object.entries(map)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-14);
  }, [orders]);

  const dailyOrders = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o: any) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map[date] = (map[date] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .slice(-14);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-sm text-default-500">Track your sales performance and revenue metrics</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={dateRange === range ? "solid" : "flat"}
              color={dateRange === range ? "primary" : "default"}
              onPress={() => setDateRange(range)}
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {range === "all" ? "All" : range}
            </Button>
          ))}
          <Button isIconOnly size="sm" variant="flat" onPress={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-sm"><CardBody><Skeleton className="h-24 rounded-lg" /></CardBody></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-tiny uppercase font-bold text-blue-500">Total Revenue</p>
                  <h3 className="text-2xl font-extrabold mt-1">৳{totalRevenue.toLocaleString()}</h3>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg text-white"><DollarSign className="w-5 h-5" /></div>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-green-500/10 to-transparent">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-tiny uppercase font-bold text-green-500">Total Orders</p>
                  <h3 className="text-2xl font-extrabold mt-1">{totalOrders}</h3>
                </div>
                <div className="p-3 bg-green-500 rounded-lg text-white"><ShoppingCart className="w-5 h-5" /></div>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-tiny uppercase font-bold text-purple-500">Avg. Order Value</p>
                  <h3 className="text-2xl font-extrabold mt-1">৳{avgOrderValue.toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg text-white"><BarChart3 className="w-5 h-5" /></div>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow-sm bg-gradient-to-br from-orange-500/10 to-transparent">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-tiny uppercase font-bold text-orange-500">Cancellation Rate</p>
                  <h3 className="text-2xl font-extrabold mt-1">{cancellationRate.toFixed(1)}%</h3>
                </div>
                <div className={`p-3 rounded-lg text-white ${cancellationRate > 10 ? "bg-red-500" : "bg-orange-500"}`}>
                  {cancellationRate > 10 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader><h3 className="text-lg font-bold">Daily Revenue</h3></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><h3 className="text-lg font-bold">Daily Orders</h3></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><h3 className="text-lg font-bold">Revenue by Status</h3></CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {revenueByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><h3 className="text-lg font-bold">Orders by Status</h3></CardHeader>
          <CardBody>
            <div className="space-y-3">
              {ordersByStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Chip color={statusColor[item.name] as any} size="sm" variant="flat">
                      {item.name}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / totalOrders) * 100}%`,
                          backgroundColor: COLORS[ordersByStatus.indexOf(item) % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
