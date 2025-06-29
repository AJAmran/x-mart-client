"use client";

import React, { useState, useCallback } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { Logo } from "../icons";
import {
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  StoreIcon,
  ChevronDownIcon,
} from "lucide-react";
import SearchBar from "../SearchBar";
import { CartModal } from "../cart/CartModal";
import { ThemeSwitch } from "../theme-switch";
import CategoriesDropdownClient from "./CategoriesDropdownClient";
import { categoriesData } from "@/src/data/CategoriestData";
import { logout } from "@/src/services/AuthService";
import { useRouter, usePathname } from "next/navigation";
import { IUser } from "@/src/types";
import ProfileModal from "../UI/ProfileModal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";

interface NavbarClientProps {
  user: IUser | null;
}

const areas = [
  {
    label: "Dhaka",
    value: "dhaka",
    branches: [
      { label: "Uttara", value: "uttara" },
      { label: "Dhanmondi", value: "dhanmondi" },
    ],
  },
  {
    label: "Chittagong",
    value: "chittagong",
    branches: [
      { label: "Agrabad", value: "agrabad" },
      { label: "Nasirabad", value: "nasirabad" },
    ],
  },
];

export default function NavbarClient({ user }: NavbarClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = useCallback(
    (query: string) => {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setSearchQuery(query);
    },
    [router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    router.push(`/shop?area=${area}`);
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Top Navigation Section */}
      <div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <NextUINavbar
          maxWidth="2xl"
          className="bg-white dark:bg-gray-900"
          isBordered
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent
            className="flex items-center justify-between w-full py-2"
            justify="center"
          >
            {/* Left: Logo and Select Area */}
            <NavbarContent className="flex items-center gap-4" justify="start">
              <NavbarBrand as="li" className="gap-3">
                <NextLink
                  className="flex items-center gap-2"
                  href="/"
                  aria-label="X-mart Home"
                >
                  <Logo className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  <p className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                    X-mart
                  </p>
                </NextLink>
              </NavbarBrand>
              <NavbarItem className="hidden sm:flex">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 rounded-full px-4 py-2"
                      endContent={<ChevronDownIcon className="w-4 h-4" />}
                      startContent={<MapPinIcon className="w-5 h-5" />}
                    >
                      {selectedArea
                        ? areas.flatMap(
                            (area) =>
                              area.branches.find(
                                (b) => b.value === selectedArea
                              )?.label || "Select Area"
                          )
                        : "Select Area"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Area selection"
                    className="w-64 max-h-96 overflow-y-auto"
                  >
                    {areas.map((area) => (
                      <DropdownItem
                        key={area.value}
                        textValue={area.label}
                        className="group"
                      >
                        <div className="py-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                            {area.label}
                          </p>
                          <div className="space-y-1">
                            {area.branches.map((branch) => (
                              <Button
                                key={branch.value}
                                variant="light"
                                className={`w-full text-left text-sm font-medium rounded-lg py-1 px-2 ${
                                  selectedArea === branch.value
                                    ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/10"
                                }`}
                                onClick={() => handleAreaSelect(branch.value)}
                              >
                                {branch.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>

            {/* Middle: Search Bar */}
            <NavbarContent
              className="hidden md:flex flex-1 max-w-lg"
              justify="center"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                className="w-full"
                placeholder="Search products..."
                aria-label="Search products"
              />
            </NavbarContent>

            {/* Right: Sign In, Wishlist, Cart, Theme Switch */}
            <NavbarContent
              className="flex items-center gap-2 sm:gap-3"
              justify="end"
            >
              <NavbarItem className="hidden lg:flex">
                {user ? (
                  <ProfileModal user={user} />
                ) : (
                  <Button
                    as={Link}
                    href="/auth/login"
                    variant="flat"
                    color="primary"
                    className="flex items-center gap-2 text-sm font-semibold"
                    aria-label="Sign In"
                  >
                    <UserIcon className="w-5 h-5" />
                    Sign In
                  </Button>
                )}
              </NavbarItem>
              <NavbarItem className="hidden sm:flex">
                <Button
                  as={Link}
                  href="/wishlist"
                  variant="light"
                  className="flex items-center gap-2 text-sm font-semibold"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="hidden lg:inline">Wishlist</span>
                </Button>
              </NavbarItem>
              <NavbarItem>
                <CartModal />
              </NavbarItem>
              <NavbarItem className="hidden sm:flex">
                <ThemeSwitch />
              </NavbarItem>
              <NavbarItem className="sm:hidden">
                <NavbarMenuToggle
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="text-gray-900 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                />
              </NavbarItem>
            </NavbarContent>
          </NavbarContent>

          {/* Mobile Menu */}
          <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pt-6 pb-12">
            <div className="p-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                className="w-full mb-4"
                placeholder="Search products..."
                aria-label="Search products"
              />
            </div>
            <div className="mx-4 flex flex-col gap-4">
              {/* Mobile Area Selection */}
              <div className="mb-4">
                <Select
                  label="Select Your Area"
                  size="sm"
                  startContent={<MapPinIcon className="w-5 h-5" />}
                  value={selectedArea}
                  onChange={(e) => handleAreaSelect(e.target.value)}
                >
                  {areas.map((area) => (
                    <SelectItem
                      key={area.value}
                      textValue={area.label}
                      className="group"
                    >
                      <div className="py-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                          {area.label}
                        </p>
                        <div className="space-y-1">
                          {area.branches.map((branch) => (
                            <SelectItem
                              key={branch.value}
                              value={branch.value}
                              className="text-sm"
                            >
                              {branch.label}
                            </SelectItem>
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <CategoriesDropdownClient
                categories={categoriesData}
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
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <Button
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
                </Button>
              )}
              <div className="flex items-center gap-3 w-full py-3">
                <ThemeSwitch />
              </div>
            </div>
          </NavbarMenu>
        </NextUINavbar>
      </div>

      {/* Main Navigation Section with Blue Gradient */}
      <div className="sticky top-[73px] z-50 bg-blue-500 shadow-sm hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-6 sm:gap-8">
              <CategoriesDropdownClient
                categories={categoriesData}
                buttonText="Shop by Category"
              />
              <NextLink
                href="/track-order"
                className="text-sm font-semibold text-white hover:text-blue-200"
              >
                Track Order
              </NextLink>
              <NextLink
                href="/deals"
                className="text-sm font-semibold text-white hover:text-blue-200"
              >
                Great Deals
              </NextLink>
            </div>
            <div className="hidden lg:flex items-center gap-6 sm:gap-8">
              <NextLink
                href="/outlets"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-200"
              >
                <StoreIcon className="w-5 h-5" />
                Our Outlets
              </NextLink>
              <NextLink
                href="/helpline"
                className="flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-200"
              >
                <PhoneIcon className="w-5 h-5" />
                Helpline
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
