"use client";

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
import { DeleteIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function ProductListPage() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    minPrice: 0,
    maxPrice: 1000000,
    minStock: 0,
    maxStock: 10000,
    status: "",
  });

  const [options, setOptions] = useState<{
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
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
  } = useProducts(filters, options);

  // Query for all products (for downloads)
  const {
    data: allProductsResponse,
    isLoading: isAllProductsLoading,
    isError: isAllProductsError,
  } = useProducts(filters, {
    page: 1,
    limit: 10000, // Large limit to fetch all products
    sortBy: "createdAt",
    sortOrder: "desc",
  });

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
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleRemoveDiscount = async (id: string) => {
    try {
      await removeDiscountMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to remove discount:", err);
      toast.error("Failed to remove discount");
    }
  };

  // Function to download products as Excel
  const downloadExcel = () => {
    try {
      if (isAllProductsLoading) {
        toast.warning("Please wait, data is still loading...");
        return;
      }
      if (isAllProductsError || allProducts.length === 0) {
        toast.error("No products available to download");
        return;
      }

      const worksheetData = allProducts.map(
        (product: TProduct, index: number) => ({
          "Sl.": index + 1,
          Name: product.name,
          Price: product.price,
          Stock: product.stock,
          Status: product.status,
          Category: product.category,
          Description: product.description,
          "Discount Type": product.discount?.type || "N/A",
          "Discount Value": product.discount?.value || "N/A",
          "Created At": new Date(product.createdAt).toLocaleDateString(),
          "Updated At": new Date(product.updatedAt).toLocaleDateString(),
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(
        workbook,
        `products_report_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Excel report downloaded successfully");
    } catch (err) {
      console.error("Failed to download Excel:", err);
      toast.error("Failed to download Excel report");
    }
  };

  // Function to download products as PDF
  const downloadPDF = () => {
    try {
      if (isAllProductsLoading) {
        toast.warning("Please wait, data is still loading...");
        return;
      }
      if (isAllProductsError || allProducts.length === 0) {
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
        product.stock,
        product.status,
        product.category,
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
    } catch (err) {
      console.error("Failed to download PDF:", err);
      toast.error("Failed to download PDF report");
    }
  };

  return (
    <Card className="shadow-lg">
      <CardBody className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Filters and Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-4 w-full sm:w-auto">
              <Input
                placeholder="Search by name"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                className="max-w-xs"
              />
            </div>
            <div className="flex gap-2">
              <Tooltip content="Download all products as Excel">
                <Button
                  color="primary"
                  variant="flat"
                  onClick={downloadExcel}
                  isDisabled={isAllProductsLoading || allProducts.length === 0}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Excel
                </Button>
              </Tooltip>
              <Tooltip content="Download all products as PDF">
                <Button
                  color="primary"
                  variant="flat"
                  onClick={downloadPDF}
                  isDisabled={isAllProductsLoading || allProducts.length === 0}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="w-4 h-4" />
                  PDF
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Sl.
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: options.limit }).map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-12 rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map((product: TProduct, index: number) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {(options.page - 1) * options.limit + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                        {product.status}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <EditProductModal product={product} />
                          <Tooltip content="Delete">
                            <Button
                              isIconOnly
                              color="danger"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                          <ApplyDiscountModal
                            product={product}
                            onRemoveDiscount={() =>
                              handleRemoveDiscount(product._id)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {isLoading ? (
              <Skeleton className="h-10 w-64 rounded-lg" />
            ) : totalPages > 1 ? (
              <Pagination
                total={totalPages}
                page={options.page}
                onChange={(page) => setOptions({ ...options, page })}
              />
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
