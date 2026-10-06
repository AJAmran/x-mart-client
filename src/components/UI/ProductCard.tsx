"use client";

import { useCallback, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Heart, Plus, Tag } from "lucide-react";

import { Spinner } from "@heroui/spinner";

import { useCart } from "@/src/hooks/useCart";
import { useWishlist } from "@/src/hooks/useWishlist";
import {
  formatCurrency,
  getDiscountedPrice,
  getDiscountLabel,
  getProductStock,
  getStockStatus,
} from "@/src/lib/productUtils";
import { TProduct } from "@/src/types";

type ProductCardProps = {
  product: TProduct;
  variant?: "default" | "category";
  onPress?: () => void;
  priority?: boolean;
};

export function ProductCard({
  product,
  variant = "default",
  onPress,
  priority = false,
}: ProductCardProps) {
  const [pending, setPending] = useState<"cart" | "wishlist" | null>(null);
  const headingId = `product-${useId()}`;
  const { addItem, isInCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const stock = getProductStock(product);
  const { canAddToCart } = getStockStatus(stock);
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = finalPrice < product.price;
  const inCart = Boolean(product._id) && isInCart(product._id as string);
  const wishlisted =
    Boolean(product._id) && isInWishlist(product._id as string);
  const outOfStock = !canAddToCart;
  const lowStock = canAddToCart && stock <= 5;

  const handleAddToCart = useCallback(() => {
    if (!product._id) return;
    if (outOfStock) {
      toast.error(`${product.name} is out of stock.`);

      return;
    }

    setPending("cart");
    addItem({
      productId: product._id as string,
      quantity: 1,
      price: finalPrice,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
      stock,
    });
    toast.success(`${product.name} added to cart`);
    window.setTimeout(() => setPending(null), 400);
  }, [product._id, product.name, outOfStock, finalPrice, stock, addItem]);

  const handleWishlistToggle = useCallback(() => {
    if (!product._id) return;

    setPending("wishlist");
    if (wishlisted) {
      removeFromWishlist(product._id as string);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        productId: product._id as string,
        price: finalPrice,
        name: product.name,
        image: product.images?.[0] || "/placeholder.jpg",
        stock,
      });
      toast.success(`${product.name} saved to wishlist`);
    }
    window.setTimeout(() => setPending(null), 400);
  }, [
    product._id,
    product.name,
    wishlisted,
    finalPrice,
    stock,
    addToWishlist,
    removeFromWishlist,
  ]);

  /* ── Category showcase tile ───────────────────────────────────────────── */
  if (variant === "category") {
    return (
      <article className="group relative h-full w-full overflow-hidden rounded-xl border border-line-hairline bg-surface-raised">
        <Link
          aria-label={`Browse the ${product.name} category`}
          className="after:absolute after:inset-0 after:z-[1] after:content-['']"
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          onClick={onPress}
        >
          <span className="sr-only">Browse the {product.name} category</span>
        </Link>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-sunken">
          <Image
            fill
            alt={product.name}
            className="object-cover transition-transform duration-slower ease-entrance group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 320px"
            src={product.images?.[0] || "/placeholder.jpg"}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"
          />
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-danger px-2.5 py-1 text-overline font-bold uppercase tracking-wider text-white shadow-sm">
              {getDiscountLabel(product.discount, product.price)}
            </span>
          )}
        </div>

        <div className="relative flex flex-col gap-1 p-4">
          <h3 className="truncate text-title-md font-semibold text-content">
            {product.name}
          </h3>
          <p className="text-body-sm text-content-muted">
            {outOfStock ? "Currently unavailable" : "In stock — ships today"}
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Shop now
            <span
              aria-hidden
              className="transition-transform duration-fast group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </span>
        </div>
      </article>
    );
  }

  /* ── Default product tile ─────────────────────────────────────────────── */
  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-lg",
        "border border-line-hairline bg-surface-raised",
        "shadow-xs transition-[transform,box-shadow,border-color]",
        "duration-base ease-standard",
        "hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg",
        outOfStock ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* ── Card-wide link target ───────────────────────────────────────────
       * `after:z-[1]` is required, not cosmetic: the media and body wrappers
       * are themselves positioned, so an unlayered `::after` overlay painted
       * earlier in the DOM ends up *underneath* them and the click lands on the
       * image instead of the link. Only the action row (`relative z-10`) stays
       * above the overlay.
       */}
      <Link
        aria-labelledby={headingId}
        className="after:absolute after:inset-0 after:z-[1] after:content-['']"
        href={`/product/${product._id}`}
        onClick={onPress}
      />

      {/* ── Media ─────────────────────────────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-sunken">
        <Image
          fill
          alt={product.name}
          className="object-contain p-6 transition-transform duration-slower ease-entrance group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          src={product.images?.[0] || "/placeholder.jpg"}
        />

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasDiscount && (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              <Tag aria-hidden size={11} />
              {getDiscountLabel(product.discount, product.price)}
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-surface-inverse px-2 py-1 text-[11px] font-semibold text-content-inverted">
              Out of stock
            </span>
          )}
          {!outOfStock && lowStock && (
            <span className="rounded-full bg-warning px-2 py-1 text-[11px] font-semibold text-white">
              Only {stock} left
            </span>
          )}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="line-clamp-2 min-h-10 text-body-sm font-medium leading-snug text-content"
          id={headingId}
        >
          {product.name}
        </h3>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="tabular text-title-md font-bold text-content">
            {formatCurrency(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="tabular text-body-sm text-content-subtle line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      {/* `relative z-10` lifts these above the stretched link overlay. */}
      <div className="relative z-10 flex items-center gap-2 p-4 pt-0">
        <button
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={[
            "inline-flex size-9 shrink-0 items-center justify-center rounded-sm border",
            "border-line-hairline bg-surface text-content-muted",
            "transition-colors duration-fast ease-standard",
            "hover:border-brand/50 hover:text-brand",
            wishlisted ? "border-brand/50 text-brand" : "",
          ].join(" ")}
          disabled={pending === "wishlist"}
          type="button"
          onClick={handleWishlistToggle}
        >
          {pending === "wishlist" ? (
            <Spinner color="current" size="sm" />
          ) : (
            <Heart
              aria-hidden
              className={wishlisted ? "fill-brand" : ""}
              size={16}
            />
          )}
        </button>

        <button
          className={[
            "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-sm",
            "text-body-sm font-semibold transition-colors duration-fast ease-standard",
            outOfStock
              ? "cursor-not-allowed border border-line-hairline bg-surface-sunken text-content-subtle"
              : inCart
                ? "bg-brand-subtle text-brand"
                : "bg-brand text-brand-contrast hover:bg-brand-hover",
          ].join(" ")}
          disabled={outOfStock || pending === "cart"}
          type="button"
          onClick={handleAddToCart}
        >
          {pending === "cart" ? (
            <Spinner color="current" size="sm" />
          ) : inCart ? (
            <Check aria-hidden size={16} />
          ) : (
            <Plus aria-hidden size={16} />
          )}
          {outOfStock ? "Unavailable" : inCart ? "In cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
