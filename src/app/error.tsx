"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-red-500 text-6xl mb-4"
        >
          &#9888;
        </motion.div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-600 mb-6">
          We’re sorry, but an unexpected error occurred. Please try again.
        </p>

        {/* Retry Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Try Again
        </motion.button>
      </motion.div>

      {/* Back to Homepage */}
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-primary mt-6 underline hover:text-blue-700"
      >
        Go back to the homepage
      </motion.a>
    </div>
  );
}
