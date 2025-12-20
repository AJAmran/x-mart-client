// app/not-found.tsx
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Graphic */}
        <div className="relative mb-8">
          <div className="w-48 h-48 mx-auto bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center border-8 border-white dark:border-gray-700">
            <div className="text-center">
              <div className="text-8xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-bounce delay-75" />
          <div className="absolute top-1/2 -right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Oops! The page you&apos;re looking for seems to have wandered off. 
              Let&apos;s get you back to shopping!
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Quick Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                as={Link}
                className="h-12 justify-start"
                color="primary"
                href="/"
                startContent={<Home className="w-5 h-5" />}
                variant="flat"
              >
                Home Page
              </Button>
              <Button
                as={Link}
                className="h-12 justify-start"
                color="primary"
                href="/shop"
                startContent={<ShoppingBag className="w-5 h-5" />}
                variant="flat"
              >
                Browse Shop
              </Button>
            </div>
          </div>

          {/* Search Help */}
          <div className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
            <p>Try searching for what you need:</p>
            <div className="flex justify-center">
              <Link 
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors" 
                href="/shop"
              >
                <Search className="w-4 h-4" />
                Explore Products
              </Link>
            </div>
          </div>

          {/* Main CTA */}
          <div className="pt-4">
            <Button
              as={Link}
              className="w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600"
              color="primary"
              href="/"
              size="lg"
              startContent={<Home className="w-6 h-6" />}
            >
              Back to Homepage
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
