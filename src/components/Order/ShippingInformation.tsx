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
          label="Full Name"
          name="name"
          value={shippingInfo.name}
          isDisabled
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          required
        />

        {/* Email (Disabled) */}
        <Input
          label="Email"
          name="email"
          value={shippingInfo.email}
          isDisabled
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          required
        />

        {/* Address Line 1 */}
        <Input
          label="Address Line 1"
          name="addressLine1"
          value={shippingInfo.addressLine1}
          onChange={handleShippingChange}
          isInvalid={!!errors.addressLine1}
          errorMessage={errors.addressLine1}
          required
        />

        {/* Address Line 2 */}
        <Input
          label="Address Line 2"
          name="addressLine2"
          value={shippingInfo.addressLine2}
          onChange={handleShippingChange}
          isInvalid={!!errors.addressLine2}
          errorMessage={errors.addressLine2}
        />

        {/* City/District */}
        <Input
          label="City/District"
          name="city"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          isInvalid={!!errors.city}
          errorMessage={errors.city}
          required
        />

        {/* Postal Code */}
        <Input
          label="Postal Code"
          name="postalCode"
          value={shippingInfo.postalCode}
          onChange={handleShippingChange}
          isInvalid={!!errors.postalCode}
          errorMessage={errors.postalCode}
          required
        />

        {/* Division */}
        <Input
          label="Division"
          name="division"
          value={shippingInfo.division}
          onChange={handleShippingChange}
          isInvalid={!!errors.division}
          errorMessage={errors.division}
          required
        />

        {/* Phone Number (Disabled) */}
        <Input
          label="Phone Number"
          name="phone"
          value={shippingInfo.phone}
          isDisabled
          isInvalid={!!errors.phone}
          errorMessage={errors.phone}
          required
        />
      </CardBody>
    </Card>
  );
};

export default ShippingInformation;
