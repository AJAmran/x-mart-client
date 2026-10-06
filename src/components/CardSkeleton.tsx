const CardSkeleton = () => (
  <div
    aria-hidden
    className="flex h-full flex-col overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xs"
  >
    <div className="xm-skeleton aspect-square w-full bg-surface-sunken" />
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="xm-skeleton h-4 w-full rounded-xs bg-surface-sunken" />
      <div className="xm-skeleton h-4 w-2/3 rounded-xs bg-surface-sunken" />
      <div className="xm-skeleton mt-auto h-5 w-24 rounded-xs bg-surface-sunken" />
    </div>
    <div className="flex items-center gap-2 p-4 pt-0">
      <div className="xm-skeleton size-9 shrink-0 rounded-sm bg-surface-sunken" />
      <div className="xm-skeleton h-9 flex-1 rounded-sm bg-surface-sunken" />
    </div>
  </div>
);

export default CardSkeleton;