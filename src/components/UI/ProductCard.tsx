"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  onPress?: (productId: string) => void;
  showBrand?: boolean;
  showDiscount?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
  showAddToCart?: boolean;
  layout?: "vertical" | "horizontal";
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  showBrand = true,
  showDiscount = true,
  showRating = true,
  showDescription = true,
  showAddToCart = true,
  layout = "vertical",
  className,
}: ProductCardProps) {
  const {
    id,
    name,
    price,
    imageUrl,
    discount = 0,
    inStock,
    brand,
    rating,
    reviews,
    description,
  } = product;

  const discountedPrice = discount
    ? (price - price * (discount / 100)).toFixed(2)
    : price.toFixed(2);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={clsx("w-full", className)}
    >
      <Card
        shadow="sm"
        className={clsx(
          "hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200 relative overflow-hidden",
          layout === "horizontal" && "flex flex-row items-center"
        )}
      >
        {/* Discount Badge */}
        {showDiscount && discount > 0 && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-tr-lg shadow-md">
            {discount}% OFF
          </div>
        )}

        {/* Image Section */}
        <CardBody
          className={clsx(
            "flex items-center justify-center p-4",
            layout === "horizontal" && "w-1/3"
          )}
        >
          <Image
            alt={name}
            className="object-contain h-[140px] lg:h-[180px] max-w-full"
            src={imageUrl}
          />
        </CardBody>

        {/* Card Footer */}
        <CardFooter
          className={clsx(
            "flex flex-col items-start gap-3 p-4 w-full",
            layout === "horizontal" && "w-2/3"
          )}
        >
          {/* Product Name */}
          <Tooltip content={name} color="default">
            <h4
              className="text-lg font-semibold text-ellipsis text-start overflow-hidden whitespace-nowrap w-full"
              title={name}
            >
              {name}
            </h4>
          </Tooltip>

          {/* Product Description */}
          {showDescription && (
            <p className="text-sm text-gray-500 line-clamp-2 text-start">
              {description}
            </p>
          )}

          {/* Brand */}
          {showBrand && <p className="text-sm text-gray-500">{brand}</p>}

          {/* Pricing Section */}
          <div className="flex items-center justify-between w-full">
            <p className="text-xl font-bold text-primary">
              ৳{discountedPrice}
              {discount > 0 && (
                <span className="line-through text-gray-400 text-sm ml-2">
                  ৳{price.toFixed(2)}
                </span>
              )}
            </p>
          </div>

          {/* Availability and Rating */}
          <div className="flex items-center justify-between w-full">
            <p
              className={clsx(
                "text-sm",
                inStock ? "text-green-600" : "text-red-500"
              )}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </p>
            {showRating && rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                ⭐ {rating.toFixed(1)}
                <span className="text-xs text-gray-500">
                  ({reviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && (
            <Button
              color={inStock ? "primary" : "default"}
              className="w-full mt-2"
              isDisabled={!inStock}
              onClick={() => inStock && onAddToCart?.(product)}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
