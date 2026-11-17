"use client";

import React, { useRef, memo } from "react";
import dynamic from "next/dynamic";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Boxes } from "lucide-react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";

import { DeleteIcon } from "@/src/components/icons";
import {
  StatusBadge,
  productStatusTone,
  stockTone,
} from "@/src/components/dashboard/StatusBadge";
import { formatCurrency } from "@/src/lib/productUtils";
import { TProduct } from "@/src/types";

// Lazy-load heavy modals so they are only fetched when interacting
const EditProductModal = dynamic(
  () => import("@/src/components/product/EditProductModal"),
  { ssr: false }
);

const ApplyDiscountModal = dynamic(
  () => import("@/src/components/product/ApplyDiscountModal"),
  { ssr: false }
);

interface VirtualizedProductTableProps {
  products: TProduct[];
  isLoading?: boolean;
  onDeleteProduct: (id: string) => void;
  onRemoveDiscount: (id: string) => void;
  isDeleting?: boolean;
}

// Memoized single row component to prevent re-rendering unaffected rows
const ProductVirtualRow = memo(function ProductVirtualRow({
  product,
  onDeleteProduct,
  onRemoveDiscount,
  isDeleting,
  style,
}: {
  product: TProduct;
  onDeleteProduct: (id: string) => void;
  onRemoveDiscount: (id: string) => void;
  isDeleting?: boolean;
  style: React.CSSProperties;
}) {
  const stock = product.inventories?.[0]?.stock ?? 0;

  return (
    <div
      style={style}
      className="grid grid-cols-12 items-center gap-4 border-b border-line-hairline px-5 text-body-sm transition-colors duration-fast hover:bg-surface-sunken/60"
    >
      {/* Product Name & Category */}
      <div className="col-span-4 flex flex-col justify-center min-w-0 pr-2">
        <span className="truncate font-semibold text-content" title={product.name}>
          {product.name}
        </span>
        <span className="truncate text-label-sm capitalize text-content-subtle">
          {product.category || "Uncategorized"}
        </span>
      </div>

      {/* Price */}
      <div className="col-span-2">
        <span className="tabular font-semibold text-content">
          {formatCurrency(product.price)}
        </span>
      </div>

      {/* Stock */}
      <div className="col-span-2">
        <StatusBadge dot tone={stockTone(stock)}>
          {stock} in stock
        </StatusBadge>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <StatusBadge dot tone={productStatusTone(product.status)}>
          {product.status || "—"}
        </StatusBadge>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-1">
        <EditProductModal product={product} />
        <Tooltip content="Delete Product">
          <Button
            isIconOnly
            color="danger"
            isDisabled={isDeleting}
            size="sm"
            variant="light"
            onClick={() => onDeleteProduct(product._id)}
          >
            <DeleteIcon className="size-4" />
          </Button>
        </Tooltip>
        <ApplyDiscountModal
          product={product}
          onRemoveDiscount={() => onRemoveDiscount(product._id)}
        />
      </div>
    </div>
  );
});

export const VirtualizedProductTable = memo(function VirtualizedProductTable({
  products,
  isLoading,
  onDeleteProduct,
  onRemoveDiscount,
  isDeleting,
}: VirtualizedProductTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // 64px standard row height
    overscan: 8, // keep 8 items outside viewport to guarantee zero scroll flicker
  });

  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-3 border-brand border-t-transparent" />
        <p className="text-body-sm text-content-subtle">Loading products…</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
          <Boxes aria-hidden size={20} />
        </span>
        <p className="text-body-sm font-medium text-content">No products found</p>
        <p className="max-w-sm text-label-sm text-content-subtle">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sticky Table Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-line-hairline bg-surface-raised px-5 py-3 text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle">
        <div className="col-span-4">Product</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Stock</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Virtualized Scrollable Viewport */}
      <div
        ref={parentRef}
        className="h-[520px] overflow-auto scrollbar-thin divide-y divide-line-hairline"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const product = products[virtualRow.index];
            if (!product) return null;

            return (
              <ProductVirtualRow
                key={product._id || virtualRow.key}
                isDeleting={isDeleting}
                product={product}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onDeleteProduct={onDeleteProduct}
                onRemoveDiscount={onRemoveDiscount}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default VirtualizedProductTable;
