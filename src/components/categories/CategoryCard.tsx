"use client";

import { PRODUCT_CATEGORY } from "@/src/constants";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

type CategoryCardProps = {
  category: keyof typeof PRODUCT_CATEGORY;
};

const categoryImages = {
  FISH: "/fishcategories.webp",
  MEAT: "/chicken.webp",
  FRUITS: "/fruts.webp",
  VEGETABLES: "/vegitable.webp",
  DAIRY: "/dairy.avif",
  FROZEN: "/frozen.webp",
  GROCERY: "/groshary.webp",
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
      as={Link}
      href={`/shop?category=${category}`}
      className="w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] h-[420px] rounded-xl"
      isPressable
      role="link"
      aria-label={`Explore ${categoryNames[category]} category`}
    >
      <CardBody className="p-0 relative">
        <Image
          src={categoryImages[category]}
          alt={categoryNames[category]}
          width={340}
          height={420}
          className="w-full h-full object-cover"
          radius="none"
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