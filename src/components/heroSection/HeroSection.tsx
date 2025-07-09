"use client";

import React from "react";
import { Flame, Clock, Tag } from "lucide-react";
import Image from "next/image";
import { Card } from "@nextui-org/card";
import Carousel from "./Carousel";

interface PromoCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  bgImage: string;
}

const promoCards: PromoCard[] = [
  {
    id: 1,
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Hot Deals",
    description: "Exclusive offers on top products",
    bgImage:
      "https://media.istockphoto.com/id/1387606895/vector/hot-deal-banner-special-and-limited-offer-sale-countdown-badge-promo-sticker-with-stopwatch.jpg?s=612x612&w=0&k=20&c=MpGFvD0N4cGiBXijEP76ZbwWKMY-WwrW4cNiyZLF3h8=",
  },
  {
    id: 2,
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Flash Sale",
    description: "Hurry, limited time only!",
    bgImage:
      "https://media.istockphoto.com/id/2153946880/vector/flash-sale-logo-vector-illustration.jpg?s=612x612&w=0&k=20&c=RHppMAaB2WYtRejPYHXSZifa_coC_UlxZ6t_PWzZFcY=",
  },
  {
    id: 3,
    icon: <Tag className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Daily Discounts",
    description: "Fresh deals every day",
    bgImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw-dc-3u7oDtNzoUNYMB3UVbDvScuEGaulWg&s",
  },
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-4 sm:py-6 md:py-8 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Promo Cards (Left Column - Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/4 flex-col gap-3 sm:gap-4 min-h-full">
          {promoCards.map((card) => (
            <Card
              key={card.id}
              isPressable
              className="relative flex-1 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group shadow-lg border-1"
            >
              <Image
                src={card.bgImage}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 flex flex-col items-center justify-center p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-primary rounded-full">
                  {card.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm mt-1 text-center">
                  {card.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Carousel (Full width on mobile, 3/4 on desktop) */}
        <div className="w-full lg:w-3/4">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
