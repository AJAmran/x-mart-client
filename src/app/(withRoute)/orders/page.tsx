"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useUserOrders, useCancelOrder } from "@/src/hooks/useOrder";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";
import { Container } from "@/src/components/UI/Container";
import { StatTile } from "@/src/components/dashboard/MetricCard";

/* ── Status presentation ──────────────────────────────────────────────────── */

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

/** A simple, readable substitute for the old emoji status icons. */
const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
      statusTone[status] ?? statusFallback
    }`}
  >
    {status}
  </span>
);

/* ── Tracking timeline ────────────────────────────────────────────────────── */

const TrackingTimeline = ({ order }: { order: TOrder }) => {
  if (!order.trackingHistory?.length) return null;

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {order.trackingHistory.map((entry, i) => (
        <li key={`${entry.status}-${i}`} className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`size-2 rounded-full ${
                entry.status === ORDER_STATUS.CANCELLED
                  ? "bg-danger"
                  : "bg-brand"
              }`}
            />
            <span className="text-label-sm text-content-muted">
              {entry.status.toLowerCase()}
            </span>
          </span>
          {i < order.trackingHistory.length - 1 && (
            <span aria-hidden className="hidden h-px w-4 bg-line-hairline sm:block" />
          )}
        </li>
      ))}
    </ol>
  );
};

/* ── Page ─────────────────────────────────────────────────────────────────── */

const OrderHistoryPage = () => {
  const { data, isLoading, error } = useUserOrders();
  const { mutate: cancelOrder, isPending } = useCancelOrder();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const orders = useMemo(() => data?.data ?? [], [data]);

  const { activeCount, deliveredCount, totalSpent } = useMemo(() => {
    // Cancelled orders are excluded from spend — that money was never taken.
    const billable = orders.filter((o) => o.status !== ORDER_STATUS.CANCELLED);

    return {
      activeCount: orders.filter((o) => ACTIVE_STATUSES.includes(o.status))
        .length,
      deliveredCount: orders.filter(
        (o) => o.status === ORDER_STATUS.DELIVERED
      ).length,
      totalSpent: billable.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0),
    };
  }, [orders]);

  const handleCancel = (orderId: string) => {
    setCancellingId(orderId);
    cancelOrder(orderId, {
      onSuccess: () => {
        toast.success("Order cancelled.");
      },
      onSettled: () => setCancellingId(null),
    });
  };

  /* ---- Loading ---- */
  if (isLoading) {
    return (
      <Container className="py-10">
        <div className="xm-skeleton h-9 w-48 rounded-xs bg-surface-sunken" />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="xm-skeleton h-20 rounded-md bg-surface-sunken"
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="xm-skeleton h-44 rounded-lg bg-surface-sunken"
            />
          ))}
        </div>
      </Container>
    );
  }

  /* ---- Error ---- */
  if (error) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-danger/15 text-danger">
            <XCircle aria-hidden size={22} />
          </span>
          <h1 className="text-title-lg font-bold text-content">
            Could not load your orders
          </h1>
          <p className="text-body-sm text-content-muted">
            Something went wrong on our side. Please try again.
          </p>
          <button
            className="mt-1 inline-flex h-9 items-center rounded-sm bg-brand px-4 text-body-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-hover"
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-bold text-content">
            Your orders
          </h1>
          <p className="mt-1.5 text-body-sm text-content-muted">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : `${formatNumber(orders.length)} ${
                  orders.length === 1 ? "order" : "orders"
                } placed`}
          </p>
        </div>

        {orders.length > 0 && (
          <Link
            className="inline-flex h-9 shrink-0 items-center rounded-sm border border-line-hairline px-4 text-body-sm font-semibold text-content transition-colors hover:border-brand/50 hover:text-brand"
            href="/shop"
          >
            Continue shopping
          </Link>
        )}
      </header>

      {/* ── Empty ---- */}
      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-hairline bg-surface-raised px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface-sunken text-content-subtle">
            <ShoppingBag aria-hidden size={24} />
          </span>
          <div>
            <h2 className="text-title-md font-semibold text-content">
              No orders yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-body-sm text-content-muted">
              When you place an order it will appear here with its status and
              tracking history.
            </p>
          </div>
          <Link
            className="mt-1 inline-flex h-10 items-center rounded-sm bg-brand px-5 text-body-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-hover"
            href="/shop"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          {/* ── Summary ---- */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile
              icon={ShoppingBag}
              label="Total orders"
              tone="brand"
              value={formatNumber(orders.length)}
            />
            <StatTile
              hint={activeCount > 0 ? "Awaiting delivery" : "Nothing pending"}
              icon={Package}
              label="In progress"
              tone={activeCount > 0 ? "warning" : "neutral"}
              value={formatNumber(activeCount)}
            />
            <StatTile
              hint="Excludes cancelled"
              icon={ShoppingBag}
              label="Lifetime spend"
              tone="success"
              value={formatCurrency(totalSpent)}
            />
          </div>

          {/* ── Order list ---- */}
          <div className="mt-6 flex flex-col gap-4">
            {orders.map((order: TOrder) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Head */}
                <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line-hairline px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="tabular text-body-sm font-semibold text-content">
                        #{order._id.slice(-8).toUpperCase()}
                      </h2>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-label-sm text-content-subtle">
                      Placed{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.paymentMethod === "ONLINE"
                        ? "Paid online"
                        : "Cash on delivery"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="tabular text-title-md font-bold text-content">
                      {formatCurrency(order.totalPrice ?? 0)}
                    </p>
                    <p className="mt-0.5 text-label-sm text-content-subtle">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </header>

                {/* Items */}
                <ul className="divide-y divide-line-hairline">
                  {order.items.map((item) => (
                    <li
                      key={`${order._id}-${item.productId}`}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <Link
                        className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-line-hairline bg-surface-sunken"
                        href={`/product/${item.productId}`}
                      >
                        <Image
                          fill
                          alt={item.name}
                          className="object-contain p-1"
                          sizes="64px"
                          src={item.image || "/placeholder.jpg"}
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          className="line-clamp-2 text-body-sm font-medium text-content transition-colors hover:text-brand"
                          href={`/product/${item.productId}`}
                        >
                          {item.name}
                        </Link>
                        <p className="tabular mt-1 text-label-sm text-content-subtle">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="tabular shrink-0 text-body-sm font-semibold text-content">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Tracking + actions */}
                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line-hairline bg-surface-sunken px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle">
                      Tracking
                    </p>
                    <div className="mt-1.5">
                      <TrackingTimeline order={order} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      className="inline-flex h-9 items-center rounded-sm border border-line-hairline bg-surface-raised px-3.5 text-body-sm font-semibold text-content transition-colors hover:border-brand/50 hover:text-brand"
                      href={`/orders/${order._id}`}
                    >
                      Details
                    </Link>

                    {order.status === ORDER_STATUS.PENDING && (
                      <button
                        className="inline-flex h-9 items-center rounded-sm border border-line-hairline bg-surface-raised px-3.5 text-body-sm font-semibold text-danger transition-colors hover:border-danger/50 disabled:opacity-50"
                        disabled={isPending}
                        type="button"
                        onClick={() => handleCancel(order._id)}
                      >
                        {cancellingId === order._id && isPending
                          ? "Cancelling…"
                          : "Cancel"}
                      </button>
                    )}
                  </div>
                </footer>

                {order.status === ORDER_STATUS.DELIVERED && (
                  <p className="border-t border-line-hairline px-5 py-3 text-label-sm text-content-subtle">
                    Delivered — {deliveredCount} order
                    {deliveredCount === 1 ? "" : "s"} completed so far.{" "}
                    <Link
                      className="font-semibold text-brand hover:underline"
                      href="/shop"
                    >
                      Order again
                    </Link>
                  </p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default OrderHistoryPage;