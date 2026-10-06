"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

import { Container } from "@/src/components/UI/Container";
import { Logo } from "@/src/components/UI/Logo";
import BranchSelector from "./BranchSelection";
import CategoriesDropdownClient from "./CategoriesDropdownClient";
import MobileMenu from "./MobileMenu";
import UserActions from "./UserActions";
import { categoriesData } from "@/src/data/CategoriesData";
import { primaryNav } from "@/src/config/navigation";
import { siteConfig } from "@/src/config/site";
import type { IUser } from "@/src/types";

export function NavbarClient({ user }: { user: IUser | null }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Move focus into the drawer when it opens, and trap the escape key.
  // A ref + effect is used instead of `autoFocus` so focus is only moved on a
  // real user action, not on first render.
  useEffect(() => {
    if (!drawerOpen) return;

    mobileSearchRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
   
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const navigateToSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      
      params.set("search", query);
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleDesktopSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const value = new FormData(event.currentTarget).get("q");
      
      navigateToSearch(typeof value === "string" ? value.trim() : "");
    },
    [navigateToSearch]
  );

  return (
    <>
      <header className="sticky top-0 z-header glass border-b border-line-hairline">
        <Container className="flex h-16 items-center gap-3 sm:h-18">
          {/* ---- Brand ---- */}
          <NextLink
            aria-label={`${siteConfig.name} — go to homepage`}
            className="group flex shrink-0 items-center"
            href="/"
          >
            <Logo
              priority
              className="transition-opacity duration-fast group-hover:opacity-80"
              height={38}
            />
          </NextLink>

          {/* ---- Branch selector (desktop) ---- */}
          <div className="ml-2 hidden lg:block">
            <BranchSelector />
          </div>

          {/* ---- Search (desktop) ---- */}
          <form
            className="mx-auto hidden w-full max-w-lg md:block"
            role="search"
            onSubmit={handleDesktopSearch}
          >
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <div className="group relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-subtle transition-colors duration-fast group-focus-within:text-brand"
              />
              <input
                className="h-10 w-full rounded-md border border-line-hairline bg-surface-sunken pl-10 pr-4 text-body-sm text-content placeholder:text-content-subtle transition-colors duration-fast ease-standard hover:border-line-strong focus:border-brand focus:outline-none"
                defaultValue={searchParams.get("search") ?? ""}
                id="site-search"
                name="q"
                placeholder="Search for groceries, kitchenware…"
                type="search"
              />
            </div>
          </form>

          {/* ---- Actions (desktop) ---- */}
          <div className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
            <UserActions user={user} />
          </div>

          {/* ---- Actions (mobile) ---- */}
          <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
            <NextLink
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-sm text-content-muted transition-colors duration-fast hover:bg-surface-sunken hover:text-content"
              href="/shop"
            >
              <Search aria-hidden size={19} />
            </NextLink>
            <UserActions compact user={user} />
            <button
              aria-expanded={drawerOpen}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-sm text-content transition-colors duration-fast hover:bg-surface-sunken"
              type="button"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              {drawerOpen ? (
                <X aria-hidden size={20} />
              ) : (
                <Menu aria-hidden size={20} />
              )}
            </button>
          </div>
        </Container>

        {/* ---- Category bar ---- */}
        <nav
          aria-label="Product categories"
          className="hidden border-t border-line-hairline bg-surface-raised md:block"
        >
          <Container className="flex h-11 items-center gap-1">
            <CategoriesDropdownClient
              buttonText="Shop by category"
              categories={categoriesData}
            />
            <span aria-hidden className="mx-2 h-4 w-px bg-line" />
            {primaryNav.map((item) => {
              const Icon = item.icon;
              
              return (
                <NextLink
                  key={item.href}
                  className="inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-label-sm font-medium text-content-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-content"
                  href={item.href}
                >
                  {Icon && <Icon aria-hidden size={15} />}
                  {item.label}
                </NextLink>
              );
            })}
          </Container>
        </nav>
      </header>

      {/* ---- Mobile drawer ---- */}
      {drawerOpen && (
        <div className="fixed inset-0 top-16 z-overlay md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 top-0 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line-hairline bg-surface-raised px-4 pb-8 pt-5 shadow-xl">
            <form
              className="relative"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                navigateToSearch(mobileQuery.trim());
                setDrawerOpen(false);
              }}
            >
              <label className="sr-only" htmlFor="mobile-search">
                Search products
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-subtle"
              />
              <input
                ref={mobileSearchRef}
                className="h-11 w-full rounded-md border border-line-hairline bg-surface-sunken pl-10 pr-4 text-body-sm text-content placeholder:text-content-subtle focus:border-brand focus:outline-none"
                id="mobile-search"
                placeholder="Search products…"
                type="search"
                value={mobileQuery}
                onChange={(event) => setMobileQuery(event.target.value)}
              />
            </form>

            <div className="mt-5">
              <BranchSelector isMobile />
            </div>

            <MobileMenu
              categories={categoriesData}
              user={user}
              onNavigate={() => setDrawerOpen(false)}
              onSearch={navigateToSearch}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default NavbarClient;