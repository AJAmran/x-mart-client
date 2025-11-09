// hooks/useWishlist.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TWishlist, TWishlistItem } from "../types";

export const useWishlist = () => {
  const queryClient = useQueryClient();

  // Fetch wishlist from local storage
  const { data: wishlist } = useQuery<TWishlist>({
    queryKey: ["wishlist"],
    queryFn: () => {
      if (typeof window === "undefined") {
        return { items: [], totalItems: 0 };
      }
      
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      return {
        items: localWishlist,
        totalItems: localWishlist.length,
      };
    },
  });

  // Update wishlist in local storage
  const updateWishlistMutation = useMutation({
    mutationFn: (items: TWishlistItem[]) => {
      return new Promise<TWishlist>((resolve) => {
        localStorage.setItem("wishlist", JSON.stringify(items));
        resolve({
          items,
          totalItems: items.length,
        });
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], data);
    },
  });

  // Add item to wishlist
  const addItem = (item: Omit<TWishlistItem, "addedAt">) => {
    if (!wishlist) return;

    const existingItem = wishlist.items.find(
      (i) => i.productId === item.productId
    );

    if (existingItem) {
      toast.info("Item is already in your wishlist!");

      return;
    }

    const wishlistItem: TWishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    const updatedItems = [...wishlist.items, wishlistItem];

    updateWishlistMutation.mutate(updatedItems);
    toast.success(`${item.name} added to wishlist!`);
  };

  // Remove item from wishlist
  const removeItem = (productId: string) => {
    if (!wishlist) return;

    const updatedItems = wishlist.items.filter(
      (item) => item.productId !== productId
    );

    updateWishlistMutation.mutate(updatedItems);
    toast.success("Item removed from wishlist!");
  };

  // Move item from wishlist to cart
  const moveToCart = (productId: string, useCart: any) => {
    if (!wishlist) return;

    const item = wishlist.items.find(item => item.productId === productId);
    
    if (item) {
      const cartItem = {
        productId: item.productId,
        quantity: 1,
        price: item.price,
        name: item.name,
        image: item.image,
      };
      
      useCart.addItem(cartItem);
      removeItem(productId);
      toast.success(`${item.name} moved to cart!`);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId: string): boolean => {
    if (!wishlist) return false;
    
    return wishlist.items.some(item => item.productId === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    updateWishlistMutation.mutate([]);
    toast.success("Wishlist cleared!");
  };

  return {
    wishlist: wishlist || { items: [], totalItems: 0 },
    addItem,
    removeItem,
    moveToCart,
    isInWishlist,
    clearWishlist,
  };
};