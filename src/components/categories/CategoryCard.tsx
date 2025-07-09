"use client";

import { PRODUCT_CATEGORY } from "@/src/constants";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

type CategoryCardProps = {
  category: keyof typeof PRODUCT_CATEGORY;
};

const categoryImages = {
  FISH: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/50kHBqJjtsaarqqhjNlW7ioR1v2SGfjUyscsLBPG___tmd.webp",
  MEAT: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/PDk0Xxi7hP8fbLkFY8xr75iCbYcjvlEyiAqruCks___tmd.webp",
  FRUITS: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/Eb7O4zdvvaXarXg1y8VmMCJbshRjZvxCFBWpQsvS___tmd.webp",
  VEGETABLES: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/AothKQzvd4M5PNh0d0gNeIQHbgqXkzkFhEVhefyh___tmd.webp",
  DAIRY: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/zEfr5gjApqnDQq650zsQ32zUF3O6g9MIyPu7l1PX___tmd.webp",
  FROZEN: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/12/31/m3I5wBTxrYjiDD44DWH8hQClSzkxVnXLNSYwdhKZ___tmd.webp",
  GROCERY: "https://s3-ap-southeast-1.amazonaws.com/com.meenabazaronline.v1.01/homeBanner/2024/5/12/JCjHZuLbZM6oaM9T4V5Jjr3x11U6fNAiY5aAPmfK___tmd.webp",
  PERSONALCARE: "https://www.kindpng.com/picc/m/160-1606870_personal-care-products-png-transparent-png.png",
  HOUSEHOLD: "",
  STATIONERY: "",
};

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
};

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
          src={categoryImages[category] || "/placeholder.jpg"}
          alt={categoryNames[category]}
          width={340}
          height={420}
          className="w-full h-full object-cover"
          radius="none"
        />
      </CardBody>
    </Card>
  );
};

export default CategoryCard;
