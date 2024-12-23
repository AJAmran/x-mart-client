"use client";

import { motion } from "framer-motion";
import { FaShoppingCart, FaArrowRight } from "react-icons/fa";
import banner from "../assets/banner/banner.jpg";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative bg-background">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between py-10 px-4 lg:py-16 lg:px-8">
        {/* Text Section */}
        <motion.div
          className="lg:w-1/2 w-full text-center lg:text-left space-y-6 lg:space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Shop Smarter with{" "}
            <span className="text-accent">Super Deals!</span>
          </h1>
          <p className="text-mutedText text-base md:text-lg lg:text-xl">
            Discover the best products at unbeatable prices. Shop now and save
            big on your daily essentials.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-base md:text-lg rounded-lg shadow-md hover:bg-secondary transition">
              <FaShoppingCart size={20} />
              Get Started
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-black text-base md:text-lg rounded-lg shadow-md hover:bg-[#FFC107] transition">
              Explore Now
              <FaArrowRight size={20} />
            </button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="lg:w-1/2 w-full flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={banner}
            alt="Shopping Deals"
            className="w-full max-w-xs md:max-w-md lg:max-w-lg rounded-lg"
            priority
          />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-8 left-8 w-24 h-24 md:w-32 md:h-32 bg-accent opacity-20 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-32 h-32 md:w-48 md:h-48 bg-primary opacity-10 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
}
