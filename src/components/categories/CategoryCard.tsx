"use client";

import { PRODUCT_CATEGORY } from "@/src/constants";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";
import NextImage from "next/image";

type CategoryCardProps = {
  category: keyof typeof PRODUCT_CATEGORY;
};

const categoryImages = {
  FISH: "/fish.webp",
  MEAT: "/chicken.webp",
  FRUITS: "/fruits.webp",
  VEGETABLES: "/vegetables.webp",
  DAIRY: "/dairy.avif",
  FROZEN: "/frozen.webp",
  GROCERY: "/grocery.webp",
  PERSONALCARE: "/PERSONALCARE.webp",
  HOUSEHOLD: "/household.webp",
  STATIONERY: "/stationery.webp",
} as const;

const categoryNames = {
  FISH: "Fresh Fish",
  MEAT: "Meat & Poultry",
  FRUITS: "Fresh Fruits",
  VEGETABLES: "Fresh Vegetables",
  DAIRY: "Dairy Products",
  FROZEN: "Frozen Foods",
  GROCERY: "Grocery Items",
  PERSONALCARE: "Personal Care",
  HOUSEHOLD: "Household Essentials",
  STATIONERY: "Stationery",
} as const;

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card
      isPressable
      aria-label={`Explore ${categoryNames[category]} category`}
      as={Link}
      className="w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px] rounded-xl"
      href={`/shop?category=${category}`}
      role="link"
    >
      <CardBody className="p-0 relative h-full">
        <Image
          alt={categoryNames[category]}
          as={NextImage}
          className="w-full h-full object-cover"
          height={420}
          radius="none"
          src={categoryImages[category]}
          width={340}
        />
        <div className="absolute top-4 left-4 z-10">
          <h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-white"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            {categoryNames[category]}
          </h2>
        </div>
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
