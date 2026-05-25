"use client";

import React from "react";
import { Flame, Clock, Tag, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Card } from "@nextui-org/card";
import Link from "next/link";
import Carousel from "./Carousel";

interface PromoCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  href: string;
}

const promoCards: PromoCard[] = [
  {
    id: 1,
    icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Hot Deals",
    description: "Up to 50% off on top picks",
    gradient: "from-orange-500 to-red-600",
    href: "/deals",
  },
  {
    id: 2,
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Flash Sale",
    description: "Limited time offers",
    gradient: "from-purple-500 to-indigo-600",
    href: "/deals",
  },
  {
    id: 3,
    icon: <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
    title: "Daily Discounts",
    description: "Fresh deals every day",
    gradient: "from-emerald-500 to-green-600",
    href: "/shop",
  },
];

const features = [
  { icon: <Truck className="w-4 h-4" />, label: "Free Delivery", desc: "Orders over ৳999" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Secure Payment", desc: "100% safe checkout" },
  { icon: <Headphones className="w-4 h-4" />, label: "24/7 Support", desc: "Dedicated help" },
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(17,24,39,1) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Hero Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Promo Cards - Left sidebar on desktop, horizontal row on mobile */}
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:w-1/4">
            {promoCards.map((card, index) => (
              <Link key={card.id} href={card.href}>
                <Card
                  isPressable
                  className={`
                    relative overflow-hidden rounded-xl border-none shadow-md hover:shadow-xl
                    transition-all duration-300 group cursor-pointer
                    bg-gradient-to-br ${card.gradient}
                    animate-fade-in-up opacity-0 [animation-fill-mode:forwards]
                  `}
                  style={{ animationDelay: `${150 * index}ms` }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <div className="relative flex lg:flex-col items-center lg:items-start gap-3 lg:gap-2 p-3 sm:p-4">
                    <div className="shrink-0 p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-full group-hover:scale-110 group-hover:rotate-[-8deg] transition-all duration-300">
                      {card.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                        {card.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 truncate">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Main Carousel */}
          <div className="w-full lg:w-3/4 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:300ms]">
            <Carousel />
          </div>
        </div>

        {/* Features Strip */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-gray-800/80 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                {f.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                  {f.label}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
