"use client";

import React, { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@nextui-org/button";
import Image from "next/image";

// Define interface for type safety
interface HeroSlide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

// Server Component for static slide data
const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1679611364723-05cbfe2eeaea?q=80&w=1178&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?q=80&w=1183&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // Update selected index when carousel changes
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
    <div className="embla relative w-full overflow-hidden rounded-xl shadow-2xl">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {heroSlides.map((slide) => (
            <div className="embla__slide flex-[0_0_100%] min-w-0" key={slide.id}>
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title || "Carousel slide"}
                  fill
                  className="object-cover brightness-90"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 75vw, 1200px"
                  priority={slide.id === 1}
                  loading={slide.id === 1 ? "eager" : "lazy"}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center py-6 sm:py-8">
                  <div className="text-center text-white px-4 sm:px-6 animate-slide-up mb-6">
                    {slide.title && (
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 opacity-90 leading-relaxed drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta && (
                      <Button
                        color="primary"
                        size="lg"
                        radius="full"
                        className="font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              selectedIndex === index ? "bg-primary w-4 sm:w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg transition-all duration-300 hidden sm:block hover:scale-110"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg transition-all duration-300 hidden sm:block hover:scale-110"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;