"use client";

import { useParams } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";

import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { ChevronRight, Share2, ShoppingCart, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import CardSkeletons from "@/src/components/CardSkelton";
import ProductCard from "@/src/components/UI/ProductCard";
import { useCart } from "@/src/hooks/useCart";
import { useProductById, useProducts } from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import { Skeleton } from "@heroui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();

  // Fetch product details
  const { data: response, isError, isLoading } = useProductById(id as string);
  const product = response?.data;

  // Fetch relevant products
  const { data: relevantProductsResponse } = useProducts(
    { category: product?.category },
    { limit: 12, page: 1, sortBy: "createdAt", sortOrder: "desc" }
  );

  // Filter out current product
  const relevantProducts = (relevantProductsResponse?.data || []).filter(
    (p: TProduct) => p._id !== product?._id
  );

  // Set share URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error("Insufficient stock");
      return;
    }
    setIsAddingToCart(true);
    const cartItem = {
      productId: product._id,
      quantity,
      price: product.price,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
    };
    addItem(cartItem);
    toast.success(`${product?.name} added to cart!`);
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: shareUrl,
      });
      toast.success("Shared successfully!");
    } catch {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleImageClick = () => setIsImageViewerOpen(true);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsImageViewerOpen(true);
    }
  };

  // Image Carousel for Viewer
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, startIndex: selectedImageIndex },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <ChevronRight className="mx-2" size={14} />
          <Skeleton className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <ChevronRight className="mx-2" size={14} />
          <Skeleton className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[500px]" />
            <div className="flex gap-2">
              <Skeleton className="h-20 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-20 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-20 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-20 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="h-6 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-12 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
        Failed to load product details.
      </div>
    );
  }

  const images = product.images || ["/placeholder.jpg"];
  const finalPrice = product.discount?.value
    ? product.price * (1 - product.discount.value / 100)
    : product.price;

  return (
    <>
      <Head>
        <title>{`${product.name} | X-mart`}</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.name}, ${product.category}, buy online, groceries`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: images,
              description: product.description,
              sku: product._id,
              offers: {
                "@type": "Offer",
                url: shareUrl,
                priceCurrency: "USD",
                price: finalPrice.toFixed(2),
                itemCondition: "https://schema.org/NewCondition",
                availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
      </Head>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <Link href="/" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
            Home
          </Link>
          <ChevronRight className="mx-2" size={14} />
          <Link href="/shop" className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
            Products
          </Link>
          <ChevronRight className="mx-2" size={14} />
          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            {product.category}
          </Link>
          <ChevronRight className="mx-2" size={14} />
          <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
        </motion.div>

        {/* Product Details Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative flex cursor-pointer items-center justify-center rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800"
              onClick={handleImageClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Open image viewer"
            >
              <Badge
                className="absolute top-4 right-4 text-sm"
                color={product.stock > 0 ? "success" : "warning"}
                content={product.stock > 0 ? "In Stock" : "Out of Stock"}
                variant="flat"
              >
                <Image
                  alt={product.name}
                  className="max-h-[400px] w-full object-contain transition-transform duration-300 hover:scale-105 sm:max-h-[500px]"
                  height={600}
                  isZoomed
                  src={images[selectedImageIndex]}
                  width={600}
                />
              </Badge>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string | undefined, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    width={80}
                    height={80}
                    className={`cursor-pointer rounded-md object-cover ${idx === selectedImageIndex ? "border-2 border-primary" : "opacity-70"}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {product.name}
            </h1>
            <p className="leading-relaxed text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-green-600 dark:text-green-500 sm:text-3xl">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discount?.value && (
                <>
                  <span className="text-lg line-through text-gray-500 dark:text-gray-400">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium text-red-500 dark:text-red-400">
                    -{product.discount.value}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Info */}
            {product.stock > 0 && product.stock <= 10 && (
              <div className="flex items-center gap-2 text-sm text-orange-500">
                <AlertTriangle size={16} />
                <span>Only {product.stock} left in stock - order soon!</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <Input
                type="number"
                label="Quantity"
                value={quantity.toString()}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min={1}
                max={product.stock}
                className="w-32"
                isDisabled={product.stock <= 0}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="h-12 w-full rounded-xl text-base font-medium sm:flex-1 sm:text-lg"
                color="primary"
                isDisabled={product.stock <= 0}
                isLoading={isAddingToCart}
                onPress={handleAddToCart}
                startContent={<ShoppingCart size={20} />}
                variant="solid"
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                className="h-12 w-full rounded-xl text-base font-medium sm:w-auto sm:text-lg"
                color="secondary"
                onPress={handleShare}
                startContent={<Share2 size={20} />}
                variant="bordered"
              >
                Share
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Relevant Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {relevantProductsResponse?.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeletons key={i} />
                ))
              : relevantProducts.map((product: TProduct) => (
                  <ProductCard
                    key={product._id}
                    onPress={() =>
                      (window.location.href = `/product/${product._id}`)
                    }
                    product={product}
                  />
                ))}
          </div>
        </motion.div>
      </div>

      {/* Full-Screen Image Viewer */}
      <AnimatePresence>
        {isImageViewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsImageViewerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative flex h-full w-full max-w-4xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {images.map((img: string | undefined, idx: number) => ( // Changed type of idx to number
                    <div key={idx} className="min-w-full">
                      <Image
                        alt={`${product.name} ${idx + 1}`}
                        className="max-h-[90vh] w-full object-contain"
                        src={img}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button
                className="absolute right-2 top-2 rounded-full"
                color="danger"
                isIconOnly
                onPress={() => setIsImageViewerOpen(false)}
              >
                <X size={24} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetailsPage;