"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto shadow-lg border-none">
        <CardBody className="p-12 flex flex-col items-center text-center gap-4">
          <Settings className="w-16 h-16 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">This page is under development</p>
        </CardBody>
      </Card>
    </div>
  );
}
