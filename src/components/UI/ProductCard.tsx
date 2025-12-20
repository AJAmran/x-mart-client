"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { TProduct } from "@/src/types";
import { ShoppingCart, Eye, Tag, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks/useCart";
import { useWishlist } from "@/src/hooks/useWishlist";

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
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      stock: product.inventories?.[0]?.stock,
    };

    addItem(cartItem);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlistLoading(true);

    if (!product._id) {
      setIsWishlistLoading(false);

      return;
    }

    const wishlistItem = {
      productId: product._id,
      price: product.price,
      name: product.name,
      image: product.images?.[0] || "/placeholder.jpg",
      stock: product.inventories?.[0]?.stock,
    };

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(wishlistItem);
    }

    setTimeout(() => {
      setIsWishlistLoading(false);
    }, 500);
  };

  const handleCardClick = () => {
    if (onPress) onPress();
  };

  const discountedPrice = product?.discount?.value
    ? product.discount.type === "percentage"
      ? (product.price * (1 - product.discount.value / 100)).toFixed(2)
      : (product.price - product.discount.value).toFixed(2)
    : product.price;

  const isProductInCart = isInCart(product._id);
  const isProductInWishlist = isInWishlist(product._id);

  if (variant === "category") {
    return (
      <Link
        aria-label={`Explore ${product.name} category`}
        className="block w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px]"
        href={`/category/${product.category}`}
      >
        <Card
          className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
          role="presentation"
          onClick={handleCardClick}
        >
          <div className="relative h-full">
            <Image
              removeWrapper
              alt={product.name}
              className="w-full h-full object-cover"
              src={product.images?.[0] || "/placeholder.jpg"}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold text-white truncate">
                {product.name}
              </h3>
              <Button
                className="mt-3 bg-primary-600 text-white hover:bg-primary-700"
                color="primary"
                size="sm"
                variant="flat"
                onClick={(e) => e.stopPropagation()}
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
      className="block w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px]"
      href={`/product/${product._id}`}
    >
      <Card
        className="h-full border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white relative"
        role="presentation"
        shadow="sm"
        onClick={handleCardClick}
      >
        {/* Discount Badge */}
        {(product?.discount?.value ?? 0) > 0 && (
          <div className="absolute top-3 left-3 z-40 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Tag className="mr-1" size={12} />
            {product.discount?.value}
            {product.discount?.type === "percentage" ? "%" : "৳"} OFF
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          isIconOnly
          className="absolute top-3 right-3 z-40 bg-white/90 backdrop-blur-sm"
          isLoading={isWishlistLoading}
          size="sm"
          variant="flat"
          onClick={handleWishlistToggle} // ✅ FIXED
        >
          <Heart
            className={isProductInWishlist ? "fill-red-500 text-red-500" : ""}
            size={16}
          />
        </Button>

        {/* Image Section */}
        <div className="relative flex justify-center items-center bg-gray-50 p-4">
          <Image
            isZoomed
            alt={product.name}
            className="w-full h-48 object-contain"
            height={192}
            src={product.images?.[0] || "/placeholder.jpg"}
            width={240}
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
            className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm"
            size="sm"
            startContent={<Eye size={16} />}
            variant="flat"
            onClick={(e) => {
              e.preventDefault(); // Stop Link navigation
              e.stopPropagation();
              router.push(`/product/${product._id}`);
            }}
          >
            Details
          </Button>
          <Button
            color={isProductInCart ? "success" : "primary"}
            isDisabled={!product.inventories?.[0]?.stock}
            isLoading={isLoading}
            size="sm"
            startContent={isProductInCart ? null : <ShoppingCart size={16} />}
            variant="solid"
            onClick={handleAddToCart} // ✅ FIXED
          >
            {isProductInCart
              ? "In Cart"
              : product.inventories?.[0]?.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
