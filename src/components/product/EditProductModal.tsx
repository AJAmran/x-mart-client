"use client";

import { useUpdateProduct } from "@/src/hooks/useProducts";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TProduct } from "@/src/types";
import { updateProductSchema } from "@/src/validations/productSchema";
import { Button } from "@nextui-org/button";
import { EditIcon } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect } from "react";

export default function EditProductModal({ product }: { product: TProduct }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const updateProductMutation = useUpdateProduct();

  const { control, handleSubmit, reset } = useForm<Partial<TProduct>>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      ...product,
      inventories: product.inventories || [
        { stock: 0, branchId: "main-branch" },
      ], // Ensure inventories exists
      discount: {
        type: product.discount?.type || "percentage",
        value: product.discount?.value || 0,
        startDate: product.discount?.startDate
          ? new Date(product.discount.startDate)
          : undefined,
        endDate: product.discount?.endDate
          ? new Date(product.discount.endDate)
          : undefined,
      },
    },
  });

  useEffect(() => {
    reset({
      ...product,
      inventories: product.inventories || [
        { stock: 0, branchId: "main-branch" },
      ],
      discount: {
        type: product.discount?.type || "percentage",
        value: product.discount?.value || 0,
        startDate: product.discount?.startDate
          ? new Date(product.discount.startDate)
          : undefined,
        endDate: product.discount?.endDate
          ? new Date(product.discount.endDate)
          : undefined,
      },
    });
  }, [product, reset]);

  const onSubmit = async (data: Partial<TProduct>) => {
    await updateProductMutation.mutateAsync({ id: product._id, data });
    onOpenChange();
  };

  return (
    <>
      <Button isIconOnly onPress={onOpen}>
        <EditIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalBody className="max-h-[60vh] overflow-y-auto">
              {/* Name Field */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Description Field */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    label="Description"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Price Field */}
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Price"
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />

              {/* Stock Field - Now using inventories[0].stock */}
              <Controller
                name="inventories.0.stock"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Stock"
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                  />
                )}
              />

              {/* Discount Type */}
              <Controller
                name="discount.type"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Discount Type"
                    selectedKeys={[field.value || ""]}
                    onChange={field.onChange}
                  >
                    <SelectItem key="percentage" value="percentage">
                      Percentage
                    </SelectItem>
                    <SelectItem key="fixed" value="fixed">
                      Fixed
                    </SelectItem>
                  </Select>
                )}
              />

              {/* Discount Value */}
              <Controller
                name="discount.value"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Discount Value"
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                  />
                )}
              />

              {/* Discount Start Date */}
              <Controller
                name="discount.startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Start Date"
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />

              {/* Discount End Date */}
              <Controller
                name="discount.endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    label="End Date"
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    min={
                      control._formValues.discount?.startDate
                        ? new Date(control._formValues.discount.startDate)
                            .toISOString()
                            .split("T")[0]
                        : undefined
                    }
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" isLoading={updateProductMutation.isPending}>
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
