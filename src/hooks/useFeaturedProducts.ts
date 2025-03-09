import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/src/services/ProductServices";
import { TProduct } from "@/src/types";

// Hook to fetch featured products (products with discounts)
export const useFeaturedProducts = () => {
  return useQuery<TProduct[], Error>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      // Fetch all products
      const response = await getAllProducts(
        {}, // No filters
        { page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" } 
      );

      // Log the API response for debugging
      console.log("API Response:", response);

      // Access the products array from response.data
      const products = response?.data || [];

      // Ensure products is an array
      if (!Array.isArray(products)) {
        console.error("Expected an array of products, but got:", products);
        return [];
      }

      // Filter products with discounts
      const featuredProducts = products.filter((product: TProduct) => {
        return !!product.discount; 
      });

      // Log the filtered products for debugging
      console.log("Featured Products:", featuredProducts);

      return featuredProducts;
    },
  });
};
