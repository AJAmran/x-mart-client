"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProduct } from "@/src/hooks/useProducts";
import { toast } from "sonner";
import { TProduct } from "@/src/types";
import { productSchema } from "@/src/validations/productSchema";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { categoriesData } from "@/src/data/CategoriestData";
import { PRODUCT_CATEGORY } from "@/src/constants";

// Create a form-specific type that includes the stock field
type ProductFormData = Omit<TProduct, "inventories"> & {
  stock: number;
};

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const { mutate: createProduct, isPending } = useCreateProduct();

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      // Transform data to match TProduct type
      const productData: TProduct = {
        ...data,
        category: data.category.toLowerCase() as keyof typeof PRODUCT_CATEGORY,
        inventories: [
          {
            stock: Number(data.stock),
            lowStockThreshold: 5, // Set your default threshold
            branchId: "main-branch", // Set your default branch ID
          },
        ],
        images: data.images?.[0] ? [data.images[0]] : [],
        status: "ACTIVE", // Match your PRODUCT_STATUS enum
        availability: "ALL_BRANCHES", // Set default availability
        operationType: "REGULAR", // Set default operation type
        sku: `SKU-${Date.now()}`, // Generate a default SKU or make this a required field
      };

      createProduct(productData, {
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
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white shadow-lg rounded-md max-w-xl"
    >
      <h2 className="text-2xl font-semibold text-gray-700">Add New Product</h2>

      {/* Product Name */}
      <Input
        {...register("name")}
        label="Product Name"
        placeholder="Enter product name"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />

      {/* Description */}
      <Textarea
        {...register("description")}
        label="Description"
        placeholder="Enter product description"
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      />

      {/* Price */}
      <Input
        {...register("price", { valueAsNumber: true })}
        type="number"
        label="Price"
        placeholder="Enter product price"
        isInvalid={!!errors.price}
        errorMessage={errors.price?.message}
        min="0"
        step="0.01"
      />

      {/* Category */}
      <Select
        {...register("category")}
        label="Category"
        placeholder="Select category"
        isInvalid={!!errors.category}
        errorMessage={errors.category?.message}
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

      {/* Stock */}
      <Input
        {...register("stock", { valueAsNumber: true })}
        type="number"
        label="Stock"
        placeholder="Enter product stock"
        isInvalid={!!errors.stock}
        errorMessage={errors.stock?.message}
        min="0"
      />

      {/* Image URL */}
      <Input
        {...register("images.0")}
        label="Image URL"
        placeholder="Enter product image URL"
        isInvalid={!!errors.images}
        errorMessage={errors.images?.[0]?.message || errors.images?.message}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        color="primary"
        isLoading={isPending || isSubmitting}
        disabled={isPending || isSubmitting}
        fullWidth
      >
        {isPending || isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default AddProductForm;