"use client";

import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function ContactCTA() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Have questions or want to learn more about X-mart? We&apos;re here to help!
          </p>
          <Button
            as={Link}
            href="/contact"
            color="secondary"
            size="lg"
            endContent={<Mail size={20} />}
            className="font-medium"
            aria-label="Contact us"
          >
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
