"use client";

import { Card, CardBody } from "@nextui-org/card";
import { motion } from "framer-motion";
import { Award, Shield, Lightbulb, Leaf } from "lucide-react";

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface ValuesSectionProps {
  values: Value[];
}

const iconMap: { [key: string]: React.ComponentType<{ className: string }> } = {
  Award: Award as React.ComponentType<{ className: string }>,
  Shield: Shield as React.ComponentType<{ className: string }>,
  Lightbulb: Lightbulb as React.ComponentType<{ className: string }>,
  Leaf: Leaf as React.ComponentType<{ className: string }>,
};

export default function ValuesSection({ values }: ValuesSectionProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg Grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = iconMap[value.icon];
            return (
              <motion.div
                key={value.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardBody className="p-6 text-center">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {value.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
