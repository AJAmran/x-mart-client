import { TDiscount, TProduct } from "@/src/types";

export const formatCurrency = (value: number) => `Tk ${value.toFixed(2)}`;

export const formatCurrencyCompact = (value: number) =>
  `Tk ${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** Thousands separators, for analytics figures and order totals. */
export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-BD").format(value);

export const getProductStock = (product?: Partial<TProduct>): number => {
  if (!product) return 0;

  const inventories = product.inventories ?? [];

  if (inventories.length > 0) {
    return inventories.reduce((sum, inventory) => {
      const qty = inventory?.stock;

      return sum + (typeof qty === "number" && Number.isFinite(qty) && qty > 0 ? qty : 0);
    }, 0);
  }

  const fallback = product.stock;

  return typeof fallback === "number" && Number.isFinite(fallback) && fallback > 0
    ? fallback
    : 0;
};

export const getStockStatus = (stock: number) => {
  if (stock <= 0) {
    return {
      color: "danger" as const,
      label: "Out of stock",
      tone: "text-danger",
      canAddToCart: false,
    };
  }

  if (stock <= 10) {
    return {
      color: "warning" as const,
      label: `Only ${stock} left`,
      tone: "text-warning",
      canAddToCart: true,
    };
  }

  return {
    color: "success" as const,
    label: "In stock",
    tone: "text-success",
    canAddToCart: true,
  };
};

export const getDiscountedPrice = (price: number, discount?: TDiscount) => {
  if (!discount?.value) return price;

  if (discount.type === "fixed") {
    return Math.max(price - discount.value, 0);
  }

  return Math.max(price * (1 - discount.value / 100), 0);
};

export const getDiscountLabel = (discount?: TDiscount, originalPrice?: number) => {
  if (!discount?.value) return "";

  if (discount.type === "fixed") {
    if (originalPrice && originalPrice > discount.value) {
      const percent = Math.round((discount.value / originalPrice) * 100);

      if (percent > 0) return `${percent}% off`;
    }
    
    return `${formatCurrencyCompact(discount.value)} off`;
  }

  return `${discount.value}% off`;
};
