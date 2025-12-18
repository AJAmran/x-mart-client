"use client";

import React from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { useRouter } from "next/navigation";
import { Category } from "@/src/data/CategoriesData";

interface CategoriesClientProps {
  categories: Category[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/shop?category=${category}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="hover:shadow-xl transition-transform transform hover:scale-105"
          radius="lg"
          isHoverable
          isPressable
          onPress={() => handleCategoryClick(category.id)}
          aria-label={`Shop ${category.name} category`}
        >
          <CardHeader className="flex justify-center items-center p-6">
            <Image
              src={category.image}
              alt={`${category.name} icon`}
              width={70}
              height={70}
              className="object-contain"
            />
          </CardHeader>
          <CardBody className="text-center p-4">
            <h3 className="text-lg font-bold">{category.name}</h3>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CategoriesClient;
