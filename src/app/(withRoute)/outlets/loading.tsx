import { Skeleton } from "@heroui/skeleton";

export default function OutletsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto rounded-lg" />
            <Skeleton className="h-8 w-96 mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center p-6 rounded-lg">
                <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-lg" />
                <Skeleton className="h-6 w-32 mx-auto mb-2 rounded-lg" />
                <Skeleton className="h-4 w-48 mx-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-2">
            <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
            <Skeleton className="h-6 w-72 mx-auto rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
