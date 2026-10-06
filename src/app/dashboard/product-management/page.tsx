"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Package,
  Plus,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import {
  MetricCard,
  metricGrid,
  type MetricTone,
} from "@/src/components/dashboard/MetricCard";
import { useProducts } from "@/src/hooks/useProducts";
import { formatCurrency, formatNumber } from "@/src/lib/productUtils";

const quickLinks = [
  {
    title: "Product list",
    description: "Browse, search, and manage every item in the catalogue.",
    href: "/dashboard/product-management/product-list",
    icon: Boxes,
  },
  {
    title: "Add product",
    description: "Create a new product entry with stock and pricing.",
    href: "/dashboard/product-management/add-product",
    icon: Plus,
  },
];

export default function ProductManagementOverview() {
  const { data, isLoading } = useProducts(
    {},
    { limit: 1000, sortBy: "createdAt", sortOrder: "desc" }
  );

  const stats = useMemo(() => {
    const products = data?.data || [];
    const total = products.length;
    const active = products.filter((p: any) => p.status === "ACTIVE").length;
    const lowStock = products.filter(
      (p: any) =>
        (p.inventories?.[0]?.stock ?? 0) > 0 &&
        (p.inventories?.[0]?.stock ?? 0) < 10
    ).length;
    const outOfStock = products.filter(
      (p: any) => (p.inventories?.[0]?.stock ?? 0) === 0
    ).length;
    const totalValue = products.reduce(
      (s: number, p: any) => s + (p.price || 0),
      0
    );
    const avgPrice = total > 0 ? totalValue / total : 0;

    return { total, active, lowStock, outOfStock, avgPrice };
  }, [data]);

  const cards: {
    label: string;
    value: string;
    icon: any;
    tone: MetricTone;
    hint: string;
  }[] = [
    {
      label: "Total products",
      value: formatNumber(stats.total),
      icon: Package,
      tone: "brand",
      hint: "Across the whole catalogue",
    },
    {
      label: "Active listings",
      value: formatNumber(stats.active),
      icon: TrendingUp,
      tone: "success",
      hint: "Currently visible to shoppers",
    },
    {
      label: "Low stock",
      value: formatNumber(stats.lowStock),
      icon: TriangleAlert,
      tone: "warning",
      hint: "Below the reorder threshold",
    },
    {
      label: "Average price",
      value: formatCurrency(stats.avgPrice),
      icon: CircleDollarSign,
      tone: "neutral",
      hint: "Mean list price per product",
    },
  ];

  return (
    <>
      <PageHeader
        description="Manage your product catalogue — listings, stock, and pricing."
        eyebrow="Product management"
        title="Catalogue"
      />

      <Container className="py-8">
        {/* KPI row */}
        <div className={metricGrid}>
          {cards.map((card) => (
            <MetricCard
              key={card.label}
              hint={card.hint}
              icon={card.icon}
              label={card.label}
              loading={isLoading}
              tone={card.tone}
              value={card.value}
            />
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              className="group relative flex items-start gap-4 overflow-hidden rounded-lg border border-line-hairline bg-surface-raised p-5 shadow-xs transition-all duration-base ease-standard hover:-translate-y-0.5 hover:shadow-md"
              href={link.href}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand transition-transform duration-base ease-standard group-hover:scale-105">
                <link.icon aria-hidden size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-title-md font-semibold text-content">
                  {link.title}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 text-content-subtle opacity-0 transition-all duration-fast group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </p>
                <p className="mt-1 text-label-sm text-content-subtle">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
