import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

export default function CategoriesSkeleton() {
  return (
    <section className="py-8" aria-label="Loading Categories">
      <div className="text-center mb-12">
        <Skeleton className="w-40 h-8 mx-auto rounded-lg" />
        <Skeleton className="w-60 h-4 mt-2 mx-auto rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="h-[150px]" radius="lg">
            <CardHeader className="flex justify-center items-center p-6">
              <Skeleton className="w-16 h-16 rounded-full" />
            </CardHeader>
            <CardBody className="text-center p-4">
              <Skeleton className="w-20 h-4 mx-auto rounded-lg" />
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}