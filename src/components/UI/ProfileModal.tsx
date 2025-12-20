"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

interface User {
  profilePhoto?: string;
  name: string;
  email: string;
  mobileNumber?: string;
}

interface ProfileModalProps {
  user: User;
}

const ProfileModal = ({ user }: ProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleViewProfile = () => {
    setIsOpen(false); // Close the modal
    router.push("/profile"); // Navigate to profile page
  };

  return (
    <div className="relative">
      <Button
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700"
        variant="light"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Image
          alt={user.name}
          className="rounded-full border-2 border-yellow-300"
          height={32}
          src={user.profilePhoto || "/default-avatar.png"}
          width={32}
        />
      </Button>

      {isOpen && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          exit={{ opacity: 0, y: -10 }}
          initial={{ opacity: 0, y: -10 }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-col items-center p-4">
            <Image
              alt={user.name}
              className="rounded-full border border-gray-300"
              height={80}
              src={user.profilePhoto || "/default-avatar.png"}
              width={80}
            />
            <p className="text-lg font-semibold mt-2">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <Button
              className="w-full py-2 text-center"
              color="primary"
              variant="flat"
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileModal;
