// components/cart/CartItem.tsx
"use client";

import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { TCartItem } from "@/src/types";

interface CartItemProps {
  item: TCartItem;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      removeItem(item.productId);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
        <p className="text-sm text-gray-500 mt-1">Unit Price: ৳{item.price}</p>
        <p className="text-sm font-semibold text-green-600 mt-1">
          Total: ৳{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            aria-label="Decrease quantity"
            size="sm"
            variant="flat"
            onPress={handleDecrease}
          >
            <Minus size={14} />
          </Button>
          
          <span className="w-8 text-center font-medium text-sm">
            {item.quantity}
          </span>
          
          <Button
            isIconOnly
            aria-label="Increase quantity"
            size="sm"
            variant="flat"
            onPress={handleIncrease}
          >
            <Plus size={14} />
          </Button>
        </div>
        
        <Button
          isIconOnly
          aria-label="Remove item"
          color="danger"
          size="sm"
          variant="light"
          onPress={() => removeItem(item.productId)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};
