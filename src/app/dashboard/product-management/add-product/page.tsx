"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { useCreateProduct } from "@/src/hooks/useProducts";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/src/validations/productSchema";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { categoriesData } from "@/src/data/CategoriesData";
import { useBranches } from "@/src/hooks/useBranch";

import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import { Panel } from "@/src/components/dashboard/Panel";
import { LinkButton } from "@/src/components/dashboard/Controls";

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
    },
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
    } catch {
      toast.error("Something went wrong! Please try again.");
    }
  };

  const busy = isPending || isSubmitting;

  return (
    <>
      <PageHeader
        action={
          <LinkButton
            href="/dashboard/product-management/product-list"
            icon={<ArrowLeft aria-hidden size={15} />}
            label="Back to list"
          />
        }
        description="Create a new catalogue entry with pricing, stock, and media."
        eyebrow="Catalog"
        title="Add product"
      />

      <Container className="py-6 sm:py-8" width="content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Panel
            description="Fields marked with * are required."
            title="Product details"
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  {...register("name")}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  label="Product name"
                  placeholder="e.g. Red bull 250ml"
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  {...register("description")}
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  label="Description"
                  placeholder="Short description shown on the product page"
                />
              </div>

              <Input
                {...register("price", { valueAsNumber: true })}
                errorMessage={errors.price?.message}
                isInvalid={!!errors.price}
                label="Price"
                min="0"
                placeholder="0.00"
                step="0.01"
                type="number"
              />

              <Input
                {...register("sku")}
                errorMessage={errors.sku?.message}
                isInvalid={!!errors.sku}
                label="SKU"
                placeholder="Unique stock keeping unit"
              />

              <Select
                {...register("category")}
                errorMessage={errors.category?.message}
                isInvalid={!!errors.category}
                label="Category"
                placeholder="Select category"
              >
                {categoriesData.map((category) => (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                ))}
              </Select>

              <Select
                {...register("inventories.0.branchId")}
                errorMessage={errors.inventories?.[0]?.branchId?.message}
                isInvalid={!!errors.inventories?.[0]?.branchId}
                label="Branch"
                placeholder="Select a branch"
              >
                {branches.map((branch: any) => (
                  <SelectItem key={branch._id}>{branch.name}</SelectItem>
                ))}
              </Select>

              <Input
                {...register("inventories.0.stock", { valueAsNumber: true })}
                errorMessage={errors.inventories?.[0]?.stock?.message}
                isInvalid={!!errors.inventories?.[0]?.stock}
                label="Stock"
                min="0"
                placeholder="0"
                type="number"
              />

              <Input
                {...register("images.0")}
                errorMessage={
                  errors.images?.[0]?.message || errors.images?.message
                }
                isInvalid={!!errors.images}
                label="Image URL"
                placeholder="https://…"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line-hairline pt-5 sm:flex-row sm:justify-end">
              <Button
                color="primary"
                disabled={busy}
                isLoading={busy}
                type="submit"
              >
                {busy ? "Creating product…" : "Create product"}
              </Button>
            </div>
          </Panel>
        </form>
      </Container>
    </>
  );
};

export default AddProductForm;
