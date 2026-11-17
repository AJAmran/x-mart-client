import React from "react";

export function ChartSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="flex w-full animate-pulse flex-col justify-end gap-3 rounded-lg bg-surface-sunken/40 p-4"
    >
      <div className="flex h-full items-end gap-3">
        <div className="w-1/6 h-[40%] rounded-t bg-line-hairline/60" />
        <div className="w-1/6 h-[65%] rounded-t bg-line-hairline/60" />
        <div className="w-1/6 h-[50%] rounded-t bg-line-hairline/60" />
        <div className="w-1/6 h-[85%] rounded-t bg-line-hairline/60" />
        <div className="w-1/6 h-[60%] rounded-t bg-line-hairline/60" />
        <div className="w-1/6 h-[95%] rounded-t bg-line-hairline/60" />
      </div>
      <div className="h-3 w-full rounded bg-line-hairline/40" />
    </div>
  );
}
