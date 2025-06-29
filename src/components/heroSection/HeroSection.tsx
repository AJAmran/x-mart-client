"use client";

import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import { Flame, Clock, Tag, Truck } from "lucide-react";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";

interface HeroImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface PromoCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgImage: string;
}

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/70 hover:bg-white transition-all duration-300" />
    ),
  };

  const heroImages: HeroImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1679611364723-05cbfe2eeaea?q=80&w=1178&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Fresh Grocery Sale",
      title: "Fresh Picks, Big Savings",
      subtitle: "Discover up to 50% off on premium groceries",
      cta: "Shop Now",
    },
    {
      id: 2,
      src: "https://cdn.mos.cms.futurecdn.net/jT68rXArA7cCZq8bVwFiLV.jpg",
      alt: "Electronics Special",
      title: "Tech That Inspires",
      subtitle: "Explore new gadgets with 30% off",
      cta: "Discover Tech",
    },
    {
      id: 3,
      src: "https://image.josbank.com/is/image/JosBank/111616-spring-and-summer-trends",
      alt: "Summer Fashion",
      title: "Summer Style Unveiled",
      subtitle: "Trendy collections starting at $19.99",
      cta: "Browse Now",
    },
  ];

  const promoCards: PromoCard[] = [
    {
      id: 1,
      icon: <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Hot Deals",
      description: "Exclusive offers on top products",
      bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6fTYfAPg8BYxZdlcTYEyYOGh9_gWM3NRz6Q&s",
    },
    {
      id: 2,
      icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Flash Sale",
      description: "Hurry, limited time only!",
      bgImage: "",
    },
    {
      id: 3,
      icon: <Tag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />,
      title: "Daily Discounts",
      description: "Fresh deals every day",
      bgImage: "",
    },
  ];

  if (!isMounted) {
    return (
      <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[520px] bg-gray-100 rounded-2xl animate-pulse" />
    );
  }

  return (
    <section className="relative w-full container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Promo Cards (Left Column) */}
        <div className="w-full lg:w-1/4 flex flex-col gap-3 sm:gap-4 min-h-full">
          {promoCards.map((card) => (
            <Card
              key={card.id}
              isPressable
              className="relative flex-1 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <Image
                src={card.bgImage}
                alt={card.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-start justify-end p-4 sm:p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/80 rounded-lg group-hover:bg-primary transition-colors duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm opacity-90">
                  {card.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Carousel (Right Side) */}
        <div className="w-full lg:w-3/4">
          <div className="relative h-[360px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden rounded-2xl shadow-xl">
            <Slider ref={sliderRef} {...settings} className="w-full h-full">
              {heroImages.map((item) => (
                <div
                  key={item.id}
                  className="relative h-[360px] sm:h-[480px] lg:h-[520px] w-full"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="max-w-sm sm:max-w-md lg:max-w-lg text-white">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                          {item.title}
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90 leading-relaxed">
                          {item.subtitle}
                        </p>
                        <Button
                          color="primary"
                          size="lg"
                          radius="full"
                          className="font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-800 transition-all duration-300"
                        >
                          {item.cta}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            {/* Custom Navigation Arrows */}
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 hidden sm:block"
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
              onClick={() => sliderRef.current?.slickNext()}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 hidden sm:block"
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
