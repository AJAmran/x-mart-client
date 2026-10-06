"use client";

import NextLink from "next/link";
import { LogIn } from "lucide-react";

import { CartModal } from "@/src/components/cart/CartModal";
import ProfileModal from "@/src/components/UI/ProfileModal";
import { ThemeSwitch } from "@/src/components/theme-switch";
import { WishlistModal } from "@/src/components/UI/WishlistModal";
import type { IUser } from "@/src/types";

const iconButton =
  "grid size-10 place-items-center rounded-sm text-content-muted transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-content";


export function UserActions({
  user,
  compact = false,
}: {
  user: IUser | null;
  compact?: boolean;
}) {
  if (compact) {
    return user ? (
      <ProfileModal user={user} />
    ) : (
      <NextLink
        aria-label="Sign in"
        className={iconButton}
        href="/auth/login"
      >
        <LogIn aria-hidden size={19} />
      </NextLink>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <WishlistModal />
      <CartModal />

      <span aria-hidden className="mx-1 h-5 w-px bg-line" />

      {user ? (
        <ProfileModal user={user} />
      ) : (
        <NextLink
          className="ml-1 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-label-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
          href="/auth/login"
        >
          <LogIn aria-hidden size={16} />
          Sign in
        </NextLink>
      )}

      <ThemeSwitch />
    </div>
  );
}

export default UserActions;