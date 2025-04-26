import { getCurrentUser } from "@/src/services/AuthService";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import { Logo } from "../icons";
import NextLink from "next/link";
import { siteConfig } from "@/src/config/site";
import CategoriesDropdownContainer from "./CategoriesDropdownContainer";
import NavbarClient from "./NavbarClient";


export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <NextUINavbar
      maxWidth="2xl"
      position="sticky"
      className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-sm transition-all duration-300"
      isBordered
      isBlurred
    >
      {/* Brand (Server-side) */}
      <NavbarContent className="sm:flex gap-4" justify="start">
        <NavbarBrand as="li" className="gap-2 max-w-fit">
          <NextLink
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            href="/"
            aria-label="X-mart Home"
          >
            <Logo className="w-8 h-8 text-primary" />
            <p className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              X-mart
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-6 items-center">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md data-[active=true]:text-primary data-[active=true]:font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </li>
          ))}
          <li>
            <CategoriesDropdownContainer />
          </li>
        </ul>
      </NavbarContent>

      {/* Client-side interactive components */}
      <NavbarClient user={user} />
    </NextUINavbar>
  );
}
