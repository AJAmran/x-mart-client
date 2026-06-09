export default function DealsSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800/60 dark:bg-gray-900"
        >
          <div className="h-48 rounded-t-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-5 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-6 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="flex gap-2 pt-2">
              <div className="h-10 flex-1 rounded-xl bg-gray-100 dark:bg-gray-800" />
              <div className="h-10 w-12 rounded-xl bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
