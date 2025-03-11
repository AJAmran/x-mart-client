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
    formState: { errors },
    reset,
  } = useForm<TProduct>({
    resolver: zodResolver(productSchema),
  });

  const { mutate: createProduct, isPending } = useCreateProduct();

  const onSubmit: SubmitHandler<TProduct> = (data) => {
    // Transform the category to uppercase before sending to the backend
    const updatedData = {
      ...data,
      category: data.category.toUpperCase(), // Convert category to uppercase
    };

    createProduct(updatedData, {
      onSuccess: () => {
        toast.success("Product created successfully!");
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create product");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register("name")}
        label="Product Name"
        placeholder="Enter product name"
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
      />
      <Textarea
        {...register("description")}
        label="Description"
        placeholder="Enter product description"
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
      />
      <Input
        {...register("price", { valueAsNumber: true })}
        type="number"
        label="Price"
        placeholder="Enter product price"
        isInvalid={!!errors.price}
        errorMessage={errors.price?.message}
      />
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
      <Input
        {...register("stock", { valueAsNumber: true })}
        type="number"
        label="Stock"
        placeholder="Enter product stock"
        isInvalid={!!errors.stock}
        errorMessage={errors.stock?.message}
      />
      <Input
        {...register("images.0")}
        label="Image URL"
        placeholder="Enter product image URL"
        isInvalid={!!errors.images}
        errorMessage={errors.images?.message}
      />
      <Button type="submit" color="primary" isLoading={isPending}>
        {isPending ? "Creating..." : "Create Product"}
      </Button>
    </form>
  );
};

export default AddProductForm;
