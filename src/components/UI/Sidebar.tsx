"use client";
import { FC, useState, useEffect } from "react";
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
  Menu,
  X,
  LayoutDashboard,
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
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/dashboard/user-management", icon: Users },
  {
    label: "Product Management",
    icon: Box,
    submenu: [
      { label: "Overview", href: "/dashboard/product-management" },
      { label: "Add Product", href: "/dashboard/product-management/add-product" },
      { label: "Product List", href: "/dashboard/product-management/product-list" },
    ],
  },
  { label: "Order Management", href: "/dashboard/order-management", icon: ShoppingCart },
  {
    label: "Sales & Analytics",
    icon: LineChart,
    submenu: [
      { label: "Overview", href: "/dashboard/sales-analytics" },
      { label: "Reports", href: "/dashboard/sales-analytics/reports" },
      { label: "Insights", href: "/dashboard/sales-analytics/insights" },
    ],
  },
  { label: "Inventory Management", href: "/dashboard/inventory-management", icon: Package },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar: FC = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const isActive = (href?: string) => pathname === href;
  const isSubmenuActive = (submenu?: { href: string }[]) =>
    submenu?.some((item) => pathname === item.href) ?? false;

  const sidebarContent = (
    <>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <Link className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight" href="/">
            X-Mart
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <nav>
          <ul className="space-y-0.5">
            {menuItems.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                    href={item.href}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-sm ${
                      isSubmenuActive(item.submenu)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSubmenu(item.label)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleSubmenu(item.label); }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {openSubmenu === item.label ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  </div>
                )}
                {item.submenu && (openSubmenu === item.label || isSubmenuActive(item.submenu)) && (
                  <ul className="ml-8 lg:ml-10 space-y-0.5 mt-0.5 mb-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.label}>
                        <Link
                          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive(subItem.href)
                              ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30"
                              : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/30 dark:hover:bg-gray-700/50"
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
      <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200"
          href="/logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-72 bg-white dark:bg-gray-800 shadow-lg
          border-r border-gray-200 dark:border-gray-700
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
