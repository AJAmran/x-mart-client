"use client";

import { Button } from "@nextui-org/button";

import { useCart } from "@/src/hooks/useCart";
import { TCartItem } from "@/src/types";

interface CartItemProps {
    item: TCartItem; // Define the type of the item prop
  }
  

  export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  console.log("Cart item data:", item); // Add this log

  return (
    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
      <div>
        <h4 className="font-bold">{item.name}</h4>
        <p className="text-sm text-gray-500">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onPress={() => updateQuantity(item.productId, item.quantity - 1)}
          isDisabled={item.quantity <= 1}
        >
          -
        </Button>
        <span>{item.quantity}</span>
        <Button
          size="sm"
          onPress={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          +
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="light"
          onPress={() => removeItem(item.productId)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
