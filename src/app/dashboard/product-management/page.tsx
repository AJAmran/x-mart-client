"use client";

import { Card, CardBody } from "@nextui-org/card";
import { ShoppingBag } from "lucide-react";

export default function ProductManagementPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full mx-4">
        <CardBody className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            This feature is coming soon. Stay tuned for updates!
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
