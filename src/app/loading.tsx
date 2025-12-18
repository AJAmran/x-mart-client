// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="hidden md:block w-24 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse md:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero/Banner Skeleton */}
        <div className="mb-12">
          <div className="w-full h-64 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse" />
        </div>

        {/* Categories Skeleton */}
        <div className="mb-12">
          <div className="w-48 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-6 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse mx-auto mb-2" />
                <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Skeleton */}
        <div className="mb-12">
          <div className="w-64 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 mx-auto" />
          <div className="w-96 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-8 mx-auto" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Banner Skeleton */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="w-32 h-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image */}
      <div className="w-full aspect-square bg-gray-300 dark:bg-gray-700" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
        
        {/* Price */}
        <div className="w-1/2 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
        
        {/* Button */}
        <div className="w-full h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
