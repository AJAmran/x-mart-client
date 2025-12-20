"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody } from "@nextui-org/card";
import { Category } from "@/src/data/CategoriesData";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@nextui-org/button";

interface CategoriesClientProps {
  categories: Category[];
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({ categories }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Define a set of soft gradient backgrounds to rotate through
  const gradients = [
    "bg-blue-50 hover:bg-blue-100",
    "bg-green-50 hover:bg-green-100",
    "bg-purple-50 hover:bg-purple-100",
    "bg-orange-50 hover:bg-orange-100",
    "bg-pink-50 hover:bg-pink-100",
    "bg-teal-50 hover:bg-teal-100",
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative group/carousel">
      <div ref={emblaRef} className="overflow-hidden">
        <motion.div
          className="flex -ml-4"
          initial="hidden"
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
          whileInView="show"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%] min-w-0 pl-4 py-4"
              variants={itemVariants}
            >
              <Link className="block h-full group" href={`/shop?category=${category.id}`}>
                <Card
                  isPressable
                  className={`h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900 overflow-visible`}
                >
                  <CardBody className="p-4 flex flex-col items-center justify-center gap-4 text-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${gradients[index % gradients.length]
                        }`}
                    >
                      <Image
                        alt={`${category.name} icon`}
                        className="object-contain drop-shadow-sm"
                        height={48}
                        src={category.image}
                        width={48}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-tiny text-gray-400 font-medium uppercase tracking-wide">
                        Browse
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <Button
        isIconOnly
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-md shadow-md hover:bg-white text-gray-700 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        radius="full"
        variant="flat"
        onClick={scrollPrev}
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        isIconOnly
        aria-label="Next slide"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/80 backdrop-blur-md shadow-md hover:bg-white text-gray-700 hidden sm:flex opacity-0 group-hover/carousel:opacity-100 transition-opacity"
        radius="full"
        variant="flat"
        onClick={scrollNext}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};

export default CategoriesClient;
