"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@nextui-org/button";
import { Chip } from "@heroui/chip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  id: number;
  image: string;
  badge?: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  align: "left" | "center" | "right";
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
    badge: "Up to 50% Off",
    title: "Fresh Groceries,\nDelivered to Your Door",
    subtitle: "Shop farm-fresh produce, dairy & meats at unbeatable prices. Free delivery on your first order.",
    cta: "Shop Groceries",
    href: "/shop?category=vegetables",
    align: "left",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
    badge: "Flash Sale",
    title: "Premium Kitchen\nEssentials",
    subtitle: "Cook like a pro with top-rated cookware and gadgets. Limited-time deals start at ৳299.",
    cta: "Explore Deals",
    href: "/deals",
    align: "center",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    badge: "New Arrivals",
    title: "Trending Fashion &\nLifestyle",
    subtitle: "Refresh your wardrobe with the latest styles. Enjoy 20% off on all new arrivals this week.",
    cta: "Browse Now",
    href: "/shop?category=apparel",
    align: "right",
  },
];

const alignClasses: Record<string, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const textAlignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const totalSlides = heroSlides.length;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    autoplayRef.current = emblaApi.plugins()?.autoplay as ReturnType<typeof Autoplay>;
  }, [emblaApi]);

  useEffect(() => {
    if (progressRef.current) {
      if (isHovered) {
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = `${((selectedIndex + 1) / totalSlides) * 100}%`;
      } else {
        progressRef.current.style.transition = "width 6s linear";
        progressRef.current.style.width = "100%";
      }
    }
  }, [isHovered, selectedIndex, totalSlides]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      requestAnimationFrame(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = "width 6s linear";
          progressRef.current.style.width = "100%";
        }
      });
    }
  }, [selectedIndex]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl group"
      onMouseEnter={() => { setIsHovered(true); autoplayRef.current?.stop(); }}
      onMouseLeave={() => { setIsHovered(false); autoplayRef.current?.play(); }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[580px] w-full overflow-hidden">
                <Image
                  fill
                  alt={slide.title}
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out"
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  priority={slide.id === 1}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 1200px"
                  src={slide.image}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 ${alignClasses[slide.align]}`}>
                  <div className={`max-w-xl ${slide.align === "right" ? "ml-auto" : ""} space-y-3 sm:space-y-4`}>
                    {slide.badge && (
                      <Chip
                        className="animate-fade-in-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]"
                        color="primary"
                        size="sm"
                        variant="shadow"
                      >
                        {slide.badge}
                      </Chip>
                    )}

                    <h2
                      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards] ${textAlignClasses[slide.align]}`}
                    >
                      {slide.title.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <br />}
                          <span className={i === 0 ? "text-white" : "text-primary-300"}>{line}</span>
                        </React.Fragment>
                      ))}
                    </h2>

                    <p
                      className={`text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-lg drop-shadow-lg animate-fade-in-up [animation-delay:350ms] opacity-0 [animation-fill-mode:forwards] ${slide.align === "right" ? "ml-auto" : ""} ${textAlignClasses[slide.align]}`}
                    >
                      {slide.subtitle}
                    </p>

                    <div className={`animate-fade-in-up [animation-delay:500ms] opacity-0 [animation-fill-mode:forwards] ${textAlignClasses[slide.align]}`}>
                      <Button
                        as={Link}
                        className="font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-full"
                        href={slide.href}
                        radius="full"
                        size="lg"
                      >
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-r"
          style={{ width: `${((selectedIndex + 1) / totalSlides) * 100}%`, transition: "width 6s linear" }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
        {selectedIndex + 1} / {totalSlides}
      </div>

      {/* Navigation Arrows */}
      <button
        aria-label="Previous slide"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-gray-900 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-gray-900 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={scrollNext}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-primary shadow-lg shadow-primary/50"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
