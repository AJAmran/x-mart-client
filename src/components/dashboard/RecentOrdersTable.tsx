"use client";

import NextLink from "next/link";
import { Receipt } from "lucide-react";

import { StatusBadge, orderStatusTone } from "./StatusBadge";
import { Panel } from "./Panel";
import { formatCurrency } from "@/src/lib/productUtils";
import { ORDER_STATUS, type TOrder } from "@/src/types";

/**
 * The six most recent orders, newest first.
 */
export function RecentOrdersTable({
  orders,
  loading,
}: {
  orders: TOrder[];
  loading: boolean;
}) {
  return (
    <Panel
      action={
        <NextLink
          className="text-label-sm font-semibold text-brand hover:underline"
          href="/dashboard/order-management"
        >
          View all
        </NextLink>
      }
      bodyClassName="p-0"
      className="xl:col-span-2"
      description="The six most recent, newest first"
      empty={orders.length === 0}
      emptyDescription="Orders placed on the storefront will appear here for fulfilment."
      emptyIcon={Receipt}
      loading={loading}
      title="Recent orders"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line-hairline">
              {[
                "Order",
                "Customer",
                "Status",
                "Payment",
                "Placed",
                "Total",
              ].map((heading, i) => (
                <th
                  key={heading}
                  className={[
                    "px-5 py-3 text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle",
                    i >= 3 ? "text-right" : "",
                  ].join(" ")}
                  scope="col"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-line-hairline transition-colors duration-fast last:border-0 hover:bg-surface-sunken/60"
              >
                <td className="tabular px-5 py-3.5 text-body-sm font-medium text-content">
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-5 py-3.5 text-body-sm text-content-muted">
                  {order.shippingInfo?.name ?? "—"}
                  <span className="block text-label-sm text-content-subtle">
                    {order.shippingInfo?.city ?? ""}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge dot tone={orderStatusTone(order.status)}>
                    {order.status ?? ORDER_STATUS.PENDING}
                  </StatusBadge>
                </td>
                <td className="px-5 py-3.5 text-right text-label-sm text-content-muted">
                  {order.paymentMethod === "ONLINE" ? "Online" : "Cash"}
                </td>
                <td className="tabular px-5 py-3.5 text-right text-body-sm text-content-muted">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="tabular px-5 py-3.5 text-right text-body-sm font-semibold text-content">
                  {formatCurrency(order.totalPrice ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
