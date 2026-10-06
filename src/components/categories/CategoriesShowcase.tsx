"use client";

import { Container } from "@/src/components/UI/Container";
import { useFeaturedCategories } from "@/src/hooks/useProducts";
import CategoryProductsSlider from "./CategoryProductsSlider";

const CategoriesShowcase = () => {
  const categories = useFeaturedCategories();

  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container>
        {categories.map((category) => (
          <CategoryProductsSlider key={category} category={category} />
        ))}
      </Container>
    </section>
  );
};

export default CategoriesShowcase;