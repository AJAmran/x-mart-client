"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Boxes, FileSpreadsheet, FileText, SearchIcon } from "lucide-react";

import ApplyDiscountModal from "@/src/components/product/ApplyDiscountModal";
import EditProductModal from "@/src/components/product/EditProductModal";
import { DeleteIcon } from "@/src/components/icons";
import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import {
  StatusBadge,
  productStatusTone,
  stockTone,
} from "@/src/components/dashboard/StatusBadge";
import { IconButton } from "@/src/components/dashboard/Controls";
import {
  Panel,
  Toolbar,
  ToolbarGroup,
} from "@/src/components/dashboard/Panel";
import {
  useDeleteProduct,
  useProducts,
  useRemoveDiscount,
} from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import { exportToCSV, exportToPDF } from "@/src/utils/exportUtils";
import { Pagination } from "@heroui/pagination";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { PRODUCT_CATEGORY, PRODUCT_STATUS } from "@/src/constants";
import { formatCurrency } from "@/src/lib/productUtils";

type ProductFilters = {
  searchTerm: string;
  category: string;
  status: string;
};

type ProductOptions = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const normalizeCategory = (category: string): string =>
  category ? category.toUpperCase() : "";

export default function ProductListPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    category: "",
    status: "",
  });

  const [options, setOptions] = useState<ProductOptions>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: productsResponse, isLoading, isError, error } = useProducts(
    {
      ...filters,
      category: normalizeCategory(filters.category),
      status: filters.status || undefined,
    },
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
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
    }
  };

  const handleRemoveDiscount = async (id: string) => {
    try {
      await removeDiscountMutation.mutateAsync(id);
      toast.success("Discount removed successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove discount");
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

      const worksheetData = allProducts.map((product: TProduct, index: number) => ({
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
      }));

      exportToCSV(
        worksheetData,
        `products_report_${new Date().toISOString().split("T")[0]}`
      );
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to download report");
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
      exportToPDF([], "products");
      toast.success("PDF dialog opened — use the print menu to save as PDF");
    } catch {
      toast.error("Failed to open PDF export");
    }
  };

  return (
    <>
      <PageHeader
        description="Every product in the catalogue, with stock and pricing."
        eyebrow="Catalog"
        title="Product list"
      />
      <Container className="py-6 sm:py-8">
        <Panel
          action={
            <>
              <IconButton label="Export to Excel" onClick={downloadExcel}>
                <FileSpreadsheet className="size-4" />
              </IconButton>
              <IconButton label="Export to PDF" onClick={downloadPDF}>
                <FileText className="size-4" />
              </IconButton>
            </>
          }
          bodyClassName="p-0"
          description="Browse, search, and manage every item in the catalogue."
          title="Products"
        >
          {/* Toolbar */}
          <div className="border-b border-line-hairline px-5 py-4">
            <Toolbar>
              <div className="relative w-full max-w-xs">
                <label className="sr-only" htmlFor="product-search">
                  Search products
                </label>
                <SearchIcon
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-subtle"
                />
                <input
                  className="h-9 w-full rounded-md border border-line-hairline bg-surface-sunken pl-9 pr-3 text-body-sm text-content transition-colors duration-fast ease-standard placeholder:text-content-subtle hover:border-line-strong focus:border-brand focus:outline-none"
                  id="product-search"
                  placeholder="Search products…"
                  type="search"
                  value={filters.searchTerm}
                  onChange={(e) => {
                    setOptions((prev) => ({ ...prev, page: 1 }));
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }));
                  }}
                />
              </div>
              <ToolbarGroup>
                <Select
                  aria-label="Category"
                  className="w-44"
                  placeholder="All categories"
                  selectedKeys={filters.category ? [filters.category] : []}
                  size="sm"
                  variant="bordered"
                  onChange={(e) => {
                    setOptions((prev) => ({ ...prev, page: 1 }));
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }));
                  }}
                >
                  {Object.values(PRODUCT_CATEGORY).map((cat) => (
                    <SelectItem key={cat}>{cat}</SelectItem>
                  ))}
                </Select>
                <Select
                  aria-label="Status"
                  className="w-44"
                  placeholder="All statuses"
                  selectedKeys={filters.status ? [filters.status] : []}
                  size="sm"
                  variant="bordered"
                  onChange={(e) => {
                    setOptions((prev) => ({ ...prev, page: 1 }));
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                >
                  {Object.values(PRODUCT_STATUS).map((status) => (
                    <SelectItem key={status}>{status}</SelectItem>
                  ))}
                </Select>
              </ToolbarGroup>
            </Toolbar>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table
              aria-label="Product list table"
              classNames={{
                th: "text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle",
              }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Stock</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn align="end">Actions</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
                      <Boxes aria-hidden size={20} />
                    </span>
                    <p className="text-body-sm font-medium text-content">
                      No products found
                    </p>
                    <p className="max-w-sm text-label-sm text-content-subtle">
                      Try adjusting your filters, or add a new product to the
                      catalogue.
                    </p>
                  </div>
                }
                isLoading={isLoading}
              >
                {products.map((product: TProduct) => {
                  const stock = product.inventories?.[0]?.stock ?? 0;

                  return (
                    <TableRow
                      key={product._id}
                      className="transition-colors duration-fast hover:bg-surface-sunken/60"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-body-sm font-semibold text-content">
                            {product.name}
                          </span>
                          <span className="text-label-sm capitalize text-content-subtle">
                            {product.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="tabular text-body-sm font-semibold text-content">
                          {formatCurrency(product.price)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge dot tone={stockTone(stock)}>
                          {stock} in stock
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          dot
                          tone={productStatusTone(product.status)}
                        >
                          {product.status || "—"}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          <EditProductModal product={product} />
                          <Tooltip content="Delete Product">
                            <Button
                              color="danger"
                              isDisabled={deleteProductMutation.isPending}
                              size="sm"
                              variant="light"
                              onClick={() =>
                                handleDeleteProduct(product._id)
                              }
                            >
                              <DeleteIcon className="size-4" />
                            </Button>
                          </Tooltip>
                          <ApplyDiscountModal
                            product={product}
                            onRemoveDiscount={() =>
                              handleRemoveDiscount(product._id)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {isError && (
            <p className="border-t border-line-hairline px-5 py-3 text-label-sm text-danger">
              {error?.message || "Failed to load products"}
            </p>
          )}

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-line-hairline px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="tabular text-label-sm text-content-subtle">
              {totalItems} {totalItems === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="tabular text-label-sm text-content-subtle">
                Page {options.page} of {totalPages}
              </p>
              <Pagination
                showControls
                color="primary"
                page={options.page}
                total={totalPages}
                variant="flat"
                onChange={(page) => setOptions({ ...options, page })}
              />
            </div>
          </div>
        </Panel>
      </Container>
    </>
  );
}
