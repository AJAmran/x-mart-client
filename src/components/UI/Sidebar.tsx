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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "../theme-switch";

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    label: "User Management",
    href: "/dashboard/user-management",
    icon: Users,
  },
  {
    label: "Product Management",
    icon: Box,
    submenu: [
      {
        label: "Add Product",
        href: "/dashboard/product-management/add-product",
      },
      {
        label: "Product List",
        href: "/dashboard/product-management/product-list",
      },
    ],
  },
  {
    label: "Order Management",
    href: "/dashboard/order-management",
    icon: ShoppingCart,
  },
  {
    label: "Sales & Analytics",
    icon: LineChart,
    submenu: [
      { label: "Reports", href: "/dashboard/sales-analytics/reports" },
      { label: "Insights", href: "/dashboard/sales-analytics/insights" },
    ],
  },
  {
    label: "Inventory Management",
    href: "/dashboard/inventory-management",
    icon: Package,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const Sidebar: FC = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
          >
            X-Mart
          </Link>
          <ThemeSwitch />
        </div>

        {/* Menu Items */}
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div
                    className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleSubmenu(item.label)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggleSubmenu(item.label);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {openSubmenu === item.label ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
                {item.submenu && openSubmenu === item.label && (
                  <ul className="pl-10 space-y-1 mt-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          href={subItem.href}
                          className="flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200"
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/logout"
          className="flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
