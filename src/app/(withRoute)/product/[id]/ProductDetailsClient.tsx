"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";

import { useCart } from "@/src/hooks/useCart";
import {
  formatCurrency,
  getDiscountedPrice,
  getProductStock,
  getStockStatus,
} from "@/src/lib/productUtils";
import { TProduct } from "@/src/types";

type Props = { product: TProduct };

const ProductDetailsClient = ({ product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  const totalStock = getProductStock(product);
  const images = product.images?.length ? product.images : ["/placeholder.jpg"];
  const finalPrice = getDiscountedPrice(product.price, product.discount);
  const hasDiscount = finalPrice < product.price;
  const stockStatus = getStockStatus(totalStock);

  const handleAddToCart = () => {
    if (totalStock <= 0) {
      toast.error("This product is currently out of stock.");

      return;
    }
    if (quantity > totalStock) {
      toast.error(`Only ${totalStock} unit${totalStock === 1 ? "" : "s"} available.`);

      return;
    }
    setIsAddingToCart(true);
    addItem({
      productId: product._id,
      quantity,
      price: finalPrice,
      name: product.name,
      image: images[0],
      stock: totalStock,
    });
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : shareUrl;

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

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.nav
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: -8 }}
        >
          <Link className="hover:text-primary" href="/">Home</Link>
          <ChevronRight size={14} />
          <Link className="hover:text-primary" href="/shop">Shop</Link>
          <ChevronRight size={14} />
          <Link className="hover:text-primary" href={`/shop?category=${product.category}`}>
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="max-w-[240px] truncate text-gray-900 dark:text-gray-100">
            {product.name}
          </span>
        </motion.nav>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="space-y-4">
            <Card className="overflow-hidden border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <CardBody className="relative flex aspect-square min-h-[360px] items-center justify-center p-4 sm:p-8">
                <div className="absolute left-4 top-4 z-10 flex gap-2">
                  <Chip color={stockStatus.color} size="sm" variant="flat">
                    {stockStatus.label}
                  </Chip>
                  {hasDiscount && (
                    <Chip color="danger" size="sm" variant="flat">
                      Save {product.discount?.type === "fixed" ? formatCurrency(product.discount.value) : `${product.discount?.value}%`}
                    </Chip>
                  )}
                </div>
                <button
                  aria-label="Open product image viewer"
                  className="flex h-full w-full items-center justify-center"
                  type="button"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  <Image
                    isZoomed
                    alt={product.name}
                    className="max-h-[560px] w-full object-contain"
                    src={images[selectedImageIndex]}
                  />
                </button>
              </CardBody>
            </Card>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    aria-label={`View ${product.name} image ${index + 1}`}
                    className={`aspect-square overflow-hidden rounded-lg border bg-white p-1 transition ${
                      index === selectedImageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-400 dark:border-gray-800"
                    }`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      removeWrapper
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      src={image}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Chip color="primary" size="sm" variant="flat">{product.category}</Chip>
                {product.status && <Chip size="sm" variant="bordered">{product.status}</Chip>}
              </div>
              <h1 className="text-3xl font-bold leading-tight text-gray-950 dark:text-gray-50 sm:text-4xl">
                {product.name}
              </h1>
              <p className="leading-7 text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-bold text-gray-950 dark:text-gray-50">
                  {formatCurrency(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="pb-1 text-lg text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
              {totalStock > 0 && totalStock <= 10 && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-warning">
                  <AlertTriangle size={16} />
                  <span>Low stock. Order soon to reserve this item.</span>
                </div>
              )}
            </div>

            <Card className="shadow-sm">
              <CardBody className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</p>
                    <p className="text-xs text-gray-500">Available: {totalStock}</p>
                  </div>
                  <div className="grid h-12 w-36 grid-cols-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                    <Button
                      isIconOnly
                      aria-label="Decrease quantity"
                      className="h-full rounded-none"
                      isDisabled={quantity <= 1 || totalStock <= 0}
                      variant="light"
                      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={16} />
                    </Button>
                    <div className="flex items-center justify-center border-x border-gray-200 font-semibold dark:border-gray-800">
                      {quantity}
                    </div>
                    <Button
                      isIconOnly
                      aria-label="Increase quantity"
                      className="h-full rounded-none"
                      isDisabled={quantity >= totalStock || totalStock <= 0}
                      variant="light"
                      onPress={() => setQuantity((q) => Math.min(Math.max(totalStock, 1), q + 1))}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-12 flex-1 font-semibold"
                    color="primary"
                    isDisabled={totalStock <= 0}
                    isLoading={isAddingToCart}
                    startContent={!isAddingToCart && <ShoppingCart size={20} />}
                    onPress={handleAddToCart}
                  >
                    {stockStatus.canAddToCart ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Share product"
                    className="h-12 w-full sm:w-12"
                    variant="bordered"
                    onPress={handleShare}
                  >
                    <Share2 size={20} />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Save product"
                    className="h-12 w-full sm:w-12"
                    variant="bordered"
                    onPress={() => toast.info("Wishlist is under development.")}
                  >
                    <Heart size={20} />
                  </Button>
                </div>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Fast delivery", text: "Branch-based fulfillment" },
                { icon: ShieldCheck, title: "Secure checkout", text: "Protected payment flow" },
                { icon: RotateCcw, title: "Easy support", text: "Order tracking included" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                >
                  <item.icon className="mb-3 text-primary" size={22} />
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.text}</p>
                </div>
              ))}
            </div>

            <Card className="shadow-sm">
              <CardBody className="space-y-3">
                <div className="flex items-center gap-2">
                  <PackageCheck className="text-primary" size={20} />
                  <h2 className="font-semibold">Product Details</h2>
                </div>
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">SKU</dt>
                    <dd className="font-medium">{product.sku || product._id.slice(-8).toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Availability</dt>
                    <dd className="font-medium">{stockStatus.label}</dd>
                  </div>
                  {product.manufacturer && (
                    <div>
                      <dt className="text-gray-500">Manufacturer</dt>
                      <dd className="font-medium">{product.manufacturer}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <dt className="text-gray-500">Weight</dt>
                      <dd className="font-medium">{product.weight}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isImageViewerOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsImageViewerOpen(false)}
          >
            <motion.div
              animate={{ scale: 1 }}
              className="relative flex h-full w-full max-w-5xl items-center justify-center"
              exit={{ scale: 0.96 }}
              initial={{ scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-full overflow-hidden">
                {images.map((image, index) => (
                  <div key={image + index} className="min-w-full px-4">
                    <Image
                      alt={`${product.name} ${index + 1}`}
                      className="max-h-[86vh] w-full object-contain"
                      src={image}
                    />
                  </div>
                ))}
              </div>
              <Button
                isIconOnly
                aria-label="Close image viewer"
                className="absolute right-2 top-2 rounded-full"
                color="danger"
                onPress={() => setIsImageViewerOpen(false)}
              >
                <X size={22} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetailsClient;
