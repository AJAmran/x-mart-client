import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@nextui-org/card";


export default function FiltersSkeleton() {
  return (
    <Card className="p-4 shadow-sm">
      <CardBody className="space-y-6">
        <div>
          <Skeleton className="w-20 h-4 mb-2 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
        <Skeleton className="w-full h-10 rounded-lg" />
        <div>
          <Skeleton className="w-20 h-4 mb-2 rounded-lg" />
          <Skeleton className="w-full h-4 rounded-lg" />
          <div className="flex justify-between mt-2">
            <Skeleton className="w-10 h-4 rounded-lg" />
            <Skeleton className="w-10 h-4 rounded-lg" />
          </div>
        </div>
        <div>
          <Skeleton className="w-20 h-4 mb-2 rounded-lg" />
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-6 mb-2 rounded-lg" />
          ))}
        </div>
        <Skeleton className="w-full h-10 rounded-lg" />
      </CardBody>
    </Card>
  );
}