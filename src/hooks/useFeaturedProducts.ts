import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/src/services/ProductServices";
import { TProduct } from "@/src/types";

// Hook to fetch featured products (products with active discounts)
export const useFeaturedProducts = () => {
  return useQuery<TProduct[], Error>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      // Fetch all products
      const response = await getAllProducts(
        {}, // No filters
        { page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" } // Adjust pagination as needed
      );
      // Filter products with active discounts
      const featuredProducts = response.data.filter((product: TProduct) => {
        if (!product.discount) return false; // Skip products without discounts

        const now = new Date();
        const startDate = product.discount.startDate
          ? new Date(product.discount.startDate)
          : null;
        const endDate = product.discount.endDate
          ? new Date(product.discount.endDate)
          : null;

        // Check if the discount is active
        const isDiscountActive =
          (!startDate || now >= startDate) && (!endDate || now <= endDate);

        return isDiscountActive;
      });

      return featuredProducts;
    },
  });
};
