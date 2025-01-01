"use client";

import React, { useState } from "react";
import Image from "next/image"; // Import Next.js Image component
import clsx from "clsx";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";

import {
  categoriesData,
  Category,
  Subcategory,
} from "@/src/data/CategoriestData";

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
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="relative group">
      {/* Main Categories Button */}
      <Button className="">{buttonText}</Button>

      {/* Dropdown Menu */}
      <div className="absolute left-0 mt-[2px] w-56 shadow-lg rounded-lg border bg-gray-300 dark:bg-gray-700 border-gray-200 z-10 hidden group-hover:block group-focus:block">
        <div className="py-1">
          {/* Loop through categories */}
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              {/* Category Name with Image */}
              <Button
                className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 focus:dark:bg-gray-600 flex items-center justify-between"
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={openCategory === category.id ? "true" : "false"}
                aria-controls={`subcategory-${category.id}`}
              >
                <div className="flex items-center space-x-2">
                  <Image
                    alt={category.name}
                    className="rounded"
                    height={20}
                    src={category.image}
                    width={20}
                  />
                  <span>{category.name}</span>
                </div>
                {/* Expand/Collapse Icon */}
                <span
                  className={`ml-2 transform transition-transform ${
                    openCategory === category.id ? "rotate-90" : ""
                  }`}
                >
                  &gt;
                </span>
              </Button>

              {/* Subcategories Dropdown */}
              <div
                aria-labelledby={`category-${category.id}`}
                className={`absolute left-full top-0 mt-2 w-56 bg-gray-300 shadow-lg rounded-lg border border-gray-200 transition-all duration-300 dark:bg-gray-800 dark:border-gray-600 ${
                  openCategory === category.id ? "block" : "hidden"
                }`}
                id={`subcategory-${category.id}`}
                role="region"
              >
                <div className="py-1">
                  {category.subcategories.map(
                    (subcategory: Subcategory, index) => (
                      <Link
                        key={subcategory.id}
                        className={clsx(
                          "w-full flex flex-col text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 focus:dark:bg-gray-600",
                          {
                            "border-b":
                              index !== category.subcategories.length - 1, // Apply border-b except for the last child
                          }
                        )}
                      >
                        {subcategory.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
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
