"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Heart, ShoppingCart, Tag, CheckCircle } from "lucide-react";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";

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
};

const ProductCard = ({
  product,
  variant = "default",
  onPress,
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const stock = getProductStock(product);
  const stockStatus = getStockStatus(stock);
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = finalPrice < product.price;
  const isProductInCart = isInCart(product._id);
  const isProductInWishlist = isInWishlist(product._id);
  const isOutOfStock = !stockStatus.canAddToCart;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product._id) return;
    if (isOutOfStock) {
      toast.error(`${product.name} is out of stock.`);

      return;
    }
    setIsLoading(true);
    addItem({
      productId: product._id,
      quantity: 1,
      price: finalPrice,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
      stock,
    });
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleWishlistToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!product._id) return;
    setIsWishlistLoading(true);
    if (isProductInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        productId: product._id,
        price: finalPrice,
        name: product.name,
        image: product.images?.[0] || "/placeholder.jpg",
        stock,
      });
    }
    setTimeout(() => setIsWishlistLoading(false), 500);
  };

  const handleDetailsClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/product/${product._id}`);
  };

  if (variant === "category") {
    return (
      <Link
        aria-label={`Explore ${product.name} category`}
        className="block h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px]"
        href={`/category/${product.category}`}
      >
        <Card
          className="h-full overflow-hidden rounded-2xl border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          role="presentation"
          onClick={onPress}
        >
          <div className="relative h-full">
            <Image
              removeWrapper
              alt={product.name}
              className="h-full w-full object-cover"
              src={product.images?.[0] || "/placeholder.jpg"}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6">
              <h3 className="truncate text-xl font-bold text-white">
                {product.name}
              </h3>
              <Button
                className="mt-3 bg-primary text-white"
                color="primary"
                size="sm"
                variant="solid"
                onClick={(event) => event.stopPropagation()}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      aria-label={`View details for ${product.name}`}
      className="block h-[440px] w-[280px] sm:w-[300px] lg:w-[310px] xl:w-[320px]"
      href={`/product/${product._id}`}
    >
      <Card
        className={`group relative h-full overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          bg-white dark:bg-gray-900
          border-gray-100 dark:border-gray-800
          ${isOutOfStock ? "opacity-80" : ""}`}
        role="presentation"
        shadow="none"
        onClick={onPress}
      >
        {/* ── Badges top-left ─────────────────────────────── */}
        <div className="absolute left-3 top-3 z-40 flex flex-col gap-1.5">
          {hasDiscount && (
            <Chip
              className="h-6 px-2 text-[11px] font-bold"
              color="danger"
              size="sm"
              startContent={<Tag size={10} />}
              variant="solid"
            >
              {getDiscountLabel(product.discount)}
            </Chip>
          )}
          {isOutOfStock ? (
            <Chip
              className="h-6 px-2 text-[11px] font-semibold"
              color="default"
              size="sm"
              variant="flat"
            >
              Out of Stock
            </Chip>
          ) : stock <= 5 ? (
            <Chip
              className="h-6 px-2 text-[11px] font-semibold"
              color="warning"
              size="sm"
              variant="flat"
            >
              Only {stock} left
            </Chip>
          ) : null}
        </div>

        {/* ── Wishlist button top-right ───────────────────── */}
        <Button
          isIconOnly
          aria-label={
            isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
          className="absolute right-3 top-3 z-40 h-8 w-8 min-w-8 bg-white/90 shadow-sm backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 dark:bg-gray-900/90"
          isLoading={isWishlistLoading}
          radius="full"
          size="sm"
          variant="flat"
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`transition-colors duration-200 ${
              isProductInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-400"
            }`}
            size={15}
          />
        </Button>

        {/* ── Product Image ───────────────────────────────── */}
        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950/60">
          <Image
            alt={product.name}
            className="h-48 w-full object-contain transition-transform duration-500"
            height={192}
            isZoomed={!isOutOfStock}
            src={product.images?.[0] || "/placeholder.jpg"}
            width={240}
          />
        </div>

        {/* ── Card Body ───────────────────────────────────── */}
        <CardBody className="flex flex-1 flex-col gap-3 px-4 py-3">
          {/* Product name */}
          <h3 className="line-clamp-2 min-h-[3rem] text-sm font-semibold leading-snug text-gray-900 dark:text-gray-50">
            {product.name}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary dark:text-primary-400">
              {formatCurrency(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through dark:text-gray-500">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </CardBody>

        {/* ── Footer Actions ──────────────────────────────── */}
        <CardFooter className="gap-2 px-4 pb-4 pt-0">
          {/* Details button */}
          <Button
            className="h-9 flex-1 border border-gray-200 bg-transparent text-xs font-medium text-gray-600 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:border-primary dark:hover:text-primary"
            radius="lg"
            size="sm"
            startContent={<Eye size={14} />}
            variant="bordered"
            onClick={handleDetailsClick}
          >
            Details
          </Button>

          {/* Add to Cart / In Cart / Out of Stock */}
          <Button
            className={`h-9 flex-1 text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? "cursor-not-allowed opacity-50"
                : isProductInCart
                  ? "bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                  : "bg-primary text-white hover:bg-primary-600 hover:shadow-md hover:shadow-primary/30"
            }`}
            isDisabled={isOutOfStock}
            isLoading={isLoading}
            radius="lg"
            size="sm"
            startContent={
              isLoading ? null : isProductInCart ? (
                <CheckCircle size={14} />
              ) : isOutOfStock ? null : (
                <ShoppingCart size={14} />
              )
            }
            variant="flat"
            onClick={handleAddToCart}
          >
            {isProductInCart
              ? "In Cart"
              : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
