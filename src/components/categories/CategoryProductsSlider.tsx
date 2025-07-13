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
};

const CategoryProductsSlider = ({ category }: CategoryProductsSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      dragFree: false,
      loop: false,
      breakpoints: {
        "(max-width: 1024px)": { slidesToScroll: 1 },
        "(max-width: 640px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const { data: products, isLoading } = useProductsByCategory(category);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  if (isLoading || !products?.length) {
    return (
      <div className="flex gap-4 sm:gap-6 overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] rounded-xl flex-shrink-0" />
        <div className="flex gap-4 sm:gap-6">
          <Skeleton className="h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] rounded-xl flex-shrink-0" />
          <Skeleton className="h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] rounded-xl flex-shrink-0 hidden sm:block" />
          <Skeleton className="h-[420px] w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] rounded-xl flex-shrink-0 hidden lg:block" />
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-6 px-4 sm:px-6 lg:px-8">
      {/* Mobile category title - only shown on mobile */}
      <h2 className="text-xl font-bold mb-4 md:hidden">
        {categoryNames[category]}
      </h2>

      <div className="relative">
        <div className="flex gap-4 sm:gap-6">
          {/* Category card - hidden on mobile */}
          <div
            className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] hidden md:block"
            role="region"
            aria-label={`${category} category`}
          >
            <CategoryCard category={category} />
          </div>
          <div className="flex-1 overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-6">
              {products.map((product: TProduct) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[320px] xl:w-[340px] min-w-0 basis-[280px] sm:basis-[300px] lg:basis-[320px] xl:basis-[340px]"
                  role="region"
                  aria-label={`Product ${product.name}`}
                >
                  <ProductCard product={product} variant="default" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons - always visible if there are multiple products */}
        {products.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 sm:px-6 lg:px-8">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className="absolute -left-4 sm:-left-6 lg:-left-8 p-2 sm:p-3 rounded-full bg-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-10"
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className="absolute -right-4 sm:-right-6 lg:-right-8 p-2 sm:p-3 rounded-full bg-white shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-10"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryProductsSlider;
