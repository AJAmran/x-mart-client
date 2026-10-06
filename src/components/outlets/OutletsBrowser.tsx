"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import OutletCard from "./OutletCard";
import { isOpenNow, latestClosingMinutes } from "@/src/lib/branchHours";
import { isBranchStatus, type TBranch } from "@/src/interface/branch";

type Filter = "all" | "open-now" | "open-late";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All outlets" },
  { key: "open-now", label: "Open now" },
  { key: "open-late", label: "Open past 9pm" },
];

function matchesQuery(branch: TBranch, query: string): boolean {
  const q = query.trim().toLowerCase();

  if (!q) return true;

  return [
    branch.name,
    branch.code,
    branch.description,
    branch.type,
    branch.location?.city,
    branch.location?.state,
    branch.location?.address,
  ]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(q));
}

/**
 * Outlet search and filter.
 *
 * Replaces a control bar that held `searchTerm` / `selectedFilter` in state and
 * then did nothing with them — the dropdown offered "Near Me", "24 Hour" and
 * "Premium", none of which map to any field on `TBranch`. Filtering now runs
 * against data that exists: name, code, type, description, city, state and
 * address for the text query, and the published `operatingHours` for presets.
 */
export function OutletsBrowser({ outlets }: { outlets: TBranch[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    return outlets.filter((branch) => {
      // Only tradeable branches are worth showing in a directory.
      if (!isBranchStatus(branch.status, "active")) return false;
      if (!matchesQuery(branch, query)) return false;
      if (filter === "open-now") return isOpenNow(branch);
      if (filter === "open-late") {
        const latest = latestClosingMinutes(branch);

        return latest !== null && latest >= 21 * 60;
      }

      return true;
    });
  }, [outlets, query, filter]);

  const hasOutlets = outlets.length > 0;
  const hasControls = query.trim() !== "" || filter !== "all";

  function reset() {
    setQuery("");
    setFilter("all");
  }

  const fieldBase =
    "h-11 w-full rounded-md border border-line-hairline bg-surface-sunken pl-10 pr-3 text-body-sm text-content placeholder:text-content-subtle transition-colors duration-fast ease-standard focus:border-brand focus:outline-none";

  return (
    <div>
      {/* ---- Controls ---- */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="outlet-search">
            Search outlets
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-subtle"
          />
          <input
            className={fieldBase}
            id="outlet-search"
            placeholder="Search by outlet, city or area"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div
          aria-label="Filter outlets"
          className="flex shrink-0 flex-wrap items-center gap-1.5 rounded-md border border-line-hairline bg-surface-sunken p-1"
          role="group"
        >
          <SlidersHorizontal aria-hidden className="ml-1.5 size-4 shrink-0 text-content-subtle" />
          {FILTERS.map((option) => {
            const selected = filter === option.key;

            return (
              <button
                key={option.key}
                aria-pressed={selected}
                className={[
                  "h-8 rounded-sm px-3 text-label-sm font-medium",
                  "transition-colors duration-fast ease-standard",
                  selected
                    ? "bg-brand text-brand-contrast"
                    : "text-content-muted hover:text-content",
                ].join(" ")}
                type="button"
                onClick={() => setFilter(option.key)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Result summary ---- */}
      <p aria-live="polite" className="mt-4 text-label-sm text-content-subtle">
        Showing {results.length} of {outlets.length} outlet
        {outlets.length === 1 ? "" : "s"}
        {hasControls && (
          <button
            className="ml-2 inline-flex items-center gap-1 font-medium text-brand hover:underline"
            type="button"
            onClick={reset}
          >
            <X aria-hidden size={12} />
            Clear
          </button>
        )}
      </p>

      {/* ---- Results ---- */}
      {results.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((outlet) => (
            <li key={outlet._id ?? outlet.code}>
              <OutletCard outlet={outlet} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-hairline bg-surface-raised px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-brand-subtle text-brand">
            <Search aria-hidden size={22} />
          </span>
          <div>
            <p className="text-title-md font-semibold text-content">
              {!hasOutlets
                ? "No outlets listed yet"
                : hasControls
                  ? "No outlets match that search"
                  : "No outlets are trading right now"}
            </p>
            <p className="mt-1.5 max-w-prose text-body-sm text-content-muted">
              {!hasOutlets
                ? "We are populating the directory. Please check back shortly."
                : hasControls
                  ? "Try a different city or area, or reset the filters to see every location."
                  : "Reset the filters to browse all locations and their trading hours."}
            </p>
          </div>
          {hasOutlets && hasControls && (
            <button
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-line-hairline px-4 text-body-sm font-semibold text-content transition-colors duration-fast ease-standard hover:bg-surface-sunken"
              type="button"
              onClick={reset}
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OutletsBrowser;