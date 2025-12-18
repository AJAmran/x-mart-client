"use client";

import { FC } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { ChartIcon, FunnelIcon, ProfileIcon } from "@/src/components/icons";


const DashboardHome: FC = () => {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold mb-8">Dashboard Overview</h1>

      {/* Statistics Cards */}
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
            <h3 className="text-3xl font-extrabold mt-1">1,245</h3>
          </CardHeader>
          <CardBody className="py-2">
            <p className="text-sm text-default-500 flex items-center">
              <span className="text-green-500 font-semibold mr-1">↑ 12%</span> vs last month
            </p>
          </CardBody>
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
            <h3 className="text-3xl font-extrabold mt-1">512</h3>
          </CardHeader>
          <CardBody className="py-2">
            <p className="text-sm text-default-500 flex items-center">
              <span className="text-green-500 font-semibold mr-1">↑ 8%</span> vs last month
            </p>
          </CardBody>
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
            <h3 className="text-3xl font-extrabold mt-1">$24,560</h3>
          </CardHeader>
          <CardBody className="py-2">
            <p className="text-sm text-default-500 flex items-center">
              <span className="text-green-500 font-semibold mr-1">↑ 24%</span> vs last month
            </p>
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 border-none bg-gradient-to-br from-purple-500/10 to-transparent dark:from-purple-500/20">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ChartIcon size={80} />
          </div>
          <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
            <div className="p-2 bg-purple-500 rounded-lg text-white mb-3 shadow-lg shadow-purple-500/30">
              <ChartIcon size={20} />
            </div>
            <p className="text-tiny uppercase font-bold text-purple-500">Total Profit</p>
            <h3 className="text-3xl font-extrabold mt-1">$8,245</h3>
          </CardHeader>
          <CardBody className="py-2">
            <p className="text-sm text-default-500 flex items-center">
              <span className="text-green-500 font-semibold mr-1">↑ 15%</span> vs last month
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <h3 className="text-lg font-bold">Sales Chart</h3>
          </CardHeader>
          <CardBody>
            {/* <BarChart /> */}
          </CardBody>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <h3 className="text-lg font-bold">Revenue Chart</h3>
          </CardHeader>
          <CardBody>
            {/* <LineChart /> */}
          </CardBody>
        </Card>
      </div>

      {/* Recent Orders */}
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
                <TableRow>
                  <TableCell>#12345</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <span className="text-green-500">Completed</span>
                  </TableCell>
                  <TableCell>$125.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#12346</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>
                    <span className="text-yellow-500">Pending</span>
                  </TableCell>
                  <TableCell>$98.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#12347</TableCell>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell>
                    <span className="text-red-500">Cancelled</span>
                  </TableCell>
                  <TableCell>$75.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
