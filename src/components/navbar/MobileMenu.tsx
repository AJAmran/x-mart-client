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
import { Category } from "@/src/data/CategoriestData";

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
          placeholder="Search products..."
          onSearch={onSearch}
          className="w-full mb-4"
          debounceDelay={300}
          onChange={() => {}}
          value=""
        />
      </div>
      <div className="mx-4 flex flex-col gap-4">
        <BranchSelector isMobile = {true}/>
        <CategoriesDropdownClient
          categories={categories}
          buttonText="Shop by Category"
        />
        <Link
          as={NextLink}
          href="/track-order"
          size="lg"
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Track Order
        </Link>
        <Link
          as={NextLink}
          href="/deals"
          size="lg"
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
        >
          Great Deals
        </Link>
        <Link
          as={NextLink}
          href="/outlets"
          size="lg"
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
        >
          <StoreIcon className="w-5 h-5" />
          Our Outlets
        </Link>
        <Link
          as={NextLink}
          href="/helpline"
          size="lg"
          className="flex items-center gap-3 w-full py-3 text-base font-semibold"
        >
          <PhoneIcon className="w-5 h-5" />
          Helpline
        </Link>
        {user ? (
          <>
            <Link
              as={NextLink}
              href="/orders"
              size="lg"
              className="flex items-center gap-3 w-full py-3 text-base font-semibold"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Orders
            </Link>
            <Link
              as={NextLink}
              href="/wishlist"
              size="lg"
              className="flex items-center gap-3 w-full py-3 text-base font-semibold"
            >
              <HeartIcon className="w-5 h-5" />
              Wishlist
            </Link>
            {user.role === "ADMIN" && (
              <Link
                as={NextLink}
                href="/dashboard"
                size="lg"
                className="flex items-center gap-3 w-full py-3 text-base font-semibold"
              >
                Dashboard
              </Link>
            )}
            <Link
              as={NextLink}
              href="#"
              size="lg"
              className="flex items-center gap-3 w-full py-3 text-base font-semibold text-danger"
              onClick={async () => {
                try {
                  await import("@/src/services/AuthService").then((module) =>
                    module.logout()
                  );
                  window.location.href = "/auth/login";
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <MyButton
            as={Link}
            href="/auth/login"
            color="primary"
            variant="flat"
            size="lg"
            className="flex items-center gap-3 w-full py-3 text-base font-semibold"
            aria-label="Sign In"
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
