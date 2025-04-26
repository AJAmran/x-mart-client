import { Skeleton } from "@heroui/skeleton";
import { Card, CardHeader } from "@nextui-org/card";

export default function HeroSkeleton() {
  return (
    <section
      className="gap-4 grid grid-cols-12 grid-rows-2 mt-10"
      aria-label="Loading Promotional Banners"
    >
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Card
          key={index}
          className={`col-span-12 ${
            index === 3
              ? "sm:col-span-5"
              : index === 4
                ? "sm:col-span-7"
                : "sm:col-span-4"
          } h-[300px]`}
          radius="lg"
        >
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <Skeleton className="w-20 h-4 rounded-lg" />
            <Skeleton className="w-32 h-6 mt-2 rounded-lg" />
          </CardHeader>
          <Skeleton className="w-full h-full rounded-lg" />
        </Card>
      ))}
    </section>
  );
}
