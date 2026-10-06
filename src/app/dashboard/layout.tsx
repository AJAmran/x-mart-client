"use client";

import type { ReactNode } from "react";
import { SearchIcon } from "@/src/components/icons";

import Sidebar from "@/src/components/UI/Sidebar";
import { ThemeSwitch } from "@/src/components/theme-switch";

/**
 * Admin shell.
 *
 * The page slot is deliberately left unconstrained — each dashboard page
 * renders its own `<Container>` so it inherits the same measure and gutter as
 * the storefront.
 */
const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-dvh bg-surface font-sans">
    <Sidebar />

    <div className="flex min-w-0 flex-1 flex-col">
      {/* The mobile menu trigger is rendered by <Sidebar/>, flush with this bar. */}
      <header className="glass sticky top-0 z-header flex items-center justify-between gap-3 py-3 pr-4 pl-16 sm:pr-6 lg:pl-6">
        <div className="flex min-w-0 items-center gap-3">
          {}
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

      {/* Gradient hairline — brand accent under the sticky bar. */}
      <div aria-hidden className="rule-brand h-px w-full" />

      <main className="flex-1">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
