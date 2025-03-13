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
      discount: {
        type: product.discount?.type || "percentage",
        value: product.discount?.value || 0,
        startDate: product.discount?.startDate
          ? new Date(product.discount.startDate)
          : undefined, // Ensure it's a Date
        endDate: product.discount?.endDate
          ? new Date(product.discount.endDate)
          : undefined, // Ensure it's a Date
      },
    },
  });

  // Reset form when the product changes
  useEffect(() => {
    reset({
      ...product,
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside" // Make the modal content scrollable
        size="lg" // Set a larger size for the modal
        className="max-h-[90vh]" // Limit the modal height to 90% of the viewport height
      >
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

              {/* Stock Field */}
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Stock"
                    type="number"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                    selectedKeys={[field.value]}
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
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Save</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
