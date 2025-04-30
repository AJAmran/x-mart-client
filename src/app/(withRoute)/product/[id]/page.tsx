"use client";

import { useParams } from "next/navigation";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Badge } from "@nextui-org/badge";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { ChevronRight, Share2, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";

import CardSkeletons from "@/src/components/CardSkelton";
import ProductCard from "@/src/components/UI/ProductCard";
import { useCart } from "@/src/hooks/useCart";
import { useProductById, useProducts } from "@/src/hooks/useProducts";
import { TProduct } from "@/src/types";
import { Skeleton } from "@heroui/skeleton";


const ProductDetailsPage = () => {
  const { id } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
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

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    const cartItem = {
      productId: product._id,
      quantity: 1,
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

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <ChevronRight className="mx-2" size={14} />
          <Skeleton className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
          <ChevronRight className="mx-2" size={14} />
          <Skeleton className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[500px]" />
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

  return (
    <>
      <Head>
        <meta
          content={`${product.name}, ${product.category}, buy online`}
          name="keywords"
        />
        <meta content={product.description} name="description" />
        <meta content={product.name} property="og:title" />
        <meta content={product.description} property="og:description" />
        <meta
          content={product.images?.[0] || "/placeholder.jpg"}
          property="og:image"
        />
        <meta content={shareUrl} property="og:url" />
        <meta content="summary_large_image" name="twitter:card" />
        <title>{product.name} | Your Store</title>
      </Head>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <span className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
            Home
          </span>
          <ChevronRight className="mx-2" size={14} />
          <span className="transition-colors hover:text-gray-900 dark:hover:text-gray-100">
            Products
          </span>
          <ChevronRight className="mx-2" size={14} />
          <span className="text-gray-900 dark:text-gray-100">
            {product.name}
          </span>
        </motion.div>

        {/* Product Details Section */}
        <motion.div
          animate={{ opacity: 1 }}
          className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Product Image */}
          <div
            className="relative flex cursor-pointer items-center justify-center rounded-xl bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800"
            onClick={handleImageClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <Badge
              className="text-sm"
              color={product.stock > 0 ? "success" : "warning"}
              content={product.stock > 0 ? "In Stock" : "Out of Stock"}
              variant="flat"
            >
              <Image
                alt={product.name}
                className="max-h-[400px] w-full object-contain transition-transform duration-300 hover:scale-105 sm:max-h-[500px]"
                height={600}
                isZoomed
                src={product.images?.[0] || "/placeholder.jpg"}
                width={600}
              />
            </Badge>
          </div>

          {/* Product Details */}
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
                $
                {product.discount?.value
                  ? (
                      product.price *
                      (1 - product.discount.value / 100)
                    ).toFixed(2)
                  : product.price}
              </span>
              {product.discount?.value && (
                <span className="text-lg line-through text-gray-500 dark:text-gray-400">
                  ${product.price}
                </span>
              )}
              {product.discount?.value && (
                <span className="text-sm font-medium text-red-500 dark:text-red-400">
                  -{product.discount.value}%
                </span>
              )}
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
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsImageViewerOpen(false)}
          >
            <motion.div
              animate={{ scale: 1 }}
              className="relative flex h-full w-full max-w-4xl items-center justify-center"
              exit={{ scale: 0.8 }}
              initial={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                alt={product.name}
                className="max-h-[90vh] w-full object-contain"
                src={product.images?.[0] || "/placeholder.jpg"}
              />
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
