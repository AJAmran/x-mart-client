import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo } from "react";
import { TProduct, TDiscount } from "@/src/types/index";
import * as productService from "@/src/services/ProductServices";
import { PRODUCT_CATEGORY } from "../constants";

export const useProducts = (
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    availability?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    branchId?: string;
    hasDiscount?: boolean;
  } = {},
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
) => {
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  return useQuery({
    queryKey: ["products", stableFilters, stableOptions],
    queryFn: () => productService.getAllProducts(stableFilters, stableOptions),
    placeholderData: (prev) => prev,
  });
};

export const useAdvancedProductSearch = (
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    availability?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    maxStock?: number;
    branchId?: string;
    hasDiscount?: boolean;
  } = {},
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
) => {
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  return useQuery({
    queryKey: ["products", "advanced", stableFilters, stableOptions],
    queryFn: () =>
      productService.advancedProductSearch(stableFilters, stableOptions),
    placeholderData: (prev) => prev,
  });
};

export const useProductsByBranch = (
  branchId: string,
  filters: {
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    status?: string;
    operationType?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
  } = {},
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
) => {
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  return useQuery({
    queryKey: ["products", "branch", branchId, stableFilters, stableOptions],
    queryFn: () =>
      productService.getProductsByBranch(
        branchId,
        stableFilters,
        stableOptions
      ),
    enabled: !!branchId,
  });
};

export const useProductById = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => (id ? productService.getProductById(id) : null),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TProduct> }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      branchId,
      stock,
    }: {
      id: string;
      branchId: string;
      stock: number;
    }) => productService.updateStock(id, branchId, stock),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      toast.success("Stock updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useApplyDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, discount }: { id: string; discount: TDiscount }) =>
      productService.applyDiscount(id, discount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      toast.success("Discount applied successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useRemoveDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.removeDiscount(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables] });
      toast.success("Discount removed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useMainCategories = () => {
  return useQuery({
    queryKey: ["categories", "main"],
    queryFn: productService.getMainCategories,
    staleTime: Infinity,
  });
};

export const useSubCategories = (category?: string) => {
  return useQuery({
    queryKey: ["categories", "sub", category],
    queryFn: () => productService.getSubCategories(category),
    enabled: !!category,
    staleTime: Infinity,
  });
};


// Get products by main category
export const useProductsByCategory = (category?: keyof typeof PRODUCT_CATEGORY) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => 
      productService.getAllProducts({
        category,
        status: "ACTIVE",
      }, {
        limit: 10, 
        sortBy: "createdAt",
        sortOrder: "desc"
      }),
    enabled: !!category,
    select: (data) => data.data,
  });
};

export const useFeaturedCategories = () => {
  return Object.keys(PRODUCT_CATEGORY) as (keyof typeof PRODUCT_CATEGORY)[];
};


// Get Offers Product
export const useDiscountedProducts = (limit?: number) => {
  return useQuery({
    queryKey: ["products", "discounted"],
    queryFn: () => 
      productService.advancedProductSearch({
        hasDiscount: true,
        status: "ACTIVE"
      }, {
        limit: limit || 12,
        sortBy: "price",
        sortOrder: "desc"
      }),
    select: (data) => data.data,
  });
};


