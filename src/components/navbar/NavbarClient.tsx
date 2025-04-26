"use client";

import { useState, useCallback } from "react";
import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeSwitch } from "../theme-switch";
import SearchBar from "../SearchBar";

import { CartModal } from "../cart/CartModal";
import { logout } from "@/src/services/AuthService";
import { siteConfig } from "@/src/config/site";
import { ShoppingBagIcon } from "lucide-react";
import { IUser } from "@/src/types";
import ProfileModal from "../UI/ProfileModal";

interface NavbarClientProps {
  user: IUser | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setSearchQuery(query);
    },
    [router]
  );

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, delay: index * 0.1 },
    }),
  };

  return (
    <>
      {/* Desktop Actions (Right Side) */}
      <NavbarContent className="hidden lg:flex gap-3" justify="end">
        <NavbarItem>
          <SearchBar
            className="w-[240px]"
            placeholder="Search products..."
            onChange={setSearchQuery}
            onSearch={handleSearch}
            value={searchQuery}
            aria-label="Search products"
          />
        </NavbarItem>
        {user ? (
          <>
            <NavbarItem>
              <NextLink
                className="flex items-center gap-1 relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary rounded-md data-[active=true]:text-primary data-[active=true]:font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all hover:after:w-full"
                href="/orders"
                aria-current={pathname === "/orders" ? "page" : undefined}
              >
                <ShoppingBagIcon className="w-5 h-5" aria-hidden="true" />
                Orders
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <ProfileModal user={user} />
            </NavbarItem>
            {user.role === "ADMIN" && (
              <NavbarItem>
                <Button
                  as={NextLink}
                  href="/dashboard"
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="font-medium px-4"
                  aria-label="Admin Dashboard"
                >
                  Dashboard
                </Button>
              </NavbarItem>
            )}
          </>
        ) : (
          <>
            <NavbarItem>
              <Button
                as={Link}
                href="/auth/login"
                color="primary"
                variant="flat"
                size="sm"
                className="font-medium px-4"
                aria-label="Login"
              >
                Login
              </Button>
            </NavbarItem>
          </>
        )}
        <NavbarItem>
          <CartModal />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Actions (Right Side) */}
      <NavbarContent className="flex lg:hidden gap-2" justify="end">
        {user ? (
          <NavbarItem>
            <ProfileModal user={user} />
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              href="/auth/login"
              color="primary"
              variant="flat"
              size="sm"
              className="font-medium"
              aria-label="Login"
            >
              Login
            </Button>
          </NavbarItem>
        )}
        <NavbarItem>
          <CartModal />
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-gray-900 dark:text-white"
          onChange={() => setIsMenuOpen(!isMenuOpen)}
        />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg pt-4">
        <div className="p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            className="w-full"
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
        <div className="mx-4 mt-2 flex flex-col gap-3">
          {siteConfig.navMenuItems
            .filter((item) => item.label !== "Orders" || user)
            .map((item, index) => (
              <NavbarItem key={`${item.label}-${index}`}>
                <motion.div
                  custom={index}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    as={NextLink}
                    href={item.href}
                    size="lg"
                    className={`flex items-center gap-2 w-full py-2 text-base font-medium rounded-md transition-colors ${
                      item.label === "Logout"
                        ? "text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20"
                        : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={item.label === "Logout" ? handleLogout : undefined}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label === "Orders" && (
                      <ShoppingBagIcon className="w-5 h-5" aria-hidden="true" />
                    )}
                    {item.label}
                  </Link>
                </motion.div>
              </NavbarItem>
            ))}
          {user && user.role === "ADMIN" && (
            <NavbarItem>
              <motion.div
                custom={siteConfig.navMenuItems.length}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  as={NextLink}
                  href="/dashboard"
                  size="lg"
                  className="block w-full py-2 text-base font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  aria-current={pathname === "/dashboard" ? "page" : undefined}
                >
                  Dashboard
                </Link>
              </motion.div>
            </NavbarItem>
          )}
        </div>
      </NavbarMenu>
    </>
  );
}