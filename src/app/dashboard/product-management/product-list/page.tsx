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
import { DeleteIcon } from "lucide-react";
import { useState } from "react";

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

  // Explicitly type `sortOrder` as "asc" | "desc"
  const [options, setOptions] = useState<{
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc", // Ensure this is either "asc" or "desc"
  });

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useProducts(filters, options);
  const deleteProductMutation = useDeleteProduct();
  const removeDiscountMutation = useRemoveDiscount();

  // Access data and meta from the response
  const products = productsResponse?.data || [];
  const totalItems = productsResponse?.meta?.total || 0;
  const limit = productsResponse?.meta?.limit || options.limit;
  const totalPages = Math.ceil(totalItems / limit);

  console.log("Products Response:", productsResponse);
  console.log("Products:", products);
  console.log("Total Pages:", totalPages);

  const handleDeleteProduct = async (id: string) => {
    await deleteProductMutation.mutateAsync(id);
  };

  const handleRemoveDiscount = async (id: string) => {
    await removeDiscountMutation.mutateAsync(id);
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex gap-4">
            <Input
              placeholder="Search by name"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
            />
            {/* <Select
              label="Category"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <SelectItem value="ELECTRONICS">Electronics</SelectItem>
              <SelectItem value="CLOTHING">Clothing</SelectItem>
              <SelectItem value="FOOD">Food</SelectItem>
            </Select> */}
          </div>

          {/* Custom Product Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Sl.</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Loading state
                  Array.from({ length: options.limit }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-4 w-32 rounded-lg" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-4 w-20 rounded-lg" />
                      </td>
                      <td className="px-4 py-2">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  // Render actual data
                  products.map((product: TProduct, index: number) => (
                    <tr key={product._id} className="border-b border-gray-200">
                      <td className="px-4 py-2">
                        {/* Calculate SL number based on pagination */}
                        {(options.page - 1) * options.limit + index + 1}
                      </td>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">{product.stock}</td>
                      <td className="px-4 py-2">{product.status}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <EditProductModal product={product} />
                          <Tooltip content="Delete">
                            <Button
                              isIconOnly
                              color="danger"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <DeleteIcon />
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
                  // Empty state
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
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
