import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/src/services/ProductServices";
import { TProduct } from "@/src/types";

export const useFeaturedProducts = () => {
  return useQuery<TProduct[], Error>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await getAllProducts(
        {},
        { page: 1, limit: 50, sortBy: "createdAt", sortOrder: "desc" },
      );

      const products = response?.data || [];

      if (!Array.isArray(products)) {
        return [];
      }

      const featuredProducts = products.filter((product: TProduct) => {
        return !!product.discount;
      });

      return featuredProducts;
    },
  });
};
