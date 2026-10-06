export default function CategoriesSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading categories" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="xm-skeleton mx-auto h-3 w-24 rounded-xs bg-surface-sunken" />
          <div className="xm-skeleton mx-auto mt-3 h-8 w-64 rounded-sm bg-surface-sunken" />
          <div className="xm-skeleton mx-auto mt-3 h-4 w-full rounded-xs bg-surface-sunken" />
        </div>

        <div className="mt-12 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-w-0 flex-1 flex-col items-center gap-3 rounded-lg border border-line-hairline bg-surface-raised p-5"
            >
              <div className="xm-skeleton size-20 shrink-0 rounded-full bg-surface-sunken" />
              <div className="xm-skeleton h-4 w-16 rounded-xs bg-surface-sunken" />
              <div className="xm-skeleton h-2.5 w-12 rounded-xs bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}