"use client"

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { CartIcon, Logo, SearchIcon } from "../icons";
import { ThemeSwitch } from "../theme-switch";
import CategoriesDropdownContainer from "../navbar/dropdown";

import { siteConfig } from "@/src/config/site";
import { useState } from "react";
import SearchBar from "../SearchBar";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query); // Replace with actual search functionality
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      className="border-b dark:border-gray-900"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">X-mart</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2 items-center">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item?.href}
              >
                {item?.label}
              </NextLink>
            </NavbarItem>
          ))}
          <NavbarItem>
            <CategoriesDropdownContainer />
          </NavbarItem>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            className="hidden lg:block w-[300px]"
            placeholder="Search in X-mart..."
          />
        </NavbarItem>

        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href="/profile"
            variant="flat"
          >
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem className="relative">
          <CartIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
            4
          </span>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarItem>
            <CategoriesDropdownContainer />
          </NavbarItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
