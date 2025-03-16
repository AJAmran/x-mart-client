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

export const CartModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cart, clearCart } = useCart();

  console.log("Cart data in CartModal:", cart);

  return (
    <>
      <Button isIconOnly variant="light" onPress={onOpen} className="relative">
        <CartIcon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
        {cart.items.length > 0 && (
          <span className="absolute -top-[0px] right-[8px] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
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
              <ModalBody>
                {cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={clearCart}>
                  Clear Cart
                </Button>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
