"use client";

import { motion } from "framer-motion";
import { Tag, Percent, Clock, Sparkles } from "lucide-react";
import { Chip } from "@heroui/chip";
import { Container } from "@/src/components/UI/Container";

const STATS = [
  {
    icon: Percent,
    text: "Up to 50% Off",
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
  },
  {
    icon: Clock,
    text: "Limited Stock",
    bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
  },
  {
    icon: Tag,
    text: "Daily Deals",
    bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
  },
];

export default function DealsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/50 via-white to-white dark:from-primary-950/10 dark:via-transparent dark:to-transparent">
      <Container className="py-12 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <Chip
              className="mb-4 border-primary-200/50 dark:border-primary-800/30"
              color="primary"
              size="sm"
              startContent={
                <Sparkles
                  className="animate-pulse text-primary-500"
                  size={12}
                />
              }
              variant="dot"
            >
              Limited Time Offers
            </Chip>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
            initial={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Deals &amp; Offers
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-xl text-base text-gray-500 sm:text-lg dark:text-gray-400"
            initial={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Grab the best discounts on fresh groceries, daily essentials, and
            more. Stock up and save big today!
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {STATS.map((item) => (
              <div
                key={item.text}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-sm ${item.bg}`}
              >
                <item.icon size={14} />
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
