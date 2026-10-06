"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";

import CategoriesDropdownClient from "./CategoriesDropdownClient";
import { accountNav, primaryNav } from "@/src/config/navigation";
import { logout } from "@/src/services/AuthService";
import { ThemeSwitch } from "@/src/components/theme-switch";
import type { Category } from "@/src/data/CategoriesData";
import type { IUser } from "@/src/types";

type MobileMenuProps = {
  user: IUser | null;
  categories: Category[];
  onSearch: (query: string) => void;
  /** Called after any navigation so the parent can close the drawer. */
  onNavigate?: () => void;
};

const rowBase =
  "flex items-center gap-3 rounded-sm px-3 py-3 text-body-sm font-medium text-content-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-content";

/**
 * Drawer navigation. Links come from the shared navigation config so this
 * menu can never drift out of sync with the desktop header or the footer.
 */
export function MobileMenu({
  user,
  categories,
  onNavigate,
}: MobileMenuProps) {
  const router = useRouter();

  return (
    <nav aria-label="Mobile" className="mt-5 flex flex-col gap-1">
      <p className="px-3 pb-1 pt-2 text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
        Browse
      </p>
      {primaryNav.map((item) => {
        const Icon = item.icon;

        return (
          <NextLink
            key={item.href}
            className={rowBase}
            href={item.href}
            onClick={onNavigate}
          >
            {Icon && <Icon aria-hidden className="size-4.5 shrink-0" size={18} />}
            {item.label}
          </NextLink>
        );
      })}

      <div className="mt-4">
        <CategoriesDropdownClient
          buttonText="Shop by category"
          categories={categories}
        />
      </div>

      {user && (
        <>
          <p className="mt-6 px-3 pb-1 text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
            My account
          </p>
          {accountNav.map((item) => {
            const Icon = item.icon;

            return (
              <NextLink
                key={item.href}
                className={rowBase}
                href={item.href}
                onClick={onNavigate}
              >
                {Icon && <Icon aria-hidden className="shrink-0" size={18} />}
                {item.label}
              </NextLink>
            );
          })}

          {user.role === "ADMIN" && (
            <NextLink
              className={rowBase}
              href="/dashboard"
              onClick={onNavigate}
            >
              <LogIn aria-hidden className="shrink-0" size={18} />
              Admin dashboard
            </NextLink>
          )}

          <button
            className={`${rowBase} text-danger hover:bg-danger/10 hover:text-danger`}
            type="button"
            onClick={() => {
              onNavigate?.();
              logout();
              router.push("/auth/login");
            }}
          >
            <LogOut aria-hidden className="shrink-0" size={18} />
            Sign out
          </button>
        </>
      )}

      <div className="mt-6 flex items-center justify-between rounded-sm border border-line-hairline bg-surface-sunken px-3 py-2.5">
        <span className="text-label-sm font-medium text-content">
          Appearance
        </span>
        <ThemeSwitch showLabel={false} />
      </div>
    </nav>
  );
}

export default MobileMenu;