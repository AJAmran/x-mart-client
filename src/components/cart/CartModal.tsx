"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { CartIcon } from "../icons";
import { Button } from "@nextui-org/button";
import { CartItem } from "./CartItem";
import { useCart } from "@/src/hooks/useCart";
import Link from "next/link";

export const CartModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cart, clearCart } = useCart();

  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen} className="relative">
        <CartIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {cart.items.length > 0 && (
          <span className="absolute -top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {cart.items.length}
          </span>
        )}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Your Cart
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-y-auto">
                {cart.items.length > 0 ? (
                  <>
                    {cart.items.map((item) => (
                      <CartItem key={item.productId} item={item} />
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
                      <h4 className="font-bold">Total</h4>
                      <p className="text-lg font-bold">
                        ৳{cart.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button color="danger" variant="light" onPress={clearCart}>
                  Clear Cart
                </Button>
                <div className="flex gap-2">
                  <Button color="primary" onPress={onClose}>
                    Continue Shopping
                  </Button>
                  <Button
                    color="success"
                    as={Link}
                    href="/checkout"
                    onPress={onClose}
                    isDisabled={cart.items.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
