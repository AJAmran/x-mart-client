"use client";

import { SearchIcon } from "@/src/components/icons";
import { ThemeSwitch } from "@/src/components/theme-switch";

/**
 * AdminHeader - Client interactive island
 * Contains client-side interactive elements (theme toggle, search filter, admin profile)
 * while allowing the parent DashboardLayout to remain a high-performance React Server Component.
 */
export function AdminHeader() {
  return (
    <header className="glass sticky top-0 z-header flex items-center justify-between gap-3 py-3 pr-4 pl-16 sm:pr-6 lg:pl-6">
      <div className="flex min-w-0 items-center gap-3">
        {/* Breadcrumbs or section titles can be slotted here */}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="group relative hidden md:block">
          <label className="sr-only" htmlFor="admin-search">
            Search the console
          </label>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-subtle transition-colors duration-fast group-focus-within:text-brand"
          />
          <input
            className="h-9 w-44 rounded-md border border-line-hairline bg-surface-sunken pl-9 pr-3 text-body-sm text-content transition-colors duration-fast ease-standard placeholder:text-content-subtle hover:border-line-strong focus:border-brand focus:outline-none lg:w-64"
            id="admin-search"
            placeholder="Search…"
            type="search"
          />
        </div>

        <ThemeSwitch />

        {/* Admin identity chip */}
        <div
          aria-label="Signed in as store administrator"
          className="flex items-center gap-2.5 rounded-full border border-line-hairline bg-surface-raised py-1 pr-2 pl-1"
        >
          <span className="grid size-7 place-items-center rounded-full bg-brand-subtle text-label-sm font-bold text-brand">
            A
          </span>
          <span className="hidden text-label-sm font-semibold text-content sm:block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
