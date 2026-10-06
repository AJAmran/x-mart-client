import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TCart, TCartItem } from "../types";
import axiosInstance from "@/src/lib/axios";

const syncWithBackend = async () => {
  if (typeof window === "undefined") return;

  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (localCart.length > 0) {
    await axiosInstance.post(`/cart`, { items: localCart });
  }
};

const syncCartQuietly = () => {
  void syncWithBackend().catch(() => {
    // Cart is still safely stored in localStorage if backend sync is unavailable.
  });
};

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
    if (!cart) return false;

    if (typeof item.stock === "number" && item.stock <= 0) {
      toast.error(`${item.name} is out of stock.`);

      return false;
    }

    const existingItem = cart.items.find(
      (i) => i.productId === item.productId
    );
    let updatedItems: TCartItem[];

    if (existingItem) {
      const nextQuantity = existingItem.quantity + item.quantity;

      if (typeof item.stock === "number" && nextQuantity > item.stock) {
        toast.error(`Only ${item.stock} unit${item.stock === 1 ? "" : "s"} of ${item.name} available.`);

        return false;
      }

      updatedItems = cart.items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: nextQuantity, stock: item.stock ?? i.stock }
          : i
      );
    } else {
      updatedItems = [...cart.items, item];
    }

    updateCartMutation.mutate(updatedItems, {
      onSuccess: () => {
        syncCartQuietly();
      }
    });
    toast.success(`${item.name} added to cart!`);

    return true;
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    if (!cart) return;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    updateCartMutation.mutate(updatedItems, {
      onSuccess: () => {
        syncCartQuietly();
      }
    });
    toast.success("Item removed from cart!");
  };

  // Update item quantity in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (!cart) return;
    
    if (quantity <= 0) {
      removeItem(productId);

      return;
    }

    const cartItem = cart.items.find((item) => item.productId === productId);

    if (!cartItem) return;

    if (typeof cartItem.stock === "number" && cartItem.stock <= 0) {
      toast.error(`${cartItem.name} is out of stock.`);

      return;
    }

    if (typeof cartItem.stock === "number" && quantity > cartItem.stock) {
      toast.error(`Only ${cartItem.stock} unit${cartItem.stock === 1 ? "" : "s"} of ${cartItem.name} available.`);

      return;
    }

    const updatedItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );

    updateCartMutation.mutate(updatedItems, {
      onSuccess: () => {
        syncCartQuietly();
      }
    });
  };

  // Clear cart
const clearCart = (options?: { silent?: boolean }) => {
    updateCartMutation.mutate([], {
      onSuccess: () => {
        syncCartQuietly();
      },
    });

    // `silent` is for flows that clear the cart as a side effect of something
    // else (e.g. returning from the payment gateway), where a "Cart cleared!"
    // toast would be confusing next to the real confirmation.
    if (!options?.silent) {
      toast.success("Cart cleared!");
    }
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
