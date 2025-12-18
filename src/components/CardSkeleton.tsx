import { Skeleton } from "@heroui/skeleton";

// Skeleton loading state
const CardSkeleton = () => {
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Skeleton className="w-full h-48 bg-gray-200" />
            <div className="p-4">
                <Skeleton className="h-6 w-3/4 bg-gray-200 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-gray-200 mb-4" />
                <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
        </div>
    );
};

export default CardSkeleton;
