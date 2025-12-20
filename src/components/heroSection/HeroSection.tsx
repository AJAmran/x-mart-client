"use client";

import React from "react";
import { Flame, Clock, Tag } from "lucide-react";
import { Card } from "@nextui-org/card";
import Carousel from "./Carousel";

interface PromoCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const promoCards: PromoCard[] = [
  {
    id: 1,
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Hot Deals",
    description: "Exclusive offers on top products",
    gradient: "bg-gradient-to-br from-orange-400 to-red-600",
  },
  {
    id: 2,
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Flash Sale",
    description: "Hurry, limited time only!",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    id: 3,
    icon: <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Daily Discounts",
    description: "Fresh deals every day",
    gradient: "bg-gradient-to-br from-green-400 to-emerald-600",
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
              className={`relative flex-1 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group shadow-lg border-none ${card.gradient}`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold tracking-wide">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm mt-1 text-center opacity-90 font-medium">
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
