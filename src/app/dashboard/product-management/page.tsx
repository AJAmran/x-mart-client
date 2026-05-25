"use client";

import { useMemo } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  List,
  TrendingUp,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";

export default function ProductManagementOverview() {
  const { data, isLoading } = useProducts({}, { limit: 1000, sortBy: "createdAt", sortOrder: "desc" });

  const stats = useMemo(() => {
    const products = data?.data || [];
    const total = products.length;
    const active = products.filter((p: any) => p.status === "ACTIVE").length;
    const lowStock = products.filter((p: any) => (p.inventories?.[0]?.stock ?? 0) > 0 && (p.inventories?.[0]?.stock ?? 0) < 10).length;
    const outOfStock = products.filter((p: any) => (p.inventories?.[0]?.stock ?? 0) === 0).length;
    const avgPrice = total > 0 ? products.reduce((s: number, p: any) => s + (p.price || 0), 0) / total : 0;
    return { total, active, lowStock, outOfStock, avgPrice };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-default-500">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button as={Link} color="primary" href="/dashboard/product-management/add-product" startContent={<PlusCircle className="w-4 h-4" />}>
            Add Product
          </Button>
          <Button as={Link} variant="flat" href="/dashboard/product-management/product-list" startContent={<List className="w-4 h-4" />}>
            Product List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm bg-gradient-to-br from-blue-500/10">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-blue-500">Total Products</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1 rounded" /> : <h3 className="text-2xl font-extrabold mt-1">{stats.total}</h3>}
              </div>
              <div className="p-3 bg-blue-500 rounded-lg text-white"><Package className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-green-500/10">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-green-500">Active</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1 rounded" /> : <h3 className="text-2xl font-extrabold mt-1">{stats.active}</h3>}
              </div>
              <div className="p-3 bg-green-500 rounded-lg text-white"><TrendingUp className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-yellow-500/10">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-yellow-500">Low Stock</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1 rounded" /> : <h3 className="text-2xl font-extrabold mt-1">{stats.lowStock}</h3>}
              </div>
              <div className="p-3 bg-yellow-500 rounded-lg text-white"><AlertTriangle className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm bg-gradient-to-br from-purple-500/10">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tiny uppercase font-bold text-purple-500">Avg Price</p>
                {isLoading ? <Skeleton className="h-8 w-24 mt-1 rounded" /> : <h3 className="text-2xl font-extrabold mt-1">৳{stats.avgPrice.toFixed(2)}</h3>}
              </div>
              <div className="p-3 bg-purple-500 rounded-lg text-white"><DollarSign className="w-5 h-5" /></div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
