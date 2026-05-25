"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Pagination } from "@heroui/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Package,
  AlertTriangle,
  SearchIcon,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import * as XLSX from "xlsx";
import { toast } from "sonner";

export default function InventoryManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

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
  const totalPages = Math.ceil(totalItems / 10);

  const lowStockCount = useMemo(
    () => (data?.data as TProduct[])?.filter((p) => (p.inventories?.[0]?.stock ?? 0) > 0 && (p.inventories?.[0]?.stock ?? 0) < 10).length || 0,
    [data]
  );
  const outOfStockCount = useMemo(
    () => (data?.data as TProduct[])?.filter((p) => (p.inventories?.[0]?.stock ?? 0) === 0).length || 0,
    [data]
  );
  const totalStock = useMemo(
    () => (data?.data as TProduct[])?.reduce((sum, p) => sum + (p.inventories?.[0]?.stock ?? 0), 0) || 0,
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
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `inventory_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Inventory report downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-sm text-default-500">Track and manage product stock levels</p>
        </div>
        <div className="flex gap-2">
          <Tooltip content="Download Report">
            <Button isIconOnly size="sm" variant="flat" onPress={downloadReport}>
              <Download className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Refresh">
            <Button isIconOnly size="sm" variant="flat" onPress={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-blue-500">Total Products</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1 rounded" />
                ) : (
                  <h3 className="text-2xl font-extrabold mt-1">{totalItems}</h3>
                )}
              </div>
              <div className="p-3 bg-blue-500 rounded-lg text-white"><Package className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-green-500/10 to-transparent">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-green-500">Total Stock</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1 rounded" />
                ) : (
                  <h3 className="text-2xl font-extrabold mt-1">{totalStock.toLocaleString()}</h3>
                )}
              </div>
              <div className="p-3 bg-green-500 rounded-lg text-white"><TrendingUp className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-yellow-500/10 to-transparent">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-yellow-500">Low Stock</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1 rounded" />
                ) : (
                  <h3 className="text-2xl font-extrabold mt-1">{lowStockCount}</h3>
                )}
              </div>
              <div className="p-3 bg-yellow-500 rounded-lg text-white"><AlertTriangle className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-red-500/10 to-transparent">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-red-500">Out of Stock</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1 rounded" />
                ) : (
                  <h3 className="text-2xl font-extrabold mt-1">{outOfStockCount}</h3>
                )}
              </div>
              <div className="p-3 bg-red-500 rounded-lg text-white"><TrendingDown className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              className="max-w-xs"
              placeholder="Search products..."
              startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <div className="flex gap-2">
              {(["all", "low", "out"] as const).map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={stockFilter === filter ? "solid" : "flat"}
                  color={stockFilter === filter ? "primary" : "default"}
                  onPress={() => { setStockFilter(filter); setPage(1); }}
                >
                  {filter === "all" ? "All" : filter === "low" ? "Low Stock" : "Out of Stock"}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto -mx-1">
          <Table
            aria-label="Inventory table"
            className="min-w-[500px]"
            classNames={{
              wrapper: "bg-transparent p-0 shadow-none",
              th: "bg-gray-100/50 dark:bg-gray-900/50 text-default-600",
            }}
            shadow="none"
          >
            <TableHeader>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>STOCK</TableColumn>
              <TableColumn>THRESHOLD</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="No products found"
              isLoading={isLoading}
              loadingContent={<Skeleton className="w-full h-40 rounded-xl" />}
            >
              {products.map((product: TProduct) => {
                const stock = product.inventories?.[0]?.stock ?? 0;
                const threshold = product.inventories?.[0]?.lowStockThreshold ?? 5;
                const isLow = stock > 0 && stock < 10;
                const isOut = stock === 0;

                return (
                  <TableRow key={product._id} className="border-b border-gray-100 dark:border-gray-800 last:border-none">
                    <TableCell>
                      <span className="font-semibold text-sm">{product.name}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" className="capitalize">{product.category}</Chip>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${isOut ? "text-red-500" : isLow ? "text-yellow-500" : "text-green-500"}`}>
                        {stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">{threshold}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={isOut ? "danger" : isLow ? "warning" : "success"}
                        size="sm"
                        variant="flat"
                        startContent={
                          isOut || isLow ? <AlertTriangle className="w-3 h-3" /> : undefined
                        }
                      >
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                      </Chip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination showControls color="primary" page={page} total={totalPages} variant="flat" onChange={setPage} />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
