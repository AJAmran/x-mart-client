"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  Box,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/src/components/UI/Logo";
import { logout } from "@/src/services/AuthService";

/* ── Nav model ────────────────────────────────────────────────────────────── */

type SubItem = { label: string; href: string };
type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  submenu?: SubItem[];
};
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "User management", href: "/dashboard/user-management", icon: Users },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        icon: Box,
        submenu: [
          { label: "Overview", href: "/dashboard/product-management" },
          {
            label: "Product list",
            href: "/dashboard/product-management/product-list",
          },
          {
            label: "Add product",
            href: "/dashboard/product-management/add-product",
          },
        ],
      },
      { label: "Inventory", href: "/dashboard/inventory-management", icon: Package },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Orders", href: "/dashboard/order-management", icon: ShoppingCart },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        label: "Sales & analytics",
        icon: LineChart,
        submenu: [
          { label: "Overview", href: "/dashboard/sales-analytics" },
          { label: "Reports", href: "/dashboard/sales-analytics/reports" },
          { label: "Insights", href: "/dashboard/sales-analytics/insights" },
        ],
      },
    ],
  },
  {
    title: "Workspace",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

/* ── Sidebar ──────────────────────────────────────────────────────────────── */

export default function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close the mobile drawer on navigation.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleSubmenu = (label: string) =>
    setOpenSubmenu((prev) => (prev === label ? null : label));

  const isActive = (href?: string) => pathname === href;
  const isSubmenuActive = (submenu?: SubItem[]) =>
    submenu?.some((item) => pathname === item.href) ?? false;

  /** Sign-out is an action, not a route — it must not be a link. */
  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const content = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-5">
        <Link className="flex items-center" href="/">
          <Logo height={24} />
        </Link>
        <button
          aria-label="Close navigation menu"
          className="grid size-8 place-items-center rounded-md text-content-subtle transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-content lg:hidden"
          type="button"
          onClick={() => setMobileOpen(false)}
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>

      {/* Section label, shown only on mobile — it belongs to the drawer. */}
      <p className="px-5 pb-1 pt-4 text-overline font-bold uppercase tracking-[0.16em] text-content-subtle/80 lg:hidden">
        Navigation
      </p>

      {/* Nav */}
      <nav aria-label="Dashboard" className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3 lg:pt-4">
        <ul className="space-y-5">
          {navGroups.map((group) => (
            <li key={group.title}>
              <p className="px-3 pb-1.5 text-overline font-bold uppercase tracking-[0.16em] text-content-subtle/80">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const subActive = isSubmenuActive(item.submenu);
                  const subOpen =
                    openSubmenu === item.label || (subActive && !item.href);

                  if (item.href) {
                    return (
                      <li key={item.label}>
                        <Link
                          aria-current={active ? "page" : undefined}
                          className={clsx(
                            "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-medium transition-colors duration-fast ease-standard",
                            active
                              ? "bg-brand-subtle text-brand"
                              : "text-content-muted hover:bg-surface-sunken hover:text-content"
                          )}
                          href={item.href}
                        >
                          {active && (
                            <span
                              aria-hidden
                              className="absolute -left-3 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-brand"
                            />
                          )}
                          <Icon
                            aria-hidden
                            className={clsx(
                              "size-[18px] shrink-0 transition-colors",
                              active || subActive ? "text-brand" : "text-content-subtle group-hover:text-content"
                            )}
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label}>
                      <button
                        aria-expanded={subOpen}
                        className={clsx(
                          "group relative flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-body-sm font-medium transition-colors duration-fast ease-standard",
                          subActive
                            ? "text-content"
                            : "text-content-muted hover:bg-surface-sunken hover:text-content"
                        )}
                        type="button"
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            aria-hidden
                            className={clsx(
                              "size-[18px] shrink-0 transition-colors",
                              subActive ? "text-brand" : "text-content-subtle group-hover:text-content"
                            )}
                          />
                          {item.label}
                        </span>
                        <svg
                          aria-hidden
                          className={clsx(
                            "size-4 shrink-0 text-content-subtle transition-transform duration-base ease-standard",
                            subOpen && "rotate-180"
                          )}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="m6 9 6 6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.75}
                          />
                        </svg>
                      </button>

                      {subOpen && (
                        <ul className="mb-1 ml-[1.15rem] mt-1 space-y-0.5 border-l border-line-hairline pl-2.5">
                          {item.submenu?.map((sub) => {
                            const subActiveItem = isActive(sub.href);

                            return (
                              <li key={sub.href}>
                                <Link
                                  aria-current={subActiveItem ? "page" : undefined}
                                  className={clsx(
                                    "flex items-center rounded-md px-2.5 py-2 text-label-sm transition-colors duration-fast ease-standard",
                                    subActiveItem
                                      ? "font-semibold text-brand"
                                      : "text-content-subtle hover:bg-surface-sunken hover:text-content"
                                  )}
                                  href={sub.href}
                                >
                                  <span
                                    aria-hidden
                                    className={clsx(
                                      "mr-2 size-1 rounded-full transition-colors",
                                      subActiveItem ? "bg-brand" : "bg-line-strong"
                                    )}
                                  />
                                  {sub.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="space-y-3 border-t border-line-hairline px-5 py-4">
        <p className="flex items-center gap-2 text-label-sm text-content-subtle">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/50" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          All systems normal
        </p>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-md border border-danger/25 py-2.5 text-body-sm font-medium text-danger transition-colors duration-fast ease-standard hover:bg-danger/10"
          type="button"
          onClick={handleLogout}
        >
          <LogOut aria-hidden className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — sits inside the sticky top bar. */}
      <button
        aria-label="Open navigation menu"
        className="fixed left-3 top-3 z-overlay grid size-9 place-items-center rounded-md border border-line-hairline bg-surface-raised/95 text-content-muted shadow-sm backdrop-blur transition-colors duration-fast ease-standard hover:text-content lg:hidden"
        type="button"
        onClick={() => setMobileOpen(true)}
      >
        <Menu aria-hidden className="size-[18px]" />
      </button>

      {mobileOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-overlay bg-black/45 backdrop-blur-sm lg:hidden"
          type="button"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 z-modal flex h-dvh w-72 flex-col bg-surface-raised",
          "border-r border-line-hairline shadow-lg",
          "transition-transform duration-base ease-entrance",
          "lg:sticky lg:z-header lg:h-dvh lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {content}
      </aside>
    </>
  );
}
