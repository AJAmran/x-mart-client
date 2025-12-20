"use client";
import { TShippingInfo } from "@/src/types";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { ChangeEvent } from "react";



// Define the type for errors
interface Errors {
  name?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  division?: string;
  phone?: string;
}

// Define the props for the ShippingInformation component
interface ShippingInformationProps {
  shippingInfo: TShippingInfo;
  errors: Errors;
  handleShippingChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ShippingInformation: React.FC<ShippingInformationProps> = ({
  shippingInfo,
  errors,
  handleShippingChange,
}) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Shipping Information</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Full Name (Disabled) */}
        <Input
          isDisabled
          required
          errorMessage={errors.name}
          isInvalid={!!errors.name}
          label="Full Name"
          name="name"
          value={shippingInfo.name}
        />

        {/* Email (Disabled) */}
        <Input
          isDisabled
          required
          errorMessage={errors.email}
          isInvalid={!!errors.email}
          label="Email"
          name="email"
          value={shippingInfo.email}
        />

        {/* Address Line 1 */}
        <Input
          required
          errorMessage={errors.addressLine1}
          isInvalid={!!errors.addressLine1}
          label="Address Line 1"
          name="addressLine1"
          value={shippingInfo.addressLine1}
          onChange={handleShippingChange}
        />

        {/* Address Line 2 */}
        <Input
          errorMessage={errors.addressLine2}
          isInvalid={!!errors.addressLine2}
          label="Address Line 2"
          name="addressLine2"
          value={shippingInfo.addressLine2}
          onChange={handleShippingChange}
        />

        {/* City/District */}
        <Input
          required
          errorMessage={errors.city}
          isInvalid={!!errors.city}
          label="City/District"
          name="city"
          value={shippingInfo.city}
          onChange={handleShippingChange}
        />

        {/* Postal Code */}
        <Input
          required
          errorMessage={errors.postalCode}
          isInvalid={!!errors.postalCode}
          label="Postal Code"
          name="postalCode"
          value={shippingInfo.postalCode}
          onChange={handleShippingChange}
        />

        {/* Division */}
        <Input
          required
          errorMessage={errors.division}
          isInvalid={!!errors.division}
          label="Division"
          name="division"
          value={shippingInfo.division}
          onChange={handleShippingChange}
        />

        {/* Phone Number (Disabled) */}
        <Input
          isDisabled
          required
          errorMessage={errors.phone}
          isInvalid={!!errors.phone}
          label="Phone Number"
          name="phone"
          value={shippingInfo.phone}
        />
      </CardBody>
    </Card>
  );
};

export default ShippingInformation;
