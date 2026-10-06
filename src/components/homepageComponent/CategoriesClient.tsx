"use client";

import { useCallback } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useMotion } from "@/src/lib/motion";
import type { Category } from "@/src/data/CategoriesData";

interface CategoriesClientProps {
  categories: Category[];
}
function CategoriesClient({ categories }: CategoriesClientProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: true,
  });
  const m = useMotion();

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="group/carousel relative">
      <div ref={emblaRef} className="overflow-hidden">
        <motion.ul
          animate="visible"
          className="flex -ml-3"
          initial={m.initial}
          variants={m.container}
        >
          {categories.map((category) => (
            <motion.li
              key={category.id}
              className="min-w-0 flex-[0_0_50%] pl-3 sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] xl:flex-[0_0_16.666%]"
              variants={m.item}
            >
              <NextLink
                className="group flex h-full flex-col items-center gap-3 rounded-lg border border-line-hairline bg-surface-raised p-5 text-center shadow-xs transition-all duration-base ease-standard hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                href={`/shop?category=${encodeURIComponent(category.id)}`}
              >
                <span className="grid size-20 place-items-center rounded-full bg-surface-sunken transition-colors duration-base ease-standard group-hover:bg-brand-subtle">
                  <Image
                    alt=""
                    className="size-12 object-contain transition-transform duration-base ease-standard group-hover:scale-110"
                    height={48}
                    loading="lazy"
                    src={category.image}
                    width={48}
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-body-sm font-semibold text-content">
                    {category.name}
                  </span>
                  <span className="mt-0.5 block text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle transition-colors duration-fast group-hover:text-brand">
                    Browse
                  </span>
                </span>
              </NextLink>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Arrows are decorative affordances; the rail is also swipeable and the
          links are all in the tab order. */}
      <button
        aria-label="Scroll categories backwards"
        className="absolute left-0 top-1/2 z-raised hidden size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-hairline bg-surface-raised text-content shadow-md transition-[opacity,background-color] duration-fast ease-standard hover:bg-surface-sunken group-hover/carousel:opacity-100 sm:grid"
        style={{ opacity: 0 }}
        tabIndex={-1}
        type="button"
        onClick={scrollPrev}
      >
        <ChevronLeft aria-hidden size={20} />
      </button>
      <button
        aria-label="Scroll categories forwards"
        className="absolute right-0 top-1/2 z-raised hidden size-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-hairline bg-surface-raised text-content shadow-md transition-[opacity,background-color] duration-fast ease-standard hover:bg-surface-sunken group-hover/carousel:opacity-100 sm:grid"
        style={{ opacity: 0 }}
        tabIndex={-1}
        type="button"
        onClick={scrollNext}
      >
        <ChevronRight aria-hidden size={20} />
      </button>
    </div>
  );
}

export default CategoriesClient;