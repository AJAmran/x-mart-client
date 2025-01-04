"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Badge } from "@nextui-org/badge";
import { Tooltip } from "@nextui-org/tooltip";
import clsx from "clsx";
import { Product } from "@/src/types";

interface ProductCardProps {
  product: Product;
  onPress?: (productId: string) => void;
  showBrand?: boolean;
  showDiscount?: boolean;
  showRating?: boolean;
  layout?: "vertical" | "horizontal";
}

export default function ProductCard({
  product,
  onPress,
  showBrand = true,
  showDiscount = true,
  showRating = true,
  layout = "vertical",
}: ProductCardProps) {
  const { name, price, imageUrl, discount, inStock, brand, rating, reviews } =
    product;

  const discountedPrice = discount
    ? (price - price * (discount / 100)).toFixed(2)
    : price.toFixed(2);

  return (
    <Card
      isPressable
      shadow="sm"
      className={clsx(
        "hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200",
        layout === "horizontal" && "flex flex-row items-center"
      )}
      onPress={() => onPress && onPress(product.id)}
    >
      {/* Image Section */}
      <CardBody
        className={clsx(
          "overflow-hidden p-0 relative",
          layout === "horizontal" && "flex-shrink-0 w-[30%]"
        )}
      >
        <div
          className="relative w-full rounded-t-lg"
          style={{ aspectRatio: "16/9" }}
        >
          <img
            alt={name}
            src={imageUrl} // Test with a static image
            className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardBody>

      {/* Card Footer */}
      <CardFooter className="flex flex-col items-start gap-3 p-4 w-full">
        {/* Product Name */}
        <Tooltip content={name} color="default">
          <h4
            className="text-lg font-semibold text-ellipsis text-start overflow-hidden whitespace-nowrap w-full"
            title={name}
          >
            {name}
          </h4>
        </Tooltip>

        {/* Brand and Discount */}
        <div className="flex items-center justify-between w-full">
          {showBrand && <p className="text-sm text-gray-500">{brand}</p>}
        </div>

        {/* Pricing Section */}
        <div className="flex items-center justify-between w-full">
          <p className="text-xl font-bold text-primary">
          ৳{discountedPrice}
            {discount && (
              <span className="line-through text-gray-400 text-sm ml-2">
                ৳{price.toFixed(2)}
              </span>
            )}
          </p>

          {/* Discount Percentage next to price */}
          {discount && (
            <span className="text-xs text-green-500 font-semibold ml-2">
              -{discount}%
            </span>
          )}
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
              <span className="text-xs text-gray-500">({reviews} reviews)</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
