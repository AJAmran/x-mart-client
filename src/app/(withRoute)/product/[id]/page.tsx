"use client";

import { useParams } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Badge } from "@nextui-org/badge";
import { Card, CardBody } from "@nextui-org/card";
import { ShoppingCart, Star, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useProductById, useProducts } from "@/src/hooks/useProducts";
import ProductCard from "@/src/components/UI/ProductCard"; // Import your ProductCard
import { TProduct } from "@/src/types";
import CardSkeletons from "@/src/components/CardSkelton";

const ProductDetailsPage = () => {
  const { id } = useParams();

  // Fetch the product details using the useProductById hook
  const { data: response, isLoading, isError } = useProductById(id as string);

  // Extract the product data from the response
  const product = response?.data;

  // Fetch relevant products (e.g., same category)
  const { data: relevantProductsResponse } = useProducts(
    { category: product?.category },
    { page: 1, limit: 12, sortBy: "createdAt", sortOrder: "desc" }
  );

  // Filter out the current product from the relevant products list
  const relevantProducts = (relevantProductsResponse?.data || []).filter(
    (p: TProduct) => p._id !== product?._id
  );

  console.log("Product Details:", product);

  const handleAddToCart = () => {
    toast.success(`${product?.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Failed to load product details.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Home</span>
        <ChevronRight size={14} className="mx-2" />
        <span>Products</span>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
      </div>

      {/* Product Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-[500px] object-contain"
            isZoomed
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
            </div>
            <span className="text-sm text-gray-500">(4.5/5)</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              ${product.price}
            </span>
            {product.discount?.value && (
              <span className="text-md line-through text-gray-500">
                ${product.price}
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
              <Badge color="success" variant="flat">
                In Stock
              </Badge>
            ) : (
              <Badge color="warning" variant="flat">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="solid"
            color="primary"
            className="w-full h-14 text-lg"
            onPress={handleAddToCart}
            isDisabled={product.stock <= 0}
            startContent={<ShoppingCart size={20} />}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Relevant Products Section */}
      {/* Relevant Products Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relevantProductsResponse?.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeletons key={i} />)
            : relevantProducts.map((product: TProduct) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onPress={() =>
                    (window.location.href = `/product/${product._id}`)
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
