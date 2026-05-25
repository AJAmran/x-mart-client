"use client";

import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Target,
  Award,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useOrders } from "@/src/hooks/useOrder";
import { useUsers } from "@/src/hooks/useUser";
import { useProducts } from "@/src/hooks/useProducts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function InsightsPage() {
  const { data: ordersRes, isLoading: ordersLoading } = useOrders({}, { limit: 5000, sortBy: "createdAt", sortOrder: "desc" });
  const { data: usersRes, isLoading: usersLoading } = useUsers({ limit: 1 });
  const { data: productsRes, isLoading: productsLoading } = useProducts({}, { limit: 1 });

  const insights = useMemo(() => {
    const orders = ordersRes?.data || [];
    const totalUsers = usersRes?.meta?.total || usersRes?.data?.length || 0;
    const totalProducts = productsRes?.meta?.total || productsRes?.data?.length || 0;
    const totalRevenue = orders.reduce((s: number, o: any) => s + (o.totalAmount || o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const revenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    const delivered = orders.filter((o: any) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o: any) => o.status === "CANCELLED").length;
    const deliveryRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;
    const cancellationRate = totalOrders > 0 ? (cancelled / totalOrders) * 100 : 0;

    const statusCounts: Record<string, number> = {};
    orders.forEach((o: any) => {
      const s = o.status || "UNKNOWN";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    const topProducts: Record<string, { qty: number; revenue: number }> = {};
    orders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        const name = item.name || item.productId || "Unknown";
        if (!topProducts[name]) topProducts[name] = { qty: 0, revenue: 0 };
        topProducts[name].qty += item.quantity || 1;
        topProducts[name].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    const topSelling = Object.entries(topProducts)
      .map(([name, val]) => ({ name, ...val }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalUsers, totalProducts, totalRevenue, totalOrders, avgOrderValue, revenuePerUser,
      delivered, cancelled, deliveryRate, cancellationRate, statusData, topSelling,
    };
  }, [ordersRes, usersRes, productsRes]);

  const isLoading = ordersLoading || usersLoading || productsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business Insights</h1>
        <p className="text-sm text-default-500">Key metrics and performance indicators</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardBody><Skeleton className="h-20 rounded-lg" /></CardBody></Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm bg-gradient-to-br from-blue-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg text-white"><DollarSign className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-blue-500">Revenue</p>
                  <h3 className="text-xl font-extrabold">৳{insights.totalRevenue.toLocaleString()}</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-green-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg text-white"><ShoppingCart className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-green-500">Orders</p>
                  <h3 className="text-xl font-extrabold">{insights.totalOrders}</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-purple-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg text-white"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-purple-500">Users</p>
                  <h3 className="text-xl font-extrabold">{insights.totalUsers}</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-orange-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg text-white"><Package className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-orange-500">Products</p>
                  <h3 className="text-xl font-extrabold">{insights.totalProducts}</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-emerald-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-lg text-white"><Target className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-emerald-500">Avg Order Value</p>
                  <h3 className="text-xl font-extrabold">৳{insights.avgOrderValue.toFixed(2)}</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-cyan-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-cyan-500 rounded-lg text-white"><TrendingUp className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-cyan-500">Delivery Rate</p>
                  <h3 className="text-xl font-extrabold">{insights.deliveryRate.toFixed(1)}%</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-red-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-red-500 rounded-lg text-white"><TrendingDown className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-red-500">Cancellation Rate</p>
                  <h3 className="text-xl font-extrabold">{insights.cancellationRate.toFixed(1)}%</h3>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-sm bg-gradient-to-br from-pink-500/10">
              <CardBody className="flex flex-row items-center gap-4">
                <div className="p-3 bg-pink-500 rounded-lg text-white"><Award className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs uppercase font-bold text-pink-500">Revenue/User</p>
                  <h3 className="text-xl font-extrabold">৳{insights.revenuePerUser.toFixed(2)}</h3>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader><h3 className="text-lg font-bold">Order Status Distribution</h3></CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={insights.statusData} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {insights.statusData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardHeader><h3 className="text-lg font-bold">Top Selling Products</h3></CardHeader>
              <CardBody>
                {insights.topSelling.length === 0 ? (
                  <p className="text-default-400 text-center py-10">No data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={insights.topSelling} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="qty" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
