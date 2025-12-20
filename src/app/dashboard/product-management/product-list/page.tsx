"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { DownloadIcon, SearchIcon } from "lucide-react";

import ApplyDiscountModal from "@/src/components/product/ApplyDiscountModal";
import EditProductModal from "@/src/components/product/EditProductModal";
import {
  useDeleteProduct,
  useProducts,
  useRemoveDiscount,
} from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { PRODUCT_CATEGORY } from "@/src/constants";
import { DeleteIcon } from "@/src/components/icons";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";

// Define types for filters and options
type ProductFilters = {
  searchTerm: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
  status: string;
};

type ProductOptions = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

// Utility to normalize category to uppercase
const normalizeCategory = (category: string): string =>
  category ? category.toUpperCase() : "";

export default function ProductListPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000000,
    minStock: 0,
    maxStock: 10000,
    status: "",
  });

  const [options, setOptions] = useState<ProductOptions>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Query for displayed products (paginated)
  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useProducts(
    { ...filters, category: normalizeCategory(filters.category) },
    options
  );

  // Query for all products (for downloads)
  const {
    data: allProductsResponse,
    isLoading: isAllProductsLoading,
  } = useProducts(
    { ...filters, category: normalizeCategory(filters.category) },
    {
      page: 1,
      limit: 10000,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  );

  const deleteProductMutation = useDeleteProduct();
  const removeDiscountMutation = useRemoveDiscount();

  const products = productsResponse?.data || [];
  const allProducts = allProductsResponse?.data || [];
  const totalItems = productsResponse?.meta?.total || 0;
  const limit = productsResponse?.meta?.limit || options.limit;
  const totalPages = Math.ceil(totalItems / limit);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleRemoveDiscount = async (id: string) => {
    try {
      await removeDiscountMutation.mutateAsync(id);
      toast.success("Discount removed successfully");
    } catch (err: any) {
      console.error("Failed to remove discount:", err);
      toast.error(err.message || "Failed to remove discount");
    }
  };

  const downloadExcel = () => {
    try {
      if (isAllProductsLoading) {
        toast.warning("Please wait, data is still loading...");

        return;
      }
      if (allProducts.length === 0) {
        toast.error("No products available to download");

        return;
      }

      const worksheetData = allProducts.map(
        (product: TProduct, index: number) => ({
          "Sl.": index + 1,
          Name: product.name,
          Price: product.price,
          Stock: product.inventories?.[0]?.stock ?? 0,
          Status: product.status ?? "N/A",
          Category: product.category ?? "N/A",
          Description: product.description ?? "N/A",
          "Discount Type": product.discount?.type || "N/A",
          "Discount Value": product.discount?.value || "N/A",
          "Created At": product.createdAt
            ? new Date(product.createdAt).toLocaleDateString()
            : "N/A",
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, `products_report_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel report downloaded successfully");
    } catch (err: any) {
      toast.error("Failed to download Excel report");
    }
  };

  const downloadPDF = () => {
    try {
      if (isAllProductsLoading) {
        toast.warning("Please wait, data is still loading...");

        return;
      }
      if (allProducts.length === 0) {
        toast.error("No products available to download");

        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("X-Mart Product Report", 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const tableData = allProducts.map((product: TProduct, index: number) => [
        index + 1,
        product.name,
        `$${product.price}`,
        product.inventories?.[0]?.stock ?? 0,
        product.status ?? "N/A",
        product.category ?? "N/A",
      ]);

      autoTable(doc, {
        head: [["Sl.", "Name", "Price", "Stock", "Status", "Category"]],
        body: tableData,
        startY: 40,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      doc.save(`products_report_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF report downloaded successfully");
    } catch (err: any) {
      toast.error("Failed to download PDF report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button
            color="primary"
            size="sm"
            startContent={<DownloadIcon className="w-4 h-4" />}
            variant="flat"
            onClick={downloadExcel}
          >
            Excel
          </Button>
          <Button
            color="primary"
            size="sm"
            startContent={<DownloadIcon className="w-4 h-4" />}
            variant="flat"
            onClick={downloadPDF}
          >
            PDF
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-none bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              className="max-w-xs"
              placeholder="Search products..."
              startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
            <select
              className="max-w-xs p-2 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {Object.values(PRODUCT_CATEGORY).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Table
            aria-label="Product list table"
            classNames={{
              wrapper: "bg-transparent p-0",
              th: "bg-gray-100/50 dark:bg-gray-900/50 text-default-600",
            }}
            shadow="none"
          >
            <TableHeader>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>STOCK</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn align="center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No products found."}
              isLoading={isLoading}
              loadingContent={<Skeleton className="w-full h-40 rounded-xl" />}
            >
              {products.map((product: TProduct) => (
                <TableRow key={product._id} className="border-b border-gray-100 dark:border-gray-800 last:border-none">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{product.name}</span>
                      <span className="text-tiny text-default-400 uppercase">{product.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={(product.inventories?.[0]?.stock ?? 0) < 10 ? "danger" : "success"}
                      size="sm"
                      variant="flat"
                    >
                      {product.inventories?.[0]?.stock ?? 0} in stock
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={product.status === "ACTIVE" ? "success" : "warning"}
                      size="sm"
                      variant="dot"
                    >
                      {product.status || "N/A"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <EditProductModal product={product} />
                      <Tooltip content="Delete Product">
                        <Button
                          isIconOnly
                          color="danger"
                          isDisabled={deleteProductMutation.isPending}
                          size="sm"
                          variant="light"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </Button>
                      </Tooltip>
                      <ApplyDiscountModal
                        product={product}
                        onRemoveDiscount={() => handleRemoveDiscount(product._id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isError && (
            <div className="text-red-500 text-center py-4">
              Error: {error?.message || "Failed to load products"}
            </div>
          )}

          <div className="flex justify-center mt-6">
            {totalPages > 1 && (
              <Pagination
                showControls
                color="primary"
                page={options.page}
                total={totalPages}
                variant="flat"
                onChange={(page) => setOptions({ ...options, page })}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
