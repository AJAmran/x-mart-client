"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface GlobalErrorProps {
  errorCode?: number; // Error code (e.g., 404, 500)
  errorMessage?: string; // Custom error message
}

const ErrorPage: React.FC<GlobalErrorProps> = ({
  errorCode = 404,
  errorMessage = "Oops! The page you're looking for doesn't exist.",
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="bg-white p-6 rounded-full shadow-lg">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-primary text-6xl font-bold"
          >
            🚧
          </motion.span>
        </div>
      </motion.div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-6"
      >
        <h1 className="text-4xl font-bold">
          {errorCode === 404 ? "Page Not Found" : "Something Went Wrong"}
        </h1>
        <p className="text-gray-600 mt-2">{errorMessage}</p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="flex space-x-4 mt-6"
      >
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:shadow-lg transition-all hover:bg-blue-700"
        >
          Go to Homepage
        </button>
        <button
          onClick={() => router.refresh()}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:shadow-lg transition-all hover:bg-gray-300"
        >
          Retry
        </button>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
