import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCart, getCart, updateCart } from "../services/CartService";
import { useEffect } from "react";
import { TCartItem } from "../types";
import { toast } from "sonner";

export const useCart = (userId?: string) => {
  const queryClient = useQueryClient();

  // Fetch cart from backend if user is authenticated
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => (userId ? getCart(userId) : null),
    enabled: !!userId,
  });

  // Fetch cart from local storage if user is not authenticated
  useEffect(() => {
    if (!userId) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      queryClient.setQueryData(["cart"], localCart, {
        updatedAt: Date.now(), // Force update
      });
    }
  }, [userId, queryClient]);

  // Get the cart data from the React Query cache
  const cartData = queryClient.getQueryData<TCartItem[]>(["cart"]) || [];

  // Calculate total price and total items
  const totalPrice = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalItems = cartData.reduce((acc, item) => acc + item.quantity, 0);

  // Update cart (sync with backend if authenticated, else update local storage)
  const updateCartMutation = useMutation({
    mutationFn: async (items: TCartItem[]) => {
      if (userId) {
        return await updateCart(userId, items); // Sync with backend
      } else {
        return items; // Update local storage
      }
    },
    onMutate: async (newItems) => {
      // Cancel any outgoing refetches to avoid overwriting the optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart", userId] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData<TCartItem[]>([
        "cart",
        userId,
      ]);

      // Optimistically update the cart
      queryClient.setQueryData(["cart", userId], newItems);

      // Return a context object with the previous cart data
      return { previousCart };
    },
    onError: (error, newItems, context) => {
      // Rollback to the previous cart data if the mutation fails
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", userId], context.previousCart);
      }
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["cart", userId], data);
      } else {
        localStorage.setItem("cart", JSON.stringify(data));
        queryClient.setQueryData(["cart"], data);
      }
      toast.success("Cart updated successfully");
    },
  });

  // Delete cart (sync with backend if authenticated, else clear local storage)
  const deleteCartMutation = useMutation({
    mutationFn: async () => {
      if (userId) {
        return await deleteCart(userId); // Sync with backend
      } else {
        return null; // Clear local storage
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.setQueryData(["cart", userId], null);
      } else {
        localStorage.removeItem("cart");
        queryClient.setQueryData(["cart"], null);
      }
      toast.success("Cart deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Add item to cart
  const addItem = (item: TCartItem) => {
    const updatedItems = [...cartData, item];
    updateCartMutation.mutate(updatedItems);
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    const updatedItems = cartData.filter(
      (item) => item.productId !== productId
    );
    updateCartMutation.mutate(updatedItems);
  };

  // Update item quantity in cart
  const updateQuantity = (productId: string, quantity: number) => {
    const updatedItems = cartData.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    updateCartMutation.mutate(updatedItems);
  };

  // Clear cart
  const clearCart = () => {
    deleteCartMutation.mutate();
  };

  return {
    cart: { items: cartData, totalPrice, totalItems },
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
