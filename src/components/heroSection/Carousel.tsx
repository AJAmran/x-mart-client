"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@nextui-org/button";
import { Chip } from "@heroui/chip";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    subtitle: "Shop farm-fresh organic produce, premium dairy & tender meats at unbeatable prices. Free delivery on your first order.",
    cta: "Shop Groceries Now",
    href: "/shop?category=vegetables",
    align: "left",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
    badge: "Flash Deals",
    title: "Premium Kitchen\n& Home Essentials",
    subtitle: "Upgrade your culinary space with professional cookware, modern gadgets, and daily organizers. Limited discounts start from ৳299.",
    cta: "Explore Flash Deals",
    href: "/deals",
    align: "center",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    badge: "New Season Drops",
    title: "Trending Fashion &\nSummer Lifestyle",
    subtitle: "Curate your wardrobe with top styles of the season. Enjoy an exclusive 20% discount on all new additions this week.",
    cta: "Browse Apparel",
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

const textWrapperAlignClasses: Record<string, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 6500, stopOnInteraction: false })]
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

  // Handle slide automatic progress bar
  useEffect(() => {
    if (progressRef.current) {
      if (isHovered) {
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = `${((selectedIndex + 1) / totalSlides) * 100}%`;
      } else {
        progressRef.current.style.transition = "width 6.5s linear";
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
          progressRef.current.style.transition = "width 6.5s linear";
          progressRef.current.style.width = "100%";
        }
      });
    }
  }, [selectedIndex]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl group border border-gray-200/10"
      onMouseEnter={() => { setIsHovered(true); autoplayRef.current?.stop(); }}
      onMouseLeave={() => { setIsHovered(false); autoplayRef.current?.play(); }}
      style={{
        contentVisibility: "auto",
      }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {heroSlides.map((slide, slideIndex) => {
            const isActive = selectedIndex === slideIndex;

            return (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
                <div className="relative h-[320px] sm:h-[420px] md:h-[500px] lg:h-[580px] w-full overflow-hidden">
                  
                  {/* Hero background image with dynamic scale hover */}
                  <Image
                    fill
                    alt={slide.title}
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[12s] ease-out"
                    loading={slide.id === 1 ? "eager" : "lazy"}
                    priority={slide.id === 1}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1400px"
                    src={slide.image}
                  />

                  {/* Dark Vignette Mask for superb premium readability & contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent dark:from-black/90 dark:via-black/55 dark:to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none" />

                  {/* Glassmorphic Ambient Mesh Overlay behind text */}
                  <div className="absolute inset-0 bg-primary-500/5 mix-blend-overlay pointer-events-none" />

                  {/* Slider Content Wrapper */}
                  <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 z-10 ${alignClasses[slide.align]}`}>
                    <div className={`max-w-xl ${textWrapperAlignClasses[slide.align]} space-y-4 md:space-y-5`}>
                      
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            key={`slide-content-${selectedIndex}`}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: {
                                  staggerChildren: 0.15
                                }
                              }
                            }}
                            className={`flex flex-col ${alignClasses[slide.align]}`}
                          >
                            {/* Slide Badge */}
                            {slide.badge && (
                              <motion.div
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
                                }}
                              >
                                <Chip
                                  className="font-extrabold text-[10px] sm:text-xs tracking-wider border border-white/20 shadow-md text-white bg-primary-500/35 backdrop-blur-md px-3 py-1 rounded-full uppercase"
                                  size="sm"
                                  variant="shadow"
                                >
                                  {slide.badge}
                                </Chip>
                              </motion.div>
                            )}

                            {/* Dynamic Title with animated spring text */}
                            <motion.h2
                              variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                              }}
                              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-xl mt-3 ${textAlignClasses[slide.align]}`}
                            >
                              {slide.title.split("\n").map((line, i) => (
                                <React.Fragment key={i}>
                                  {i > 0 && <br />}
                                  <span className={i === 0 ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-200 to-white"}>
                                    {line}
                                  </span>
                                </React.Fragment>
                              ))}
                            </motion.h2>

                            {/* Slide Subtitle */}
                            <motion.p
                              variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                              }}
                              className={`text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed font-medium drop-shadow-md mt-4 max-w-lg ${textAlignClasses[slide.align]}`}
                            >
                              {slide.subtitle}
                            </motion.p>

                            {/* Slide CTA Button with spring glow on hover */}
                            <motion.div
                              variants={{
                                hidden: { opacity: 0, y: 15 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
                              }}
                              className="mt-6 sm:mt-8"
                            >
                              <Button
                                as={Link}
                                className="font-extrabold px-6 sm:px-8 py-3 bg-gradient-to-r from-primary-500 via-indigo-600 to-primary-600 hover:from-primary-600 hover:via-indigo-700 hover:to-primary-700 text-white shadow-xl hover:shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all duration-300 rounded-full border border-white/10"
                                href={slide.href}
                                radius="full"
                                size="lg"
                                endContent={<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />}
                              >
                                {slide.cta}
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auto progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-10">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary-400 via-indigo-500 to-primary-600 rounded-r shadow-glow"
          style={{ width: `${((selectedIndex + 1) / totalSlides) * 100}%`, transition: "width 6.5s linear" }}
        />
      </div>

      {/* Slide counter with glass styling */}
      <div className="absolute top-4 right-4 z-10 bg-white/10 dark:bg-black/35 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 shadow-md">
        {selectedIndex + 1} <span className="text-white/50 px-0.5">/</span> {totalSlides}
      </div>

      {/* Navigation Arrows with frosted glass and custom outlines */}
      <button
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white border border-white/20 hover:border-transparent backdrop-blur-md text-white hover:text-gray-900 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white border border-white/20 hover:border-transparent backdrop-blur-md text-white hover:text-gray-900 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Navigation Dots (Horizontal custom morphing pills) */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-500 ${
              selectedIndex === index
                ? "w-8 sm:w-10 h-2 bg-gradient-to-r from-primary-400 to-indigo-500 shadow-lg shadow-primary-500/30"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
