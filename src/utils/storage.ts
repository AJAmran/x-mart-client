// utils/storage.ts
export const StorageUtils = {
  // Cart
  getCart: (): any[] => {
    if (typeof window === "undefined") return [];

    return JSON.parse(localStorage.getItem("cart") || "[]");
  },

  setCart: (cart: any[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  // Wishlist
  getWishlist: (): any[] => {
    if (typeof window === "undefined") return [];
    
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  },

  setWishlist: (wishlist: any[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  },

  // Clear all
  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
  },
};