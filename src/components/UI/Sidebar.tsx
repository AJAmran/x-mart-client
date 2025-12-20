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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const isActive = (href?: string) => {
    if (!href) return false;

    return pathname === href;
  };

  const isSubmenuActive = (submenu?: { href: string }[]) => {
    if (!submenu) return false;

    return submenu.some((item) => pathname === item.href);
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 shadow-lg flex flex-col justify-between border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight"
            href="/"
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
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive(item.href)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    href={item.href}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-white" : ""}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${isSubmenuActive(item.submenu)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSubmenu(item.label)}
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
                {item.submenu && (openSubmenu === item.label || isSubmenuActive(item.submenu)) && (
                  <ul className="pl-10 space-y-1 mt-1 mb-2">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          className={`flex items-center p-2 rounded-lg text-sm transition-all duration-200 ${isActive(subItem.href)
                              ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30"
                              : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-gray-700/50"
                            }`}
                          href={subItem.href}
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
          className="flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200"
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
