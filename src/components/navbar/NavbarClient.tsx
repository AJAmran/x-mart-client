"use client";

import React, { useState, useCallback } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import { Logo } from "../icons";
import { useRouter, useSearchParams } from "next/navigation";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";
import MainNavigation from "./MainNavigation";
import { IUser } from "@/src/types";
import { categoriesData } from "@/src/data/CategoriesData";
import SearchBar from "../SearchBar";
import BranchSelector from "./BranchSelection";

interface NavbarClientProps {
  user: IUser | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("search", query);
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="sticky top-0 z-50 w-full">
      <NextUINavbar
        isBordered
        className="bg-white dark:bg-gray-900"
        isMenuOpen={isMenuOpen}
        maxWidth="2xl"
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent
          className="flex items-center justify-between w-full py-2"
          justify="center"
        >
          <NavbarBrand as="li" className="gap-3">
            <NextLink
              aria-label="X-mart Home"
              className="flex items-center gap-2"
              href="/"
            >
              <Logo className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              <p className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                X-mart
              </p>
            </NextLink>
          </NavbarBrand>

          <NavbarContent className="hidden sm:flex">
            <BranchSelector />
          </NavbarContent>

          <SearchBar
            className="hidden sm:block w-96"
            debounceDelay={300}
            placeholder="Search products..."
            value={searchParams.get("search") || ""}
            onChange={() => {}}
            onSearch={handleSearch}
          />

          <NavbarContent
            className="flex items-center gap-2 sm:gap-3"
            justify="end"
          >
            <UserActions user={user} />
            <NavbarMenuToggle
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="sm:hidden text-gray-900 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            />
          </NavbarContent>
        </NavbarContent>

        <MobileMenu
          categories={categoriesData}
          user={user}
          onSearch={handleSearch}
        />
      </NextUINavbar>

      <MainNavigation categories={categoriesData} />
    </div>
  );
}
