import { Skeleton } from "@heroui/skeleton";
import { Card } from "@nextui-org/card";

export default function HeroSkeleton() {
  return (
    <section
      aria-label="Loading Hero Section"
      className="relative w-full py-4 sm:py-6 md:py-8 container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Promo Cards Skeleton (Left Column - Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/4 flex-col gap-3 sm:gap-4 min-h-full">
          {[1, 2, 3].map((_, index) => (
            <Card
              key={index}
              className="relative flex-1 rounded-xl overflow-hidden shadow-lg border-1 h-[180px]" // Approximate height
            >
              <Skeleton className="absolute inset-0 w-full h-full" />
            </Card>
          ))}
        </div>

        {/* Main Carousel Skeleton (Full width on mobile, 3/4 on desktop) */}
        <div className="w-full lg:w-3/4">
          <Card className="rounded-xl overflow-hidden shadow-xl sm:shadow-2xl h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] w-full relative">
            <Skeleton className="absolute inset-0 w-full h-full" />
            {/* Optional: Add skeleton for text overlay if needed, but a plain block is often cleaner */}
          </Card>
        </div>
      </div>
    </section>
  );
}
