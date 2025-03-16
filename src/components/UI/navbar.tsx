"use client";

import { useState } from "react";
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
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation"; 

import { Logo } from "../icons";
import { ThemeSwitch } from "../theme-switch";
import CategoriesDropdownContainer from "../navbar/dropdown";
import SearchBar from "../SearchBar";

import { siteConfig } from "@/src/config/site";
import ProfileModal from "./ProfileModal";
import { logout } from "@/src/services/AuthService";
import { useUser } from "@/src/app/context/user.provider";
import { CartModal } from "../cart/CartModal";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); 

  // Use the useUser hook to get the current user and loading state
  const { user, isLoading } = useUser();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  // Handle search submission
  const handleSearch = (query: string) => {
    router.push(`/shop?search=${query}`);
  };

  return (
    <NextUINavbar
      maxWidth="2xl"
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
            onChange={setSearchQuery}
            onSearch={handleSearch} // Pass the search handler
            className="hidden lg:block w-[300px]"
            placeholder="Search in X-mart..."
          />
        </NavbarItem>

        {isLoading ? (
          <NavbarItem>
            <Button isLoading color="primary" variant="flat">
              Loading...
            </Button>
          </NavbarItem>
        ) : user ? (
          <NavbarItem className="relative">
            <ProfileModal user={user} onLogout={handleLogout} />
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href="/auth/login"
              variant="flat"
            >
              Login
            </Button>
          </NavbarItem>
        )}

        <NavbarItem className="relative">
          <CartModal />
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
            onChange={setSearchQuery}
            onSearch={handleSearch} // Pass the search handler
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
                href={item.href}
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
