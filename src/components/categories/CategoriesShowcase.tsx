"use client";

import { useFeaturedCategories } from "@/src/hooks/useProducts";
import CategoryProductsSlider from "./CategoryProductsSlider";

const CategoriesShowcase = () => {
  const categories = useFeaturedCategories();

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {categories.map((category) => (
          <CategoryProductsSlider key={category} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesShowcase;