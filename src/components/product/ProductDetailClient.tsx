"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Badge } from "@nextui-org/badge";
import { Card, CardBody } from "@nextui-org/card";
import { ShoppingCart, Star, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCart } from "@/src/hooks/useCart";
import ProductCard from "@/src/components/UI/ProductCard";
import { TProduct } from "@/src/types";
import CardSkeletons from "@/src/components/CardSkelton";

interface ProductDetailsClientProps {
  product: TProduct;
  relevantProducts: TProduct[];
}

export default function ProductDetailsClient({
  product,
  relevantProducts,
}: ProductDetailsClientProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Cannot add to cart: Out of stock");
      return;
    }

    setIsAddingToCart(true);
    const cartItem = {
      productId: product._id,
      quantity: 1,
      price: product.discount?.value
        ? product.price * (1 - product.discount.value / 100)
        : product.price,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
    };

    try {
      addItem(cartItem);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  };

  const discountedPrice = product.discount?.value
    ? (product.price * (1 - product.discount.value / 100)).toFixed(2)
    : product.price;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link href="/shop" className="hover:text-gray-900 dark:hover:text-gray-100">
          Products
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
      </nav>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm"
        >
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full max-w-[500px] h-[500px] object-contain"
            isZoomed
            loading="lazy"
          />
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
                ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (4.5/5)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              ৳{discountedPrice}
            </span>
            {product.discount?.value && (
              <span className="text-base sm:text-md line-through text-gray-500 dark:text-gray-400">
                ৳{product.price}
              </span>
            )}
            {product.discount?.value && (
              <span className="text-sm text-red-500">
                -{product.discount.value}%
              </span>
            )}
          </div>

          {/* Stock Availability */}
          <div>
            {product.stock > 0 ? (
              <Badge color="success" variant="flat" aria-label="In stock">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge color="warning" variant="flat" aria-label="Out of stock">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="solid"
            color="primary"
            className="w-full h-12 sm:h-14 text-base sm:text-lg"
            onPress={handleAddToCart}
            isDisabled={product.stock <= 0 || isAddingToCart}
            isLoading={isAddingToCart}
            startContent={<ShoppingCart size={20} />}
            aria-label="Add to cart"
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </motion.div>
      </div>

      {/* Relevant Products Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          You Might Also Like
        </h2>
        {relevantProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No related products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relevantProducts.map((product: TProduct, index: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onPress={() => {}}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}