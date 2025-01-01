"use client";

import React from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { categoriesData } from "@/src/data/CategoriestData";

const Categories: React.FC = () => {
  return (
    <section className="py-8 px-4 lg:px-12">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {categoriesData.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-xl transition-transform transform hover:scale-105"
            radius="lg"
            isHoverable
            isPressable
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
