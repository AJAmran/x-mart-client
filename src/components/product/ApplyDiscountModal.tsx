"use client";

import { useApplyDiscount } from "@/src/hooks/useProducts";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TProduct } from "@/src/types";
import { discountSchema } from "@/src/validations/productSchema";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { DiscountIcon } from "../icons";
import { useEffect } from "react";

export default function ApplyDiscountModal({
  product,
  onRemoveDiscount,
}: {
  product: TProduct;
  onRemoveDiscount: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const applyDiscountMutation = useApplyDiscount();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      type: product.discount?.type || "percentage",
      value: product.discount?.value || 0,
      startDate: product.discount?.startDate
        ? new Date(product.discount.startDate).toISOString().split("T")[0]
        : "",
      endDate: product.discount?.endDate
        ? new Date(product.discount.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  // Reset form when the product changes
  useEffect(() => {
    reset({
      type: product.discount?.type || "percentage",
      value: product.discount?.value || 0,
      startDate: product.discount?.startDate
        ? new Date(product.discount.startDate).toISOString().split("T")[0]
        : "",
      endDate: product.discount?.endDate
        ? new Date(product.discount.endDate).toISOString().split("T")[0]
        : "",
    });
  }, [product, reset]);

  const onSubmit = async (data: any) => {
    await applyDiscountMutation.mutateAsync({
      id: product._id,
      discount: data,
    });
    onOpenChange();
  };

  return (
    <>
      <Button isIconOnly onPress={onOpen}>
        <DiscountIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {product.discount ? "Update Discount" : "Apply Discount"}
            </ModalHeader>
            <ModalBody>
              {/* Discount Type */}
              <Controller
                name="type"
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
                name="value"
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

              {/* Start Date */}
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Start Date"
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* End Date */}
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    label="End Date"
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit">
                {product.discount ? "Update" : "Apply"}
              </Button>
              {product.discount && (
                <Button color="danger" onPress={onRemoveDiscount}>
                  Remove Discount
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
