import { Skeleton } from "@heroui/skeleton";
import CardSkeletons from "../CardSkeleton";


export default function FeatureProductSkeleton() {
  return (
    <section aria-label="Loading Featured Products" className="py-8">
      <div className="text-center mb-12">
        <Skeleton className="w-40 h-8 mx-auto rounded-lg" />
        <Skeleton className="w-60 h-4 mt-2 mx-auto rounded-lg" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeletons key={index} />
        ))}
      </div>
    </section>
  );
}
