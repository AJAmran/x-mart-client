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
import { categoriesData } from "@/src/data/CategoriesData";
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
      className="space-y-6 p-6 bg-white shadow-lg rounded-md max-w-xl"
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

      {/* Stock */}
      <Input
        {...register("stock", { valueAsNumber: true })}
        errorMessage={errors.stock?.message}
        isInvalid={!!errors.stock}
        label="Stock"
        min="0"
        placeholder="Enter product stock"
        type="number"
      />

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
