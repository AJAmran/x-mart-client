"use client";

import { FC, useState } from "react";
import {
  Box,
  Users,
  ShoppingCart,
  LineChart,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from "@nextui-org/link";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ThemeSwitch } from "../theme-switch";

const Sidebar: FC = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Toggle submenu visibility
  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 h-screen shadow-lg flex flex-col justify-between border-r-1">
      {/* Top Section */}
      <div className="p-6">
        {/* Logo and Theme Switch */}
        <div className="flex items-center justify-between space-x-3 mb-8">
          <Link
            className="text-2xl font-bold text-accent tracking-wide"
            href="/"
          >
            X-Mart
          </Link>
          <ThemeSwitch />
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {/* User Management */}
          <li>
            <Link
              className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
              href="/dashboard/user-management"
            >
              <Users className="w-5 h-5 text-mutedText" />
              <span className="text-base font-medium">User Management</span>
            </Link>
          </li>

          {/* Product Management */}
          <li>
            <Accordion>
              <AccordionItem
                title={
                  <div
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md cursor-pointer"
                    onClick={() => toggleSubmenu("product")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleSubmenu("product");
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <Box className="w-5 h-5 text-mutedText" />
                    <span className="text-base font-medium">
                      Product Management
                    </span>
                  </div>
                }
              >
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-primary hover:shadow-md"
                      href="/dashboard/product-management/add-product"
                    >
                      <span className="text-sm">Add Product</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-primary hover:shadow-md"
                      href="/dashboard/product-management/product-list"
                    >
                      <span className="text-sm">Product List</span>
                    </Link>
                  </li>
                </ul>
              </AccordionItem>
            </Accordion>
          </li>

          {/* Order Management */}
          <li>
            <Link
              className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
              href="/dashboard/order-management"
            >
              <ShoppingCart className="w-5 h-5 text-mutedText" />
              <span className="text-base font-medium">Order Management</span>
            </Link>
          </li>

          {/* Sales & Analytics */}
          <li>
            <Accordion>
              <AccordionItem
                title={
                  <div
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md cursor-pointer"
                    onClick={() => toggleSubmenu("sales")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleSubmenu("sales");
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <LineChart className="w-5 h-5 text-mutedText" />
                    <span className="text-base font-medium">
                      Sales & Analytics
                    </span>
                  </div>
                }
              >
                <ul className="pl-8 space-y-2">
                  <li>
                    <Link
                      className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-primary hover:shadow-md"
                      href="/dashboard/sales-analytics/reports"
                    >
                      <span className="text-sm">Reports</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex items-center space-x-3 p-2 rounded-lg transition-all hover:bg-primary hover:shadow-md"
                      href="/dashboard/sales-analytics/insights"
                    >
                      <span className="text-sm">Insights</span>
                    </Link>
                  </li>
                </ul>
              </AccordionItem>
            </Accordion>
          </li>

          {/* Inventory Management */}
          <li>
            <Link
              className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
              href="/dashboard/inventory-management"
            >
              <Package className="w-5 h-5 text-mutedText" />
              <span className="text-base font-medium">
                Inventory Management
              </span>
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-primary hover:shadow-md"
              href="/dashboard/settings"
            >
              <Settings className="w-5 h-5 text-mutedText" />
              <span className="text-base font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-slate-700">
        <Link
          className="flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
          href="/logout"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
