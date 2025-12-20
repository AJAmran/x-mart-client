"use client";

import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax effect for background image
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
  };

  if (!mounted) return null;

  return (
    <section
      className={`relative overflow-hidden rounded-b-md py-24 md:py-32 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900"
          : "bg-gradient-to-br from-primary-300 via-primary-400 to-primary-500"
      } text-white`}
    >
      {/* Background Wave Effect */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
      </div>

      {/* Hero Image with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image
          alt="X-mart hero background"
          className="object-cover w-full h-full opacity-30"
          height={1080}
          loading="lazy"
          src="/hero-bg.jpg"
          width={1920}
        />
      </motion.div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-md z-10" />

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          animate="visible"
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          variants={containerVariants}
        >
          {/* Headline with Shadow */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg"
            variants={childVariants}
          >
            Discover X-mart
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-10 font-light max-w-2xl mx-auto"
            variants={childVariants}
          >
            Empowering global shoppers with quality, trust, and innovation since
            2018.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={childVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                aria-label="Explore our products"
                as={Link}
                className="font-semibold px-8 py-3 bg-secondary-500 text-white dark:bg-secondary-600 dark:text-white shadow-lg"
                color="secondary"
                endContent={<ArrowRight size={20} />}
                href="/shop"
                size="lg"
              >
                Explore Products
              </Button>
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                aria-label="Learn more about X-mart"
                as={Link}
                className="font-semibold px-8 py-3 border-2 border-white text-white dark:border-gray-300 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20"
                endContent={<ShoppingBag size={20} />}
                href="/about"
                size="lg"
                variant="bordered"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Particle Effect (Optional) */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent dark:from-gray-900/10"
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </section>
  );
}
