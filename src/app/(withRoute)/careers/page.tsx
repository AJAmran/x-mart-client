"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full shadow-lg border-none">
        <CardBody className="p-12 flex flex-col items-center text-center gap-4">
          <Briefcase className="w-16 h-16 text-primary" />
          <h1 className="text-3xl font-bold">Careers</h1>
          <p className="text-gray-500 dark:text-gray-400">This page is under development</p>
        </CardBody>
      </Card>
    </div>
  );
}
