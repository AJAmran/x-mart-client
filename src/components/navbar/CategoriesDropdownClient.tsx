"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import NextLink from "next/link";
import { ChevronDown, LayoutGrid, ArrowRight } from "lucide-react";

import type { Category } from "@/src/data/CategoriesData";

type CategoriesDropdownProps = {
  categories: Category[];
  buttonText: string;
  /** Rendered as a right-aligned shortcut inside the panel. */
  align?: "start" | "end";
};

/** Hover-intent delay, so sweeping the cursor across the bar does not flicker. */
const OPEN_DELAY_MS = 90;
const CLOSE_DELAY_MS = 160;

export function CategoriesDropdownClient({
  categories,
  buttonText,
  align = "start",
}: CategoriesDropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const rootRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openNow = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers]);

  const closeSoon = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearTimers]);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  // Dismiss on outside pointer-down.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, closeNow]);

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeNow();
        rootRef.current?.querySelector("button")?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeNow]);

  const active =
    categories.find((category) => category.id === activeId) ?? categories[0];

  function shopHref(categoryId: string, subCategoryId?: string) {
    const params = new URLSearchParams({ category: categoryId });
    if (subCategoryId) params.set("subcategory", subCategoryId);
    return `/shop?${params.toString()}`;
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeSoon();
      }}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      ref={rootRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="true"
        className={[
          "inline-flex h-9 shrink-0 items-center gap-2 rounded-sm px-3.5",
          "text-label-sm font-semibold transition-colors duration-fast ease-standard",
          open
            ? "bg-surface-sunken text-content"
            : "text-content-muted hover:bg-surface-sunken hover:text-content",
        ].join(" ")}
        type="button"
        onClick={() => (open ? closeNow() : openNow())}
        onFocus={openNow}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            openNow();
          }
        }}
      >
        <LayoutGrid aria-hidden size={16} />
        {buttonText}
        <ChevronDown
          aria-hidden
          className={`transition-transform duration-fast ease-standard ${open ? "rotate-180" : ""}`}
          size={15}
        />
      </button>

      {open && (
        <div
          className={[
            "absolute top-full z-overlay mt-1 w-[min(46rem,calc(100vw-2rem))]",
            "overflow-hidden rounded-lg border border-line-hairline",
            "bg-surface-raised shadow-xl",
            align === "end" ? "right-0" : "left-0",
          ].join(" ")}
          id={panelId}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,15rem)_1fr]">
            {/* ---- Level 1 ---- */}
            <ul
              aria-label="Product categories"
              className="max-h-[26rem] overflow-y-auto border-b border-line-hairline p-2 sm:border-b-0 sm:border-r"
            >
              {categories.map((category) => {
                const isActive = category.id === active?.id;

                return (
                  <li key={category.id}>
                    <NextLink
                      aria-current={isActive ? "true" : undefined}
                      className={[
                        "flex items-center gap-3 rounded-sm px-2.5 py-2",
                        "transition-colors duration-fast ease-standard",
                        isActive
                          ? "bg-brand-subtle text-brand"
                          : "text-content-muted hover:bg-surface-sunken hover:text-content",
                      ].join(" ")}
                      href={shopHref(category.id)}
                      onClick={closeNow}
                      onFocus={() => setActiveId(category.id)}
                      onMouseEnter={() => setActiveId(category.id)}
                    >
                      <Image
                        alt=""
                        className="size-6 shrink-0 rounded-full"
                        height={24}
                        src={category.image as StaticImageData}
                        width={24}
                      />
                      <span className="min-w-0 flex-1 truncate text-body-sm font-medium">
                        {category.name}
                      </span>
                    </NextLink>
                  </li>
                );
              })}
            </ul>

            {/* ---- Level 2 (in-panel, so nothing overflows the viewport) ---- */}
            <div className="max-h-[26rem] overflow-y-auto p-4">
              {active ? (
                <>
                  <p className="text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
                    {active.name}
                  </p>
                  <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {(active.subCategory ?? []).map((sub) => (
                      <li key={sub.id}>
                        <NextLink
                          className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-body-sm text-content-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-brand"
                          href={shopHref(active.id, sub.id)}
                          onClick={closeNow}
                        >
                          {sub.name}
                          <ArrowRight aria-hidden size={14} />
                        </NextLink>
                      </li>
                    ))}
                  </ul>

                  <NextLink
                    className="mt-4 inline-flex items-center gap-1.5 text-label-sm font-semibold text-brand transition-colors duration-fast hover:text-brand-hover"
                    href={shopHref(active.id)}
                    onClick={closeNow}
                  >
                    Browse all {active.name.toLowerCase()}
                    <ArrowRight aria-hidden size={14} />
                  </NextLink>
                </>
              ) : (
                <p className="text-body-sm text-content-subtle">
                  Pick a category to see its departments.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesDropdownClient;