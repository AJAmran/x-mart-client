"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";

interface User {
  profilePhoto?: string;
  name: string;
  email: string;
  mobileNumber: string;
}

interface ProfileModalProps {
  user: User;
  onLogout: () => void;
}

const ProfileModal = ({ user, onLogout }: ProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="light"
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-200 dark:hover:bg-gray-700"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Image
          src={user.profilePhoto || "/default-avatar.png"}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full border-2 border-yellow-300"
        />

      </Button>

      {isOpen && (
        <motion.div
          className="absolute right-0 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex flex-col items-center p-4">
            <Image
              src={user.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full border border-gray-300"
            />
            <p className="text-lg font-semibold mt-2">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">{user.mobileNumber}</p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="flat"
              color="danger"
              className="w-full py-2 text-center"
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileModal;
