import { TDiscount, TProduct } from "@/src/types";

export const formatCurrency = (value: number) => `Tk ${value.toFixed(2)}`;

export const getProductStock = (product?: Partial<TProduct>) => {
  if (!product) return 0;
  if (typeof product.stock === "number") return product.stock;

  return (product.inventories || []).reduce(
    (sum, inventory) => sum + (inventory.stock || 0),
    0
  );
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

export const getDiscountLabel = (discount?: TDiscount) => {
  if (!discount?.value) return "";

  return discount.type === "fixed"
    ? `${formatCurrency(discount.value)} OFF`
    : `${discount.value}% OFF`;
};
