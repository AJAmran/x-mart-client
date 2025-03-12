"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { categoriesData, Category } from "@/src/data/CategoriestData";

interface CategoriesDropdownProps {
  categories: Category[];
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  hoverColor: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  categories,
  buttonText,
}) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to the shop page with the selected category as a query parameter (in uppercase)
    router.push(`/shop?category=${categoryId.toUpperCase()}`);
  };

  return (
    <div className="relative group">
      {/* Main Categories Button */}
      <Button
        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        variant="light"
      >
        {buttonText}
      </Button>

      {/* Dropdown Menu */}
      <div className="absolute left-0 mt-[1px] w-56 shadow-lg rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-10 hidden group-hover:block group-focus:block transition-opacity duration-300">
        <div className="py-2">
          {/* Loop through categories */}
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              {/* Category Name with Image */}
              <Button
                className="w-full text-start px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 focus:dark:bg-gray-700 flex items-center space-x-3 transition-colors"
                variant="light"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex items-start justify-start gap-3 w-full">
                <Image
                  alt={category.name}
                  className="rounded"
                  height={24}
                  src={category.image}
                  width={24}
                />
                <span className="text-sm font-medium text-start">{category.name}</span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Exported container component for ease of use
const CategoriesDropdownContainer = () => {
  return (
    <CategoriesDropdown
      buttonColor="bg-blue-600"
      buttonText="Categories"
      buttonTextColor="text-white"
      categories={categoriesData}
      hoverColor="bg-blue-700"
    />
  );
};

export default CategoriesDropdownContainer;
