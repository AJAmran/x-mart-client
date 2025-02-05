"use client";

import { FC } from "react";
import {
  BoxIcon,
  ChartIcon,
  ClipboxIcon,
  FunnelIcon,
  ProfileIcon,
} from "../icons";
import { Link } from "@nextui-org/link";
import { ThemeSwitch } from "../theme-switch";

const Sidebar: FC = () => {
  return (
    <aside className="w-64 h-screen bg-slate-800 text-white shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div className="p-6">
        {/* Logo and Theme Switch */}
        <div className="flex items-center justify-between space-x-3 mb-8">
          <Link href="/" className="text-2xl font-bold text-accent tracking-wide">
            X-Mart
          </Link>
          <ThemeSwitch />
        </div>

        {/* Menu Items */}
        <ul className="space-y-6">
          {/* User Management */}
          <li>
            <Link
              href="/dashboard/user-management"
              className="flex text-white items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
            >
              <ProfileIcon className="text-xl text-mutedText" />
              <span className="text-base font-medium">User Management</span>
            </Link>
          </li>

          {/* Product Management */}
          <li>
            <Link
              href="/dashboard/product-management"
              className="flex text-white items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
            >
              <BoxIcon className="text-xl text-mutedText" />
              <span className="text-base font-medium">Product Management</span>
            </Link>
          </li>

          {/* Order Management */}
          <li>
            <Link
              href="/dashboard/order-management"
              className="flex text-white items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
            >
              <ClipboxIcon className="text-xl text-mutedText" />
              <span className="text-base font-medium">Order Management</span>
            </Link>
          </li>

          {/* Sales & Analytics */}
          <li>
            <Link
              href="/dashboard/sales-analytics"
              className="flex text-white items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
            >
              <ChartIcon className="text-xl text-mutedText" />
              <span className="text-base font-medium">Sales & Analytics</span>
            </Link>
          </li>

          {/* Inventory Management */}
          <li>
            <Link
              href="/dashboard/inventory-management"
              className="flex text-white items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
            >
              <FunnelIcon className="text-xl text-mutedText" />
              <span className="text-base font-medium">
                Inventory Management
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-slate-700">
        <Link
          href="/logout"
          className="flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
