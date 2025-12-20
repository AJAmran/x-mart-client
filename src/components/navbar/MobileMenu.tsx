"use client";

import React from "react";
import { NavbarMenu } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  StoreIcon,
  PhoneIcon,
} from "lucide-react";
import { MyButton } from "../UI/MyButton";
import CategoriesDropdownClient from "./CategoriesDropdownClient";

import SearchBar from "../SearchBar";
import { ThemeSwitch } from "../theme-switch";
import { IUser } from "@/src/types";

import BranchSelector from "./BranchSelection";
import { Category } from "@/src/data/CategoriesData";

interface MobileMenuProps {
  user: IUser | null;
  categories: Category[];
  onSearch: (query: string) => void;
}

export default function MobileMenu({
  user,
  categories,
  onSearch,
}: MobileMenuProps) {
  return (
    <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pt-6 pb-12">
      <div className="p-4">
        <SearchBar
          className="w-full mb-4"
          debounceDelay={300}
          placeholder="Search products..."
          value=""
          onChange={() => { }}
          onSearch={onSearch}
        />
      </div>
      <div className="mx-4 flex flex-col gap-4">
        <BranchSelector isMobile={true} />
        <CategoriesDropdownClient
          buttonText="Shop by Category"
          categories={categories}
        />
        <Link
          as={NextLink}
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
          href="/track-order"
          size="lg"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Track Order
        </Link>
        <Link
          as={NextLink}
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
          href="/deals"
          size="lg"
        >
          Great Deals
        </Link>
        <Link
          as={NextLink}
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
          href="/outlets"
          size="lg"
        >
          <StoreIcon className="w-5 h-5" />
          Our Outlets
        </Link>
        <Link
          as={NextLink}
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
          href="/helpline"
          size="lg"
        >
          <PhoneIcon className="w-5 h-5" />
          Helpline
        </Link>
        {user ? (
          <>
            <Link
              as={NextLink}
              className="flex items-center gap-3 w-full py-3 text-base font-semibold"
              href="/orders"
              size="lg"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Orders
            </Link>
            <Link
              as={NextLink}
              className="flex items-center gap-3 w-full py-3 text-base font-semibold"
              href="/wishlist"
              size="lg"
            >
              <HeartIcon className="w-5 h-5" />
              Wishlist
            </Link>
            {user.role === "ADMIN" && (
              <Link
                as={NextLink}
                className="flex items-center gap-3 w-full py-3 text-base font-semibold"
                href="/dashboard"
                size="lg"
              >
                Dashboard
              </Link>
            )}
            <Link
              as={NextLink}
              className="flex items-center gap-3 w-full py-3 text-base font-semibold text-danger"
              href="#"
              size="lg"
              onClick={async () => {
                try {
                  await import("@/src/services/AuthService").then((module) =>
                    module.logout()
                  );
                  window.location.href = "/auth/login";
                } catch {
                  // Ignore logout errors
                }
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <MyButton
            aria-label="Sign In"
            as={Link}
            className="flex items-center gap-3 w-full py-3 text-base font-semibold"
            color="primary"
            href="/auth/login"
            size="lg"
            variant="flat"
          >
            <UserIcon className="w-5 h-5" />
            Sign In
          </MyButton>
        )}
        <div className="flex items-center gap-3 w-full py-3">
          <ThemeSwitch />
        </div>
      </div>
    </NavbarMenu>
  );
}
