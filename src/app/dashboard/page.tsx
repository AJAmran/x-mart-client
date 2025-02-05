"use client";

import { FC } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import {  ChartIcon, FunnelIcon, ProfileIcon } from "@/src/components/icons";


const DashboardHome: FC = () => {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold mb-8">Dashboard Overview</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ProfileIcon size={24} className="text-primary" />
              <h3 className="text-lg font-bold">Users</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-extrabold">1,245</p>
            <p className="text-sm text-muted">Active Users</p>
          </CardBody>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FunnelIcon size={24} className="text-primary" />
              <h3 className="text-lg font-bold">Orders</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-extrabold">512</p>
            <p className="text-sm text-muted">This Month</p>
          </CardBody>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ChartIcon size={24} className="text-primary" />
              <h3 className="text-lg font-bold">Sales</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-extrabold">$24,560</p>
            <p className="text-sm text-muted">Revenue</p>
          </CardBody>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <ChartIcon size={24} className="text-primary" />
              <h3 className="text-lg font-bold">Profit</h3>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-extrabold">$8,245</p>
            <p className="text-sm text-muted">This Month</p>
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
