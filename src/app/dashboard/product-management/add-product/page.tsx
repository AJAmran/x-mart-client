"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/src/hooks/useProducts";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/src/validations/productSchema";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { categoriesData } from "@/src/data/CategoriesData";
import { useBranches } from "@/src/hooks/useBranch";

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "ACTIVE",
      availability: "ALL_BRANCHES",
      operationType: "REGULAR",
      sku: `SKU-${Date.now()}`,
      inventories: [{ stock: 0, branchId: "", lowStockThreshold: 5 }],
      images: [""],
    }
  });

  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: branchesResponse } = useBranches();
  const branches = branchesResponse?.data || [];

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      createProduct(data as any, {
        onSuccess: () => {
          toast.success("Product created successfully");
          reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create product");
        },
      });
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <form
      className="space-y-6 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg rounded-md max-w-xl w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-semibold text-gray-700">Add New Product</h2>

      {/* Product Name */}
      <Input
        {...register("name")}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
        label="Product Name"
        placeholder="Enter product name"
      />

      {/* Description */}
      <Textarea
        {...register("description")}
        errorMessage={errors.description?.message}
        isInvalid={!!errors.description}
        label="Description"
        placeholder="Enter product description"
      />

      {/* Price */}
      <Input
        {...register("price", { valueAsNumber: true })}
        errorMessage={errors.price?.message}
        isInvalid={!!errors.price}
        label="Price"
        min="0"
        placeholder="Enter product price"
        step="0.01"
        type="number"
      />

      {/* Category */}
      <Select
        {...register("category")}
        errorMessage={errors.category?.message}
        isInvalid={!!errors.category}
        label="Category"
        placeholder="Select category"
      >
        {categoriesData.map((category) => (
          <SelectItem
            key={category.id}
            value={category.id}
          >
            {category.name}
          </SelectItem>
        ))}
      </Select>

      {/* SKU */}
      <Input
        {...register("sku")}
        errorMessage={errors.sku?.message}
        isInvalid={!!errors.sku}
        label="SKU"
        placeholder="Enter product SKU"
      />

      {/* Stock */}
      <Input
        {...register("inventories.0.stock", { valueAsNumber: true })}
        errorMessage={errors.inventories?.[0]?.stock?.message}
        isInvalid={!!errors.inventories?.[0]?.stock}
        label="Stock"
        min="0"
        placeholder="Enter product stock"
        type="number"
      />

      {/* Branch */}
      <Select
        {...register("inventories.0.branchId")}
        errorMessage={errors.inventories?.[0]?.branchId?.message}
        isInvalid={!!errors.inventories?.[0]?.branchId}
        label="Branch"
        placeholder="Select a branch"
      >
        {branches.map((branch: any) => (
          <SelectItem key={branch._id} value={branch._id}>
            {branch.name}
          </SelectItem>
        ))}
      </Select>

      {/* Image URL */}
      <Input
        {...register("images.0")}
        errorMessage={errors.images?.[0]?.message || errors.images?.message}
        isInvalid={!!errors.images}
        label="Image URL"
        placeholder="Enter product image URL"
      />

      {/* Submit Button */}
      <Button
        fullWidth
        color="primary"
        disabled={isPending || isSubmitting}
        isLoading={isPending || isSubmitting}
        type="submit"
      >
        {isPending || isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default AddProductForm;
