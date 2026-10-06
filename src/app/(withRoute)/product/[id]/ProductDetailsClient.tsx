"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/src/hooks/useCart";
import { useProducts } from "@/src/hooks/useProducts";
import { useWishlist } from "@/src/hooks/useWishlist";
import {
  formatCurrency,
  formatNumber,
  getDiscountedPrice,
  getProductStock,
  getStockStatus,
} from "@/src/lib/productUtils";
import { TProduct } from "@/src/types";
import { Container } from "@/src/components/UI/Container";
import ProductCard from "@/src/components/UI/ProductCard";

type Props = { product: TProduct };

/* ── Small presentational helpers ─────────────────────────────────────────── */

const Chip = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "danger" | "warning" | "success";
}) => {
  const tones = {
    neutral: "bg-surface-sunken text-content-muted",
    brand: "bg-brand-subtle text-brand",
    danger: "bg-danger/15 text-danger",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const ProductDetailsClient = ({ product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [pending, setPending] = useState<"cart" | "wishlist" | null>(null);

  const { addItem, isInCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  /**
   * Related products: same category first, topped up with the same
   * sub-category, then anything else active so the shelf never looks empty.
   * The current product is always excluded.
   */
  const { data: relatedRes, isLoading: relatedLoading } = useProducts(
    { category: product.category, status: "ACTIVE" },
    { limit: 8, page: 1, sortBy: "createdAt", sortOrder: "desc" }
  );

  const related = useMemo(() => {
    const pool = (relatedRes?.data ?? []).filter((p) => p._id !== product._id);

    const rank = (p: TProduct) =>
      p.subCategory && p.subCategory === product.subCategory ? 0 : 1;

    return pool.sort((a, b) => rank(a) - rank(b)).slice(0, 4);
  }, [relatedRes, product._id, product.subCategory]);

  const totalStock = getProductStock(product);
  const { canAddToCart } = getStockStatus(totalStock);
  const images = product.images?.length ? product.images : ["/placeholder.jpg"];
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = finalPrice < product.price;
  const wishlisted = isInWishlist(product._id);
  const lowStock = canAddToCart && totalStock <= 10;

  const discountText =
    product.discount?.type === "fixed"
      ? formatCurrency(product.discount.value)
      : `${product.discount?.value}%`;

  const handleAddToCart = () => {
    if (totalStock <= 0) {
      toast.error("This product is currently out of stock.");

      return;
    }

    if (quantity > totalStock) {
      toast.error(
        `Only ${totalStock} unit${totalStock === 1 ? "" : "s"} available.`
      );

      return;
    }

    setPending("cart");
    addItem({
      productId: product._id,
      quantity,
      price: finalPrice,
      name: product.name,
      image: images[0],
      stock: totalStock,
    });
    toast.success(`${product.name} added to cart`);
    window.setTimeout(() => setPending(null), 500);
  };

  const handleWishlist = () => {
    setPending("wishlist");

    if (wishlisted) {
      removeFromWishlist(product._id);
      toast(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({
        productId: product._id,
        price: finalPrice,
        name: product.name,
        image: images[0],
        stock: totalStock,
      });
      toast.success(`${product.name} saved to wishlist`);
    }

    window.setTimeout(() => setPending(null), 500);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.share({ title: product.name, text: product.description, url });
      toast.success("Shared successfully.");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Product link copied.");
      } catch {
        toast.error("Could not share or copy the link.");
      }
    }
  };

  /* Stock is per-branch; summarise it rather than dumping every row. */
  const branchStock =
    product.inventories?.filter((i) => (i.stock ?? 0) > 0).length ?? 0;

  const specs: { label: string; value: string }[] = [
    { label: "SKU", value: product.sku || product._id.slice(-8).toUpperCase() },
    { label: "Category", value: product.category },
    ...(product.subCategory
      ? [{ label: "Sub-category", value: product.subCategory }]
      : []),
    ...(product.manufacturer
      ? [{ label: "Manufacturer", value: product.manufacturer }]
      : []),
    ...(product.supplier ? [{ label: "Supplier", value: product.supplier }] : []),
    ...(product.weight ? [{ label: "Weight", value: `${product.weight} kg` }] : []),
    ...(product.barcode ? [{ label: "Barcode", value: product.barcode }] : []),
  ];

  return (
    <Container className="py-6 sm:py-8">
      {/* ── Breadcrumbs ──────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-1.5 text-label-sm text-content-subtle"
      >
        <Link className="transition-colors hover:text-brand" href="/">
          Home
        </Link>
        <ChevronRight aria-hidden size={13} />
        <Link className="transition-colors hover:text-brand" href="/shop">
          Shop
        </Link>
        <ChevronRight aria-hidden size={13} />
        <Link
          className="transition-colors hover:text-brand"
          href={`/shop?category=${product.category}`}
        >
          {product.category}
        </Link>
        <ChevronRight aria-hidden size={13} />
        <span
          aria-current="page"
          className="max-w-[16rem] truncate font-medium text-content"
        >
          {product.name}
        </span>
      </nav>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── Gallery ───────────────────────────────────────────────── */}
        {/* Capped and centred: a full-width square dominated the page and
            pushed the buy box below the fold on laptops. */}
        <div className="mx-auto w-full max-w-md lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-line-hairline bg-surface-raised">
            <Image
              fill
              priority
              alt={product.name}
              className="object-contain p-6"
              sizes="(max-width: 1024px) 90vw, 26rem"
              src={images[activeImage]}
            />

            <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-2">
              {hasDiscount && <Chip tone="danger">-{discountText}</Chip>}
              {canAddToCart ? (
                <Chip tone="success">In stock</Chip>
              ) : (
                <Chip tone="danger">Out of stock</Chip>
              )}
            </div>

            {images.length > 1 && (
              <button
                aria-label="View larger image"
                className="absolute bottom-4 right-4 inline-flex size-9 items-center justify-center rounded-sm border border-line-hairline bg-surface-raised text-content-muted shadow-sm transition-colors hover:border-brand/50 hover:text-brand"
                type="button"
                onClick={() => setViewerOpen(true)}
              >
                <ZoomIn aria-hidden size={16} />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2.5">
              {images.map((image, index) => (
                <button
                  key={image + index}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-pressed={index === activeImage}
                  className={[
                    "relative aspect-square overflow-hidden rounded-sm border-2 bg-surface-raised",
                    "transition-colors duration-fast ease-standard",
                    index === activeImage
                      ? "border-brand"
                      : "border-line-hairline hover:border-line-strong",
                  ].join(" ")}
                  type="button"
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    fill
                    alt=""
                    className="object-contain p-1.5"
                    sizes="96px"
                    src={image}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Buy box ───────────────────────────────────────────────── */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="brand">{product.category}</Chip>
            {product.subCategory && <Chip>{product.subCategory}</Chip>}
            {product.operationType === "PROMOTIONAL" && (
              <Chip tone="warning">Promotional</Chip>
            )}
          </div>

          <h1 className="mt-3 text-display-sm font-bold text-content">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-3 text-body-sm leading-relaxed text-content-muted">
              {product.description}
            </p>
          )}

          {/* Price + stock */}
          <div className="mt-6 rounded-lg border border-line-hairline bg-surface-raised p-5">
            <div className="flex flex-wrap items-end gap-3">
              <span className="tabular text-display-sm font-bold text-content">
                {formatCurrency(finalPrice)}
              </span>
              {hasDiscount && (
                <span className="tabular pb-1 text-body-sm text-content-subtle line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
              {hasDiscount && (
                <Chip tone="danger">
                  Save {discountText}
                </Chip>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-hairline pt-4 text-label-sm">
              <span className="flex items-center gap-1.5 text-content-muted">
                <Package aria-hidden className="text-content-subtle" size={15} />
                {formatNumber(totalStock)} in stock
              </span>
              {branchStock > 0 && (
                <span className="text-content-subtle">
                  across {branchStock}{" "}
                  {branchStock === 1 ? "branch" : "branches"}
                </span>
              )}
            </div>

            {lowStock && (
              <p className="mt-3 flex items-center gap-2 text-label-sm font-medium text-warning">
                <AlertTriangle aria-hidden size={15} />
                Running low — only {formatNumber(totalStock)} left.
              </p>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-label-sm font-semibold text-content-muted">
                Qty
              </span>
              <div className="grid h-11 w-32 grid-cols-3 overflow-hidden rounded-md border border-line-hairline">
                <button
                  aria-label="Decrease quantity"
                  className="grid place-items-center text-content-muted transition-colors hover:bg-surface-sunken hover:text-content disabled:opacity-30"
                  disabled={quantity <= 1 || totalStock <= 0}
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus aria-hidden size={15} />
                </button>
                <span
                  aria-label="Selected quantity"
                  aria-live="polite"
                  className="tabular grid place-items-center border-x border-line-hairline text-body-sm font-semibold text-content"
                >
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  className="grid place-items-center text-content-muted transition-colors hover:bg-surface-sunken hover:text-content disabled:opacity-30"
                  disabled={quantity >= totalStock || totalStock <= 0}
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(Math.max(totalStock, 1), q + 1))
                  }
                >
                  <Plus aria-hidden size={15} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 gap-2">
              <button
                className={[
                  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-sm",
                  "text-body-sm font-semibold transition-colors duration-fast ease-standard",
                  canAddToCart
                    ? isInCart(product._id) || pending === "cart"
                      ? "bg-brand-subtle text-brand"
                      : "bg-brand text-brand-contrast hover:bg-brand-hover"
                    : "cursor-not-allowed bg-surface-sunken text-content-subtle",
                ].join(" ")}
                disabled={!canAddToCart || pending === "cart"}
                type="button"
                onClick={handleAddToCart}
              >
                <ShoppingCart aria-hidden size={17} />
                {canAddToCart
                  ? isInCart(product._id)
                    ? "In cart"
                    : "Add to cart"
                  : "Out of stock"}
              </button>

              <button
                aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={wishlisted}
                className={[
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-sm border",
                  "transition-colors duration-fast ease-standard",
                  wishlisted
                    ? "border-brand/50 bg-brand-subtle text-brand"
                    : "border-line-hairline bg-surface-raised text-content-muted hover:border-brand/50 hover:text-brand",
                ].join(" ")}
                disabled={pending === "wishlist"}
                type="button"
                onClick={handleWishlist}
              >
                <Heart
                  aria-hidden
                  className={wishlisted ? "fill-brand" : ""}
                  size={17}
                />
              </button>

              <button
                aria-label="Share product"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-line-hairline bg-surface-raised text-content-muted transition-colors duration-fast ease-standard hover:border-brand/50 hover:text-brand"
                type="button"
                onClick={handleShare}
              >
                <Share2 aria-hidden size={17} />
              </button>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Fast delivery", text: "From your nearest branch" },
              { icon: ShieldCheck, title: "Secure checkout", text: "Protected payments" },
              { icon: RotateCcw, title: "Easy support", text: "Order tracking included" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-line-hairline bg-surface-raised p-4"
              >
                <item.icon aria-hidden className="mb-2.5 text-brand" size={20} />
                <p className="text-body-sm font-semibold text-content">
                  {item.title}
                </p>
                <p className="mt-0.5 text-label-sm text-content-subtle">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <section className="mt-6 overflow-hidden rounded-lg border border-line-hairline bg-surface-raised">
              <header className="border-b border-line-hairline px-5 py-3.5">
                <h2 className="text-title-md font-semibold text-content">
                  Product details
                </h2>
              </header>
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line-hairline px-5 py-3 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                  >
                    <dt className="text-label-sm text-content-subtle">
                      {spec.label}
                    </dt>
                    <dd className="truncate text-body-sm font-medium text-content">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Long description */}
          {product.description && (
            <section className="mt-6 rounded-lg border border-line-hairline bg-surface-raised p-5">
              <h2 className="text-title-md font-semibold text-content">
                About this product
              </h2>
              <p className="mt-2.5 text-body-sm leading-relaxed text-content-muted">
                {product.description}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* ── Related products ───────────────────────────────────────── */}
      {(relatedLoading || related.length > 0) && (
        <section className="mt-12 border-t border-line-hairline pt-10">
          <header className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-title-lg font-bold text-content">
                You may also like
              </h2>
              <p className="mt-1 text-label-sm text-content-subtle">
                More from {product.category.toLowerCase()}
              </p>
            </div>
            <Link
              className="shrink-0 text-label-sm font-semibold text-brand transition-colors hover:underline"
              href={`/shop?category=${product.category}`}
            >
              View all
            </Link>
          </header>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="xm-skeleton aspect-[3/4] w-full rounded-lg bg-surface-sunken"
                  />
                ))
              : related.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
          </div>
        </section>
      )}

      {/* ── Full-screen viewer ──────────────────────────────────────── */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label="Image viewer"
            aria-modal="true"
            className="fixed inset-0 z-overlay flex items-center justify-center bg-surface-inverse/95 p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="dialog"
            onClick={() => setViewerOpen(false)}
          >
            <motion.div
              animate={{ scale: 1 }}
              className="relative w-full max-w-4xl"
              exit={{ scale: 0.96 }}
              initial={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                alt={`${product.name} — image ${activeImage + 1}`}
                className="mx-auto max-h-[85vh] w-auto object-contain"
                height={900}
                src={images[activeImage]}
                width={900}
              />
              <button
                aria-label="Close image viewer"
                className="absolute right-0 top-0 inline-flex size-10 items-center justify-center rounded-sm bg-surface-raised/10 text-content-inverted transition-colors hover:bg-surface-raised/20"
                type="button"
                onClick={() => setViewerOpen(false)}
              >
                <X aria-hidden size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProductDetailsClient;