"use client";

import { PRODUCT_CATEGORY } from "@/src/constants";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { useProductsByCategory } from "@/src/hooks/useProducts";
import { Skeleton } from "@heroui/skeleton";
import { TProduct } from "@/src/types";
import CategoryCard from "./CategoryCard";
import ProductCard from "../UI/ProductCard";

type CategoryProductsSliderProps = {
  category: keyof typeof PRODUCT_CATEGORY;
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
} as const;

const CategoryProductsSlider = ({ category }: CategoryProductsSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      dragFree: false,
      loop: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const { data: productsRes, isLoading } = useProductsByCategory(category);
  const products = productsRes?.data ?? [];
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (isLoading) {
    return (
      <section className="relative py-6">
        <h2 className="text-xl font-bold mb-4 md:hidden">
          <Skeleton className="h-6 w-40" />
        </h2>

        <div className="relative">
          <div className="flex gap-4 sm:gap-6">
            <Skeleton className="hidden h-full w-rail shrink-0 rounded-lg md:block" />
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-4 sm:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-full w-rail shrink-0 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="relative py-6">
      {/* Mobile category title - only shown on mobile */}
      <h2 className="text-xl font-bold mb-4 md:hidden">
        {categoryNames[category]}
      </h2>

      <div className="relative">
        <div className="flex gap-4 sm:gap-6">
          {/* Category card - hidden on mobile */}
          <div
            aria-label={`${category} category`}
            className="hidden w-rail shrink-0 md:block"
            role="region"
          >
            <CategoryCard category={category} />
          </div>
          <div ref={emblaRef} className="flex-1 overflow-hidden">
            <div className="flex gap-4 sm:gap-6">
              {products.map((product: TProduct) => (
                <div
                  key={product._id}
                  aria-label={`Product ${product.name}`}
                  className="w-rail shrink-0"
                  role="region"
                >
                  <ProductCard product={product} variant="default" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons - always visible if there are multiple products */}
        {products.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
            <PrevButton
              className="pointer-events-auto absolute left-0 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-hairline bg-surface-raised text-content shadow-md transition-colors duration-fast hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-30"
              disabled={prevBtnDisabled}
              onClick={onPrevButtonClick}
            />
            <NextButton
              className="pointer-events-auto absolute right-0 top-1/2 grid size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-hairline bg-surface-raised text-content shadow-md transition-colors duration-fast hover:bg-surface-sunken disabled:pointer-events-none disabled:opacity-30"
              disabled={nextBtnDisabled}
              onClick={onNextButtonClick}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProductsSlider;
