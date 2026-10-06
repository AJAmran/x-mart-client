"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { useUpdateUser } from "@/src/hooks/useUser";
import { useUserOrders } from "@/src/hooks/useOrder";
import { StatTile } from "@/src/components/dashboard/MetricCard";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS } from "@/src/types";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  KeyRound,
  LogOut,
  Mail,
  Package,
  Pencil,
  Phone,
  ShoppingBag,
} from "lucide-react";

/** Status → token, so the profile matches the dashboard and admin tables. */
const statusTone: Record<string, string> = {
  [ORDER_STATUS.PENDING]: "bg-warning/15 text-warning",
  [ORDER_STATUS.PROCESSING]: "bg-info/15 text-info",
  [ORDER_STATUS.SHIPPED]: "bg-primary/15 text-primary",
  [ORDER_STATUS.DELIVERED]: "bg-success/15 text-success",
  [ORDER_STATUS.CANCELLED]: "bg-danger/15 text-danger",
};
const statusFallback = "bg-surface-sunken text-content-muted";

const ACTIVE_STATUSES: string[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
];

type InfoRowProps = {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
};

/** Labeled detail row: icon chip + caption + value. */
function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-sunken text-content-subtle">
        <Icon aria-hidden size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-label-sm text-content-subtle">{label}</p>
        <div className="truncate text-body-sm font-medium text-content">
          {children}
        </div>
      </div>
    </div>
  );
}

