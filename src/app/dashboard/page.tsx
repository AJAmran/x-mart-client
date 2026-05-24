"use client";

import { FC } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Skeleton } from "@heroui/skeleton";
import { ChartIcon, FunnelIcon, ProfileIcon } from "@/src/components/icons";
import { useUsers } from "@/src/hooks/useUser";
import { useOrders } from "@/src/hooks/useOrder";
import { useProducts } from "@/src/hooks/useProducts";

const statusColor: Record<string, string> = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-500",
  PROCESSING: "text-indigo-500",
  SHIPPED: "text-purple-500",
  DELIVERED: "text-green-500",
  CANCELLED: "text-red-500",
};

const DashboardHome: FC = () => {
  const { data: usersRes, isLoading: usersLoading } = useUsers({ limit: 1 });
  const { data: ordersRes, isLoading: ordersLoading } = useOrders({}, { limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const { data: productsRes, isLoading: productsLoading } = useProducts({}, { limit: 1, page: 1, sortBy: "createdAt", sortOrder: "desc" });

  const totalUsers = usersRes?.meta?.total ?? usersRes?.data?.length ?? 0;
  const totalOrders = ordersRes?.meta?.total ?? ordersRes?.data?.length ?? 0;
  const totalProducts = productsRes?.meta?.total ?? productsRes?.data?.length ?? 0;
  const orders = ordersRes?.data ?? [];
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || o.total || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ProfileIcon size={80} />
          </div>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <div className="p-2 bg-blue-500 rounded-lg text-white mb-3 shadow-lg shadow-blue-500/30">
              <ProfileIcon size={20} />
            </div>
            <p className="text-tiny uppercase font-bold text-blue-500">Total Users</p>
            {usersLoading ? (
              <Skeleton className="h-9 w-20 mt-1 rounded" />
            ) : (
              <h3 className="text-3xl font-extrabold mt-1">{totalUsers.toLocaleString()}</h3>
            )}
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <FunnelIcon size={80} />
          </div>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <div className="p-2 bg-orange-500 rounded-lg text-white mb-3 shadow-lg shadow-orange-500/30">
              <FunnelIcon size={20} />
            </div>
            <p className="text-tiny uppercase font-bold text-orange-500">Orders</p>
            {ordersLoading ? (
              <Skeleton className="h-9 w-20 mt-1 rounded" />
            ) : (
              <h3 className="text-3xl font-extrabold mt-1">{totalOrders.toLocaleString()}</h3>
            )}
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ChartIcon size={80} />
          </div>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <div className="p-2 bg-green-500 rounded-lg text-white mb-3 shadow-lg shadow-green-500/30">
              <ChartIcon size={20} />
            </div>
            <p className="text-tiny uppercase font-bold text-green-500">Revenue</p>
            {ordersLoading ? (
              <Skeleton className="h-9 w-20 mt-1 rounded" />
            ) : (
              <h3 className="text-3xl font-extrabold mt-1">৳{totalRevenue.toLocaleString()}</h3>
            )}
          </CardHeader>
        </Card>

        <Card className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ChartIcon size={80} />
          </div>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <div className="p-2 bg-purple-500 rounded-lg text-white mb-3 shadow-lg shadow-purple-500/30">
              <ChartIcon size={20} />
            </div>
            <p className="text-tiny uppercase font-bold text-purple-500">Products</p>
            {productsLoading ? (
              <Skeleton className="h-9 w-20 mt-1 rounded" />
            ) : (
              <h3 className="text-3xl font-extrabold mt-1">{totalProducts.toLocaleString()}</h3>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <h3 className="text-lg font-bold">Sales Chart</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-400 text-sm">Chart component coming soon</p>
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <h3 className="text-lg font-bold">Revenue Chart</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-400 text-sm">Chart component coming soon</p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardBody>
            <Table aria-label="Recent Orders">
              <TableHeader>
                <TableColumn>Order ID</TableColumn>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Total</TableColumn>
              </TableHeader>
              <TableBody>
                {ordersLoading ? (
                  <TableRow>
                    <TableCell><Skeleton className="h-5 w-24 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded" /></TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-default-400">No orders yet</TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>#{order._id?.slice(-6).toUpperCase() || order.orderId}</TableCell>
                      <TableCell>{order.user?.name || order.customerName || "N/A"}</TableCell>
                      <TableCell>
                        <span className={statusColor[order.status] || "text-default-500"}>
                          {order.status || "PENDING"}
                        </span>
                      </TableCell>
                      <TableCell>৳{order.totalAmount?.toFixed(2) || order.total?.toFixed(2) || "0.00"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
