"use client";

import React from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { categoriesData } from "@/src/data/CategoriestData";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";

const Categories: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    // Navigate to the shop page with the selected category as a query parameter
    router.push(`/shop?category=${category}`);
  };

  return (
    <section className="py-8">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold tracking-tight">
          Shop by Categories
        </h1>
        <p className="mt-2 text-sm lg:text-base">
          Discover a wide range of products tailored to your needs.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categoriesData.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-xl transition-transform transform hover:scale-105"
            radius="lg"
            isHoverable
            isPressable
            onPress={() => handleCategoryClick(category.name.toUpperCase())}
          >
            {/* Card Header with Image */}
            <CardHeader className="flex justify-center items-center p-6">
              <Image
                src={category.image}
                alt={`${category.name} icon`}
                width={70}
                height={70}
                className="object-contain"
              />
            </CardHeader>

            {/* Card Body */}
            <CardBody className="text-center p-4">
              <h3 className="text-lg font-bold">{category.name}</h3>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Categories;