const ProfilePage = () => {
  const { user, isLoading, setUser } = useUser();
  const router = useRouter();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: ordersRes, isLoading: ordersLoading } = useUserOrders();
  const [isEditing, setIsEditing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  });

  const orders = ordersRes?.data ?? [];

  /**
   * Lifetime spend counts only orders that can actually be collected, so
   * cancelled orders never inflate the figure. Mirrors the dashboard.
   */
  const billableOrders = orders.filter(
    (o) => o.status !== ORDER_STATUS.CANCELLED
  );
  const totalSpent = billableOrders.reduce(
    (sum, o) => sum + (o.totalPrice ?? 0),
    0
  );
  const activeCount = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  const statusBadgeClass = /active/i.test(user?.status || "active")
    ? "bg-success/15 text-success"
    : "bg-danger/15 text-danger";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "—";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      mobileNumber: user?.mobileNumber || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!user?._id) return;
    updateUser(
      { id: user._id, userData: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setUser({ ...user, ...formData });
        },
      }
    );
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading profile..." size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner label="Loading profile..." size="lg" />}>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="xm-animate-rise">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-brand">
            Account
          </p>
          <h1 className="mt-1 text-display-sm font-bold tracking-tight text-content">
            My profile
          </h1>
          <p className="mt-1 text-body-sm text-content-subtle">
            Manage your personal details and keep up with your orders.
          </p>
        </header>
        <div aria-hidden className="rule-brand mt-5 h-px w-full" />

        <div className="xm-stagger mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* ── Identity ─────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <section className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-sm">
              <div
                aria-hidden
                className="relative h-24 overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-lime-500 sm:h-28"
              >
                <span className="bloom -right-8 -top-10 size-44 bg-lime-300/50" />
                <span className="bloom -bottom-14 -left-6 size-44 bg-emerald-300/50" />
              </div>

              <div className="px-5 pb-5">
                <div className="flex items-end justify-between gap-3">
                  <div className="-mt-10 min-w-0">
                    <Image
                      alt={user.name}
                      className="size-20 rounded-full object-cover shadow-md ring-4 ring-surface-raised"
                      height={80}
                      src={user.profilePhoto || "/default-avatar.png"}
                      width={80}
                    />
                  </div>
                  {!isEditing && (
                    <Button
                      className="bg-surface-raised/90 text-content-muted shadow-sm backdrop-blur hover:bg-surface-raised"
                      size="sm"
                      startContent={<Pencil aria-hidden size={14} />}
                      variant="flat"
                      onPress={handleEdit}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                <h2 className="mt-3 truncate text-title-lg font-bold text-content">
                  {user.name}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-subtle px-2.5 py-0.5 text-label-sm font-semibold text-brand">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-label-sm font-semibold ${statusBadgeClass}`}
                  >
                    {user.status || "Active"}
                  </span>
                </div>

                <div className="mt-5 space-y-4 border-t border-line-hairline pt-5">
                  {isEditing ? (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label
                          className="text-label-sm font-medium text-content-subtle"
                          htmlFor="profile-name"
                        >
                          Name
                        </label>
                        <Input
                          id="profile-name"
                          name="name"
                          size="sm"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label
                          className="text-label-sm font-medium text-content-subtle"
                          htmlFor="profile-mobile"
                        >
                          Mobile number
                        </label>
                        <Input
                          id="profile-mobile"
                          name="mobileNumber"
                          size="sm"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoRow icon={Mail} label="Email">
                        {user.email}
                      </InfoRow>
                      <InfoRow icon={Phone} label="Mobile number">
                        {user.mobileNumber || "Not provided"}
                      </InfoRow>
                      <InfoRow icon={CalendarDays} label="Member since">
                        {memberSince}
                      </InfoRow>
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-5 flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      variant="flat"
                      onPress={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      color="primary"
                      size="sm"
                      isLoading={isUpdating}
                      onPress={handleSave}
                    >
                      Save changes
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* ── Security ─────────────────────────────────────────────── */}
            <section className="rounded-lg border border-line-hairline bg-surface-raised shadow-sm">
              <header className="border-b border-line-hairline px-5 py-3.5">
                <h2 className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
                  Security
                </h2>
              </header>
              <div className="space-y-1 p-2.5">
                <Link
                  className="group flex items-center gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-surface-sunken"
                  href="/auth/change-password"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-sunken text-content-subtle transition-colors group-hover:bg-surface-raised group-hover:text-content">
                    <KeyRound aria-hidden size={16} />
                  </span>
                  <span className="flex-1 text-body-sm font-medium text-content">
                    Change password
                  </span>
                  <ChevronRight
                    aria-hidden
                    size={15}
                    className="text-content-subtle transition-transform duration-fast group-hover:translate-x-0.5"
                  />
                </Link>
                <button
                  className="group flex w-full items-center gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-danger/10 disabled:cursor-not-allowed"
                  disabled={isSigningOut}
                  onClick={handleLogout}
                  type="button"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface-sunken text-content-subtle transition-colors group-hover:bg-danger/15 group-hover:text-danger">
                    {isSigningOut ? (
                      <Spinner size="sm" />
                    ) : (
                      <LogOut aria-hidden size={16} />
                    )}
                  </span>
                  <span className="flex-1 text-body-sm font-medium text-content">
                    Sign out
                  </span>
                </button>
              </div>
            </section>
          </div>

          {/* ── Orders ─────────────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatTile
                icon={Package}
                label="Total orders"
                loading={ordersLoading}
                tone="brand"
                value={formatNumber(orders.length)}
              />
              <StatTile
                icon={Clock}
                label="In progress"
                loading={ordersLoading}
                tone={activeCount > 0 ? "warning" : "neutral"}
                value={formatNumber(activeCount)}
              />
              <StatTile
                hint="Excludes cancelled"
                icon={ShoppingBag}
                label="Lifetime spend"
                loading={ordersLoading}
                tone="success"
                value={formatCurrency(totalSpent)}
              />
            </div>

            <section className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-sm">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-hairline px-5 py-4">
                <div>
                  <h2 className="text-title-md font-semibold text-content">
                    Your orders
                  </h2>
                  <p className="mt-0.5 text-label-sm text-content-subtle">
                    Track, review or cancel anything you have placed
                  </p>
                </div>
                {orders.length > 0 && (
                  <Link
                    className="shrink-0 text-label-sm font-semibold text-brand transition-colors hover:underline"
                    href="/orders"
                  >
                    View all orders
                  </Link>
                )}
              </header>

              <div className="p-5">
                {ordersLoading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="xm-skeleton h-12 w-full rounded-xs bg-surface-sunken"
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-surface-sunken text-content-subtle">
                      <ShoppingBag aria-hidden size={20} />
                    </span>
                    <p className="text-body-sm font-medium text-content">
                      No orders yet
                    </p>
                    <p className="max-w-sm text-label-sm text-content-subtle">
                      When you place an order it will show up here with its
                      status and tracking.
                    </p>
                    <Link
                      className="mt-1 inline-flex h-9 items-center rounded-sm bg-brand px-4 text-body-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-hover"
                      href="/shop"
                    >
                      Start shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-line-hairline">
                      {recentOrders.map((order) => (
                        <li key={order._id}>
                          <Link
                            className="flex items-center justify-between gap-4 rounded-md px-1.5 py-3.5 transition-colors hover:bg-surface-sunken"
                            href={`/orders/${order._id}`}
                          >
                            <div className="min-w-0">
                              <p className="tabular truncate text-body-sm font-medium text-content">
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="mt-0.5 text-label-sm text-content-subtle">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                                {" · "}
                                {order.items.length}{" "}
                                {order.items.length === 1 ? "item" : "items"}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  statusTone[order.status] ?? statusFallback
                                }`}
                              >
                                {order.status}
                              </span>
                              <span className="tabular text-body-sm font-semibold text-content">
                                {formatCurrency(order.totalPrice ?? 0)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {orders.length > recentOrders.length && (
                      <Link
                        className="mt-4 flex items-center justify-center gap-1.5 rounded-sm border border-line-hairline py-2.5 text-body-sm font-semibold text-brand transition-colors hover:border-brand/50 hover:bg-brand-subtle"
                        href="/orders"
                      >
                        View all {orders.length} orders
                      </Link>
                    )}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ProfilePage;
