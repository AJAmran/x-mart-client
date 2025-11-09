// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TCart, TCartItem } from "../types";

export const useCart = () => {
  const queryClient = useQueryClient();

  // Fetch cart from local storage
  const { data: cart } = useQuery<TCart>({
    queryKey: ["cart"],
    queryFn: () => {
      if (typeof window === "undefined") {
        return { items: [], totalPrice: 0, totalItems: 0 };
      }
      
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      return {
        items: localCart,
        totalPrice: localCart.reduce(
          (acc: number, item: TCartItem) => acc + item.price * item.quantity,
          0
        ),
        totalItems: localCart.reduce(
          (acc: number, item: TCartItem) => acc + item.quantity,
          0
        ),
      };
    },
  });

  // Update cart in local storage
  const updateCartMutation = useMutation({
    mutationFn: (items: TCartItem[]) => {
      return new Promise<TCart>((resolve) => {
        localStorage.setItem("cart", JSON.stringify(items));
        resolve({
          items,
          totalPrice: items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
          totalItems: items.reduce((acc, item) => acc + item.quantity, 0),
        });
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });

  // Add item to cart
  const addItem = (item: TCartItem) => {
    if (!cart) return;

    const existingItem = cart.items.find(
      (i) => i.productId === item.productId
    );
    let updatedItems: TCartItem[];

    if (existingItem) {
      updatedItems = cart.items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedItems = [...cart.items, item];
    }

    updateCartMutation.mutate(updatedItems);
    toast.success(`${item.name} added to cart!`);
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    updateCartMutation.mutate(updatedItems);
    toast.success("Item removed from cart!");
  };

  // Update item quantity in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return;
    
    if (quantity <= 0) {
      removeItem(productId);

      return;
    }

    const updatedItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    updateCartMutation.mutate(updatedItems);
  };

  // Clear cart
  const clearCart = () => {
    updateCartMutation.mutate([]);
    toast.success("Cart cleared!");
  };

  // Check if item is in cart
  const isInCart = (productId: string): boolean => {
    if (!cart) return false;
    
    return cart.items.some(item => item.productId === productId);
  };

  return {
    cart: cart || { items: [], totalPrice: 0, totalItems: 0 },
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };
};