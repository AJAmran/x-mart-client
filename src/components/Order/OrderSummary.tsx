"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { TCartItem } from "@/src/types";

interface Cart {
  items: TCartItem[];
  totalPrice: number;
}

interface OrderSummaryProps {
  cart: Cart;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  updateQuantity,
  removeItem,
}) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <p className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </CardHeader>
      <CardBody className="gap-4">
        {cart.items.length > 0 ? (
          <>
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
              >
                <Image
                  removeWrapper
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover"
                  src={item.image || "/placeholder.jpg"}
                />
                <div className="min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        Tk {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold">
                      Tk {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="grid h-9 w-28 grid-cols-3 overflow-hidden rounded-md border border-line-hairline">
                      <Button
                        isIconOnly
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="h-full min-w-0 rounded-none text-content"
                        isDisabled={item.quantity <= 1}
                        radius="none"
                        size="sm"
                        variant="light"
                        onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus aria-hidden size={14} />
                      </Button>
                      <span
                        aria-label={`Quantity of ${item.name}`}
                        className="tabular flex items-center justify-center border-x border-line-hairline text-body-sm font-semibold text-content"
                        role="status"
                      >
                        {item.quantity}
                      </span>
                      <Button
                        isIconOnly
                        aria-label={`Increase quantity of ${item.name}`}
                        className="h-full min-w-0 rounded-none text-content"
                        isDisabled={!!item.stock && item.quantity >= item.stock}
                        radius="none"
                        size="sm"
                        variant="light"
                        onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus aria-hidden size={14} />
                      </Button>
                    </div>
                    <Button
                      isIconOnly
                      aria-label={`Remove ${item.name}`}
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => removeItem(item.productId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Tk {cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>Calculated after review</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <h4 className="font-bold">Total</h4>
                <p className="text-xl font-bold">Tk {cart.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-900">
            Your cart is empty.
          </p>
        )}
      </CardBody>
    </Card>
  );
};

export default OrderSummary;
