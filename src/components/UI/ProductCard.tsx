"use client";

import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { useState } from "react";
import { TProduct } from "@/src/types";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/src/hooks/useCart";

type ProductCardProps = {
  product: TProduct;
  onPress: () => void;
};

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    setIsLoading(true);
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

  const discountedPrice = product?.discount?.value
    ? (product.price * (1 - product.discount.value / 100)).toFixed(2)
    : product.price;

  return (
    <Card
      shadow="sm"
      className="w-full max-w-sm border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image Section with Discount Badge */}
      <div className="relative flex justify-center items-center bg-white p-4">
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          width={240}
          height={240}
          className="w-full h-48 object-contain"
          isZoomed
        />
      </div>

      {/* Product Details */}
      <CardBody className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>

        {/* Product Description */}
        <p className="text-sm mt-1 line-clamp-2">{product.description}</p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-bold text-green-600">
            ৳{discountedPrice}
          </span>
          {(product?.discount?.value ?? 0) > 0 && (
            <span className="text-md line-through text-gray-500">
              ৳{product.price}
            </span>
          )}
          {(product?.discount?.value ?? 0) > 0 && (
            <span className="ml-2 text-sm text-red-500">
              -{product?.discount?.value}%
            </span>
          )}
        </div>
      </CardBody>

      {/* Action Buttons */}
      <CardFooter className="p-4 flex justify-between gap-2">
        {/* Link for product details */}
        <Link href={`/product/${product?._id}`} passHref legacyBehavior>
          <Button
            as="a" // Render the Button as an anchor tag
            variant="flat"
            className="flex-1"
            startContent={<Eye size={18} />}
          >
            View Details
          </Button>
        </Link>

        <Button
          variant="solid"
          className="flex-1"
          isLoading={isLoading}
          onPress={handleAddToCart}
          isDisabled={product.stock <= 0}
          startContent={<ShoppingCart size={18} />}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
