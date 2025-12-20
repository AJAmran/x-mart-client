"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Tooltip } from "@nextui-org/tooltip";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useMemo } from "react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamSectionProps {
  team: TeamMember[];
}

export default function TeamSection({ team }: TeamSectionProps) {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  // Social icon map
  const socialIcons = useMemo(
    () => ({
      github: { icon: Github, label: "GitHub" },
      linkedin: { icon: Linkedin, label: "LinkedIn" },
      twitter: { icon: Twitter, label: "Twitter" },
    }),
    []
  );

  return (
    <section className="py-20">
      <div className="">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          Meet Our Team
        </motion.h2>
        <motion.div
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          variants={containerVariants}
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card
                isHoverable
                className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
              >
                <CardBody className="p-6 text-center flex flex-col items-center">
                  <div className="relative flex justify-center items-center w-32 h-32 mb-4">
                    <Image
                      isZoomed
                      alt={`Portrait of ${member.name}`}
                      className="rounded-full border-4 border-primary/20 shadow-md object-cover"
                      height={120}
                      loading="lazy"
                      src={member.image}
                      width={120}
                    />
                    {/* Overlay for hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mt-1">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm line-clamp-2">
                    {member.bio}
                  </p>
                  {/* Social Links */}
                  {member.socialLinks && (
                    <motion.div
                      className="flex justify-center gap-4 mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      {Object.entries(member.socialLinks).map(
                        ([platform, url]) => {
                          const { icon: Icon, label } =
                            socialIcons[platform as keyof typeof socialIcons];

                          return (
                            <Tooltip
                              key={platform}
                              color="primary"
                              content={label}
                              placement="top"
                            >
                              <a
                                aria-label={`${member.name}'s ${label} profile`}
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                                href={url}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <Icon size={20} />
                              </a>
                            </Tooltip>
                          );
                        }
                      )}
                    </motion.div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
