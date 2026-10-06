"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Boxes,
  Download,
  Package,
  RefreshCw,
  SearchIcon,
  TrendingDown,
  TriangleAlert,
} from "lucide-react";

import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import { Panel, Toolbar, ToolbarGroup } from "@/src/components/dashboard/Panel";
import {
  MetricCard,
  metricGrid,
} from "@/src/components/dashboard/MetricCard";
import {
  StatusBadge,
  stockTone,
} from "@/src/components/dashboard/StatusBadge";
import {
  IconButton,
  SegmentTabs,
} from "@/src/components/dashboard/Controls";
import { useProducts } from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import { exportToCSV } from "@/src/utils/exportUtils";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { formatNumber } from "@/src/lib/productUtils";

type StockFilter = "all" | "low" | "out";

const stockOptions: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

export default function InventoryManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const { data, isLoading, refetch } = useProducts(
    { searchTerm: search },
    { page, limit: 10, sortBy: "createdAt", sortOrder: "desc" }
  );

  const products = useMemo(() => {
    if (!data?.data) return [];
    let items = [...data.data] as TProduct[];

    if (stockFilter === "low") {
      items = items.filter((p) => {
        const stock = p.inventories?.[0]?.stock ?? 0;

        return stock > 0 && stock < 10;
      });
    } else if (stockFilter === "out") {
      items = items.filter((p) => (p.inventories?.[0]?.stock ?? 0) === 0);
    }

    return items;
  }, [data, stockFilter]);

  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / 10));

  const lowStockCount = useMemo(
    () =>
      (data?.data as TProduct[])
        ?.filter(
          (p) =>
            (p.inventories?.[0]?.stock ?? 0) > 0 &&
            (p.inventories?.[0]?.stock ?? 0) < 10
        )
        .length || 0,
    [data]
  );
  const outOfStockCount = useMemo(
    () =>
      (data?.data as TProduct[])
        ?.filter((p) => (p.inventories?.[0]?.stock ?? 0) === 0)
        .length || 0,
    [data]
  );
  const totalStock = useMemo(
    () =>
      (data?.data as TProduct[])?.reduce(
        (sum, p) => sum + (p.inventories?.[0]?.stock ?? 0),
        0
      ) || 0,
    [data]
  );

  const downloadReport = () => {
    if (!products.length) {
      toast.error("No products to export");

      return;
    }
    const wsData = products.map((p: TProduct, i: number) => ({
      "#": i + 1,
      Name: p.name,
      Category: p.category,
      Stock: p.inventories?.[0]?.stock ?? 0,
      "Low Stock Threshold": p.inventories?.[0]?.lowStockThreshold ?? 5,
      Status: p.status,
      Price: p.price,
    }));

    exportToCSV(
      wsData,
      `inventory_${new Date().toISOString().split("T")[0]}`
    );
    toast.success("Inventory report downloaded");
  };

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            <IconButton label="Download report" onClick={downloadReport}>
              <Download className="size-4" />
            </IconButton>
            <IconButton label="Refresh inventory" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
          </div>
        }
        description="Track stock levels and spot products that need restocking."
        eyebrow="Inventory"
        title="Inventory management"
      />

      <Container className="py-6 sm:py-8">
        {/* KPI row */}
        <div className={metricGrid}>
          <MetricCard
            hint="In the catalogue"
            icon={Package}
            label="Total products"
            loading={isLoading}
            tone="brand"
            value={formatNumber(totalItems)}
          />
          <MetricCard
            hint="Units across all products"
            icon={Boxes}
            label="Total stock"
            loading={isLoading}
            tone="neutral"
            value={formatNumber(totalStock)}
          />
          <MetricCard
            hint="Below the reorder threshold"
            icon={TriangleAlert}
            label="Low stock"
            loading={isLoading}
            tone="warning"
            value={formatNumber(lowStockCount)}
          />
          <MetricCard
            hint="Need restocking now"
            icon={TrendingDown}
            label="Out of stock"
            loading={isLoading}
            tone="danger"
            value={formatNumber(outOfStockCount)}
          />
        </div>

        {/* Table */}
        <Panel
          bodyClassName="p-0"
          className="mt-5"
          description="Current stock position per product."
          title="Stock levels"
        >
          <div className="border-b border-line-hairline px-5 py-4">
            <Toolbar>
              <div className="relative w-full max-w-xs">
                <label className="sr-only" htmlFor="inventory-search">
                  Search products
                </label>
                <SearchIcon
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-subtle"
                />
                <input
                  className="h-9 w-full rounded-md border border-line-hairline bg-surface-sunken pl-9 pr-3 text-body-sm text-content transition-colors duration-fast ease-standard placeholder:text-content-subtle hover:border-line-strong focus:border-brand focus:outline-none"
                  id="inventory-search"
                  placeholder="Search products…"
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <ToolbarGroup className="md:ml-auto">
                <SegmentTabs
                  label="Stock filter"
                  options={stockOptions}
                  value={stockFilter}
                  onChange={(value) => {
                    setPage(1);
                    setStockFilter(value);
                  }}
                />
              </ToolbarGroup>
            </Toolbar>
          </div>

          <div className="overflow-x-auto">
            <Table
              aria-label="Inventory table"
              classNames={{
                th: "text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle",
              }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Category
                </TableColumn>
                <TableColumn>Stock</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  Threshold
                </TableColumn>
                <TableColumn>Status</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
                      <Package aria-hidden size={20} />
                    </span>
                    <p className="text-body-sm font-medium text-content">
                      No products found
                    </p>
                    <p className="max-w-sm text-label-sm text-content-subtle">
                      Adjust the search or stock filter to see inventory.
                    </p>
                  </div>
                }
                isLoading={isLoading}
              >
                {products.map((product: TProduct) => {
                  const stock = product.inventories?.[0]?.stock ?? 0;
                  const threshold =
                    product.inventories?.[0]?.lowStockThreshold ?? 5;
                  const isLow = stock > 0 && stock < 10;
                  const isOut = stock === 0;

                  return (
                    <TableRow
                      key={product._id}
                      className="transition-colors duration-fast hover:bg-surface-sunken/60"
                    >
                      <TableCell>
                        <span className="text-body-sm font-semibold text-content">
                          {product.name}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <StatusBadge tone="neutral">
                          {product.category}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            "tabular text-body-sm font-bold " +
                            (isOut
                              ? "text-danger"
                              : isLow
                                ? "text-warning"
                                : "text-success")
                          }
                        >
                          {stock}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="tabular text-body-sm text-content-muted">
                          {threshold}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge dot tone={stockTone(stock)}>
                          {isOut
                            ? "Out of stock"
                            : isLow
                              ? "Low stock"
                              : "In stock"}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-line-hairline px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="tabular text-label-sm text-content-subtle">
                Page {page} of {totalPages}
              </p>
              <Pagination
                showControls
                color="primary"
                page={page}
                total={totalPages}
                variant="flat"
                onChange={setPage}
              />
            </div>
          )}
        </Panel>
      </Container>
    </>
  );
}
