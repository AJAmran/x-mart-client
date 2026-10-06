export default function FiltersSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading filters"
      className="rounded-lg border border-line-hairline bg-surface-raised p-5 shadow-xs"
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="xm-skeleton mb-2 h-5 w-16 rounded-xs bg-surface-sunken" />
          <div className="xm-skeleton h-10 w-full rounded-md bg-surface-sunken" />
        </div>
        <div>
          <div className="xm-skeleton mb-3 h-5 w-24 rounded-xs bg-surface-sunken" />
          <div className="xm-skeleton h-1.5 w-full rounded-full bg-surface-sunken" />
          <div className="xm-skeleton mt-3 h-3 w-full rounded-xs bg-surface-sunken" />
        </div>
        <div>
          <div className="xm-skeleton mb-3 h-5 w-20 rounded-xs bg-surface-sunken" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="xm-skeleton h-8 w-20 rounded-full bg-surface-sunken"
              />
            ))}
          </div>
        </div>
        <div className="xm-skeleton h-10 w-full rounded-md bg-surface-sunken" />
      </div>
    </div>
  );
}