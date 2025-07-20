"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { TProduct } from "@/src/types";
import { ShoppingCart, Eye, Tag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/src/hooks/useCart";

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
  const { addItem } = useCart();

  const handleAddToCart = (e: any) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation(); // Prevent card click from triggering navigation
    }
    setIsLoading(true);
    if (!product._id) {
      setIsLoading(false);
      return;
    }
    const cartItem = {
      productId: product._id,
      quantity: 1,
      price: product.price,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
    };
    addItem(cartItem);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCardClick = () => {
    if (onPress) onPress(); // Trigger custom onPress if provided
  };

  const discountedPrice = product?.discount?.value
    ? product.discount.type === "percentage"
      ? (product.price * (1 - product.discount.value / 100)).toFixed(2)
      : (product.price - product.discount.value).toFixed(2)
    : product.price;

  if (variant === "category") {
    return (
      <Link
        href={`/category/${product.category}`}
        className="block w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px]"
        aria-label={`Explore ${product.name} category`}
      >
        <Card
          className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
          role="presentation"
          onClick={handleCardClick}
        >
          <div className="relative h-full">
            <Image
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              removeWrapper
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold text-white truncate">
                {product.name}
              </h3>
              <Button
                variant="flat"
                color="primary"
                size="sm"
                className="mt-3 bg-primary-600 text-white hover:bg-primary-700"
                onClick={(e) => e.stopPropagation()} // Prevent card click
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
      href={`/product/${product._id}`}
      className="block w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px]"
      aria-label={`View details for ${product.name}`}
    >
      <Card
        shadow="sm"
        className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
        role="presentation"
        onClick={handleCardClick}
      >
        {/* Discount Badge */}
        {(product?.discount?.value ?? 0) > 0 && (
          <div className="absolute top-3 right-3 z-40 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Tag size={12} className="mr-1" />
            {product.discount?.value}
            {product.discount?.type === "percentage" ? "%" : "৳"} OFF
          </div>
        )}

        {/* Image Section */}
        <div className="relative flex justify-center items-center bg-gray-50 p-4">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            width={240}
            height={192}
            className="w-full h-48 object-contain"
            isZoomed
          />
        </div>

        {/* Product Details */}
        <CardBody className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600">
                ৳{discountedPrice}
              </span>
              {(product?.discount?.value ?? 0) > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ৳{product.price}
                </span>
              )}
            </div>
            <div>
              {product.inventories?.[0]?.stock > 0 ? (
                <span className="text-xs text-green-500">In Stock</span>
              ) : (
                <span className="text-xs text-red-500">Out of Stock</span>
              )}
            </div>
          </div>
        </CardBody>

        {/* Action Buttons */}
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="flat"
            className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm"
            startContent={<Eye size={16} />}
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              window.location.href = `/product/${product._id}`; // Manual navigation
            }}
          >
            Details
          </Button>
          <Button
            variant="solid"
            color="primary"
            isLoading={isLoading}
            isDisabled={!product.inventories?.[0]?.stock}
            startContent={<ShoppingCart size={16} />}
            size="sm"
            onPress={handleAddToCart}
          >
            {product.inventories?.[0]?.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;