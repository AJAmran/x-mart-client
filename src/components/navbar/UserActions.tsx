// components/UI/UserActions.tsx
"use client";

import React, { useCallback } from "react";
import { NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { MyButton } from "../UI/MyButton";
import { UserIcon } from "lucide-react";
import { ThemeSwitch } from "../theme-switch";
import { CartModal } from "../cart/CartModal";
import ProfileModal from "../UI/ProfileModal";
import { logout } from "@/src/services/AuthService";
import { useRouter } from "next/navigation";
import { IUser } from "@/src/types";
import { WishlistModal } from "../UI/WishlistModal";

interface UserActionsProps {
  user: IUser | null;
}

export default function UserActions({ user }: UserActionsProps) {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <>
      {/* Wishlist Modal */}
      <NavbarItem className="hidden sm:flex">
        <WishlistModal />
      </NavbarItem>

      {/* Cart Modal */}
      <NavbarItem>
        <CartModal />
      </NavbarItem>

      {/* User Profile / Login */}
      <NavbarItem className="hidden lg:flex">
        {user ? (
          <ProfileModal user={user} />
        ) : (
          <MyButton
            as={Link}
            href="/auth/login"
            variant="flat"
            color="primary"
            className="flex items-center gap-2 text-sm font-semibold"
            aria-label="Sign In"
          >
            <UserIcon className="w-5 h-5" />
            Sign In
          </MyButton>
        )}
      </NavbarItem>

      {/* Theme Switch */}
      <NavbarItem className="hidden sm:flex">
        <ThemeSwitch />
      </NavbarItem>
    </>
  );
}
