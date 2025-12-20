import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@nextui-org/card";

export default function CategoriesSkeleton() {
  return (
    <section
      aria-label="Loading Categories"
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-12">
        <Skeleton className="w-40 h-8 mx-auto rounded-lg" />
        <Skeleton className="w-60 h-4 mt-2 mx-auto rounded-lg" />
      </div>
      <div className="flex overflow-hidden -ml-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_16.666%] min-w-0 pl-4 py-4">
            <Card className="h-full border-none shadow-sm" radius="lg">
              <CardBody className="p-4 flex flex-col items-center justify-center gap-4 text-center">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="w-24 h-4 rounded-lg" />
                  <Skeleton className="w-12 h-3 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
