import CardSkeletons from "../CardSkeleton";


export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <CardSkeletons key={index} />
      ))}
    </div>
  );
}
