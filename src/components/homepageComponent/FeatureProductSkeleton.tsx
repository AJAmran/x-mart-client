export default function FeatureProductSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading products" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-xl">
            <div className="xm-skeleton mb-3 h-3 w-28 rounded-xs bg-surface-sunken" />
            <div className="xm-skeleton h-8 w-72 rounded-sm bg-surface-sunken" />
            <div className="xm-skeleton mt-3 h-4 w-full rounded-xs bg-surface-sunken" />
          </div>
          <div className="xm-skeleton hidden h-10 w-28 shrink-0 rounded-sm bg-surface-sunken sm:block" />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-lg border border-line-hairline bg-surface-raised"
            >
              <div className="xm-skeleton aspect-square w-full bg-surface-sunken" />
              <div className="flex flex-col gap-2 p-4">
                <div className="xm-skeleton h-4 w-full rounded-xs bg-surface-sunken" />
                <div className="xm-skeleton h-4 w-2/3 rounded-xs bg-surface-sunken" />
                <div className="xm-skeleton mt-auto h-5 w-20 rounded-xs bg-surface-sunken" />
              </div>
              <div className="flex items-center gap-2 p-4 pt-0">
                <div className="xm-skeleton size-9 shrink-0 rounded-sm bg-surface-sunken" />
                <div className="xm-skeleton h-9 flex-1 rounded-sm bg-surface-sunken" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}