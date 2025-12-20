import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/src/services/ProductServices";
import { TProduct } from "@/src/types";


export const useFeaturedProducts = () => {
  return useQuery<TProduct[], Error>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      // Fetch products with a reasonable limit
      const response = await getAllProducts(
        {}, // No filters
        { page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" }
      );

      const products = response?.data || [];

      // Ensure products is an array
      if (!Array.isArray(products)) {
        return [];
      }

      // Filter products with discounts
      const featuredProducts = products.filter((product: TProduct) => {
        return !!product.discount;
      });

      return featuredProducts;
    },
  });
};
