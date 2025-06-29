"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { Category } from "@/src/data/CategoriestData";
import { AlignJustify, ChevronDown, ChevronRight } from "lucide-react";

interface CategoriesDropdownProps {
  categories: Category[];
  buttonText: string;
}

const CategoriesDropdownClient: React.FC<CategoriesDropdownProps> = ({
  categories,
  buttonText,
}) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/shop?category=${categoryId.toUpperCase()}`);
  };

  const handleSubCategoryClick = (
    categoryId: string,
    subCategoryId: string
  ) => {
    router.push(
      `/shop?category=${categoryId.toUpperCase()}&subcategory=${subCategoryId.toUpperCase()}`
    );
  };

  return (
    <div className="relative group">
      <Button
        className="text-sm font-semibold text-white bg-blue-500 px-4 py-2 rounded-md transition-colors"
        variant="solid"
        startContent={<AlignJustify className="w-4 h-4" />}
        endContent={<ChevronDown className="w-4 h-4 ml-2" />}
      >
        {buttonText}
      </Button>

      <div className="absolute left-0 mt-[2px] w-[280px] shadow-xl rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 z-20 hidden group-hover:block">
        <div className="py-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Button
                className={`w-full text-start px-4 border-b py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                  activeCategory === category.id
                    ? "bg-gray-50 dark:bg-gray-700"
                    : ""
                }`}
                variant="light"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    alt={category.name}
                    className="rounded"
                    height={20}
                    src={category.image}
                    width={20}
                  />
                  <span className="text-sm font-medium uppercase">
                    {category.name}
                  </span>
                </div>
                {category.subCategory && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Button>

              {/* Subcategory panel */}
              {category.subCategory && activeCategory === category.id && (
                <div className="absolute left-full top-0 w-[240px] bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-800 rounded-lg shadow-lg z-20">
                  <div className="py-2">
                    {category.subCategory.map((sub) => (
                      <Button
                        key={sub.id}
                        className="w-full text-start px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b-[0.1px]"
                        variant="light"
                        onClick={() =>
                          handleSubCategoryClick(category.id, sub.id)
                        }
                      >
                        {sub.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdownClient;
