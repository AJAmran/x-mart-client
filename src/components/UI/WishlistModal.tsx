// components/wishlist/WishlistModal.tsx
"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Badge } from "@nextui-org/badge";
import { useWishlist } from "@/src/hooks/useWishlist";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";

export const WishlistModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { wishlist, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (productId: string) => {
    const item = wishlist.items.find(item => item.productId === productId);

    if (item) {
      const cartItem = {
        productId: item.productId,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image,
        stock: item.stock,
      };

      addItem(cartItem);
      removeItem(productId);
    }
  };

  const handleViewProduct = (productId: string, onClose: () => void) => {
    onClose();
    window.location.href = `/product/${productId}`;
  };

  return (
    <>
      <Badge
        color="danger"
        content={wishlist.totalItems}
        isInvisible={wishlist.totalItems === 0}
        size="sm"
      >
        <Button
          isIconOnly
          aria-label="Wishlist"
          className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          variant="light"
          onPress={onOpen}
        >
          <Heart className="w-5 h-5" />
        </Button>
      </Badge>

      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-semibold">
                    My Wishlist ({wishlist.totalItems})
                  </h2>
                </div>
              </ModalHeader>

              <ModalBody className="p-0">
                {wishlist.items.length > 0 ? (
                  <div className="divide-y dark:divide-gray-700">
                    {wishlist.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Image
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            height={80}
                            src={item.image || "/placeholder.jpg"}
                            width={80}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            ৳{item.price}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Added {new Date(item.addedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>

                          {/* Stock Status */}
                          <div className="mt-2">
                            {item.stock && item.stock > 0 ? (
                              <span className="text-xs text-green-500">In Stock</span>
                            ) : (
                              <span className="text-xs text-red-500">Out of Stock</span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            color="primary"
                            isDisabled={!item.stock || item.stock <= 0}
                            size="sm"
                            startContent={<ShoppingCart size={14} />}
                            variant="flat"
                            onPress={() => handleMoveToCart(item.productId)}
                          >
                            Add to Cart
                          </Button>

                          <div className="flex gap-1">
                            <Button
                              isIconOnly
                              aria-label="View product"
                              size="sm"
                              variant="flat"
                              onPress={() => handleViewProduct(item.productId, onClose)}
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              aria-label="Remove from wishlist"
                              color="danger"
                              size="sm"
                              variant="light"
                              onPress={() => removeItem(item.productId)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      Your wishlist is empty
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      Save items you love for later!
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      onPress={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                )}
              </ModalBody>

              {wishlist.items.length > 0 && (
                <ModalFooter className="flex justify-between border-t dark:border-gray-700">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={clearWishlist}
                  >
                    Clear All
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="light"
                      onPress={onClose}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      as={Link}
                      color="success"
                      href="/products"
                      onPress={onClose}
                    >
                      Browse Products
                    </Button>
                  </div>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
