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

const AddProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TProduct>({
    resolver: zodResolver(productSchema),
  });

  const { mutate: createProduct, isPending } = useCreateProduct();

  const onSubmit: SubmitHandler<TProduct> = async (data) => {
    try {
      const updatedData = {
        ...data,
        category: data.category.toUpperCase(),
      };
      console.log(updatedData);
      createProduct(updatedData);
      reset();
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
          <SelectItem key={category.id} value={category.id}>
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
      />

      {/* Image URL */}
      <Input
        {...register("images.0")}
        label="Image URL"
        placeholder="Enter product image URL"
        isInvalid={!!errors.images}
        errorMessage={errors.images?.message}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        color="primary"
        isLoading={isPending || isSubmitting}
        disabled={isPending || isSubmitting}
      >
        {isPending || isSubmitting ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default AddProductForm;
