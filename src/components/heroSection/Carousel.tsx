"use client";

import React, { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@nextui-org/button";
import Image from "next/image";

interface HeroSlide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1679611364723-05cbfe2eeaea?q=80&w=1178&auto=format&fit=crop",
    title: "Fresh Picks, Big Savings",
    subtitle: "Discover up to 50% off on premium groceries",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: "https://www.bracbank.com/ramadan_2021/images/supershop_banner.jpg",
    title: "Tech That Inspires",
    subtitle: "Explore new gadgets with 30% off",
    cta: "Discover Tech",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?q=80&w=1183&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Summer Style Unveiled",
    subtitle: "Trendy collections starting at $19.99",
    cta: "Browse Now",
  },
];

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="embla relative w-full overflow-hidden rounded-xl shadow-xl sm:shadow-2xl">
      <div ref={emblaRef} className="embla__viewport">
        <div className="embla__container flex">
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="embla__slide flex-[0_0_100%] min-w-0"
            >
              <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full">
                <Image
                  fill
                  alt={slide.title || "Carousel slide"}
                  className="object-cover brightness-90"
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  priority={slide.id === 1}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 75vw, 1200px"
                  src={slide.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center py-4 sm:py-6 md:py-8">
                  <div className="text-center text-white px-4 sm:px-6 animate-slide-up mb-4 sm:mb-6">
                    {slide.title && (
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2 md:mb-3 tracking-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-5 opacity-90 leading-relaxed drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta && (
                      <Button
                        className="font-semibold px-5 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        color="primary"
                        radius="full"
                        size="md"
                      >
                        {slide.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "bg-primary w-4 sm:w-6" : "bg-white/50"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-md sm:shadow-lg transition-all duration-300 hidden sm:block hover:scale-110"
        onClick={scrollPrev}
      >
        <svg
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-md sm:shadow-lg transition-all duration-300 hidden sm:block hover:scale-110"
        onClick={scrollNext}
      >
        <svg
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
