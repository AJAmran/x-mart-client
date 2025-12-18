import { Skeleton } from "@heroui/skeleton";
import CardSkeletons from "../CardSkeleton";


export default function FeatureProductSkeleton() {
  return (
    <section className="py-8" aria-label="Loading Featured Products">
      <div className="text-center mb-12">
        <Skeleton className="w-40 h-8 mx-auto rounded-lg" />
        <Skeleton className="w-60 h-4 mt-2 mx-auto rounded-lg" />
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeletons key={index} />
        ))}
      </div>
    </section>
  );
}
