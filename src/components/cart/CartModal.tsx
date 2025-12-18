// components/cart/CartModal.tsx
"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/badge";
import { CartItem } from "./CartItem";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";

export const CartModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cart, clearCart } = useCart();

  return (
    <>
      <Badge 
        content={cart.totalItems} 
        color="danger" 
        size="sm"
        isInvisible={cart.totalItems === 0}
      >
        <Button 
          isIconOnly 
          variant="light" 
          onPress={onOpen}
          className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </Badge>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold">
                    My Cart ({cart.totalItems})
                  </h2>
                </div>
              </ModalHeader>
              
              <ModalBody className="p-0">
                {cart.items.length > 0 ? (
                  <>
                    <div className="divide-y dark:divide-gray-700">
                      {cart.items.map((item) => (
                        <CartItem key={item.productId} item={item} />
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-bold text-lg">Total Amount</h4>
                      <p className="text-lg font-bold text-green-600">
                        ৳{cart.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      Add some items to get started!
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
              
              {cart.items.length > 0 && (
                <ModalFooter className="flex justify-between border-t dark:border-gray-700">
                  <Button 
                    color="danger" 
                    variant="light" 
                    startContent={<Trash2 size={16} />}
                    onPress={clearCart}
                  >
                    Clear Cart
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
                      color="success"
                      as={Link}
                      href="/checkout"
                      onPress={onClose}
                    >
                      Checkout
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
