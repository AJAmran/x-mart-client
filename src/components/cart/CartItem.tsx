"use client";

import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { useCart } from "@/src/hooks/useCart";
import { TCartItem } from "@/src/types";

interface CartItemProps {
  item: TCartItem;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
      {/* Product Image and Details */}
      <div className="flex items-center gap-4">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h4 className="font-bold">{item.name}</h4>
          <p className="text-sm text-gray-500">Unit Price: ৳{item.price}</p>
          <p className="text-sm text-gray-500">
            Total: ৳{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity Controls and Remove Button */}
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
