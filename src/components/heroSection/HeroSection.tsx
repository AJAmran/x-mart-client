"use client";

import React from "react";
import { Flame, Clock, Tag, Truck, ShieldCheck, Headphones, ArrowUpRight } from "lucide-react";
import { Card } from "@nextui-org/card";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Carousel from "./Carousel";

interface PromoCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  description: string;
  gradient: string;
  glowColor: string;
  href: string;
}

const promoCards: PromoCard[] = [
  {
    id: 1,
    icon: <Flame className="w-6 h-6 text-white" />,
    title: "Hot Deals",
    badge: "50% OFF",
    description: "Unbeatable discounts on top category picks",
    gradient: "from-primary-600 via-primary-500 to-rose-500",
    glowColor: "rgba(244, 63, 94, 0.35)",
    href: "/deals",
  },
  {
    id: 2,
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Flash Sale",
    badge: "LIMITED TIME",
    description: "Hurry up! Incredible hourly lightning deals",
    gradient: "from-primary-700 via-primary-600 to-indigo-500",
    glowColor: "rgba(124, 58, 237, 0.35)",
    href: "/deals",
  },
  {
    id: 3,
    icon: <Tag className="w-6 h-6 text-white" />,
    title: "Daily Discounts",
    badge: "NEW EVERYDAY",
    description: "Fresh coupons & daily bargains added daily",
    gradient: "from-primary-600 via-primary-500 to-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.35)",
    href: "/shop",
  },
];

const features = [
  { 
    icon: <Truck className="w-5 h-5" />, 
    label: "Express Shipping", 
    desc: "Free on orders over ৳999",
    color: "text-primary dark:text-primary-400",
    bg: "bg-primary/10 dark:bg-primary-950/40"
  },
  { 
    icon: <ShieldCheck className="w-5 h-5" />, 
    label: "Secured Gateway", 
    desc: "100% verified SSL checkout",
    color: "text-primary dark:text-primary-400",
    bg: "bg-primary/10 dark:bg-primary-950/40"
  },
  { 
    icon: <Headphones className="w-5 h-5" />, 
    label: "Premium Support", 
    desc: "Dedicated 24/7 expert help",
    color: "text-primary dark:text-primary-400",
    bg: "bg-primary/10 dark:bg-primary-950/40"
  },
];

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-4 sm:py-6 lg:py-8">
      {/* Dynamic Background Gradients / Ambient Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 dark:bg-primary-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-secondary-200/20 dark:bg-secondary-900/10 blur-[120px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(17,24,39,1) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(17,24,39,1) 1.5px, transparent 1.5px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Promo Sidebar Cards (Left sidebar on desktop, horizontal flex row on mobile) */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 lg:w-[28%]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {promoCards.map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="relative group cursor-pointer h-full"
              >
                <Link href={card.href} className="block h-full">
                  <Card
                    isPressable
                    className={`
                      relative overflow-hidden rounded-2xl border-none shadow-[0_4px_20px_rgba(0,0,0,0.06)] 
                      dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] h-full w-full
                      bg-gradient-to-br ${card.gradient} transition-all duration-300
                    `}
                    style={{
                      contentVisibility: "auto",
                    }}
                  >
                    {/* Ambient Glow Backplate on Hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none scale-105"
                      style={{
                        background: `radial-gradient(circle, ${card.glowColor} 0%, transparent 70%)`
                      }}
                    />

                    {/* High-fidelity Frosted Glass Border Overlay */}
                    <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none z-10" />

                    {/* Smooth Light Sweep Ray Effect on Hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full pointer-events-none z-20"
                      variants={{
                        hover: {
                          x: ["-100%", "150%"],
                          transition: { duration: 1.2, ease: "easeInOut" }
                        }
                      }}
                    />

                    {/* Card Content Layout */}
                    <div className="relative flex flex-col justify-between p-5 sm:p-6 h-full min-h-[140px] z-10">
                      {/* Header row: Icon & Arrow */}
                      <div className="flex justify-between items-start">
                        <div className="shrink-0 p-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/10 group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-300 shadow-md">
                          {card.icon}
                        </div>
                        {card.badge && (
                          <span className="text-[9px] font-black tracking-widest bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/15 shadow-sm uppercase">
                            {card.badge}
                          </span>
                        )}
                      </div>

                      {/* Footer row: Title, Description, and Link indicator */}
                      <div className="mt-6 flex justify-between items-end gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide truncate">
                            {card.title}
                          </h3>
                          <p className="text-xs text-white/85 mt-1 leading-normal font-medium line-clamp-2">
                            {card.description}
                          </p>
                        </div>
                        
                        {/* Mini glass arrow pointer */}
                        <div className="shrink-0 p-1.5 rounded-lg bg-white/15 border border-white/10 text-white shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Carousel Display (Right on desktop, full width on mobile) */}
          <motion.div 
            className="w-full lg:w-[72%] rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_45px_rgba(0,0,0,0.35)]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Carousel />
          </motion.div>
        </div>

        {/* Features Strip - Perfectly aligned, premium micro-interactive grid */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              variants={featureVariants}
              whileHover={{ 
                y: -4, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                borderColor: "rgba(var(--primary-color-rgb), 0.25)"
              }}
              className="flex items-center gap-4 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl px-5 py-4 border border-gray-100 dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 group cursor-default"
            >
              {/* Rounded soft-glow background for icons */}
              <div className={`p-3 rounded-xl ${f.bg} ${f.color} shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                {f.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-extrabold text-gray-800 dark:text-gray-100 truncate tracking-wide">
                  {f.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
