"use client";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";

import { TCartItem } from "@/src/types";

// Define the type for the cart
interface Cart {
  items: TCartItem[];
  totalPrice: number;
}

// Define the props for the OrderSummary component
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
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Order Summary</h2>
      </CardHeader>
      <CardBody>
        {cart.items.length > 0 ? (
          <>
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    src={item.image || "/placeholder.jpg"}
                  />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      ৳{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    isDisabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="sm"
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
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
            ))}
            <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
              <h4 className="font-bold">Total</h4>
              <p className="text-lg font-bold">৳{cart.totalPrice.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default OrderSummary;
