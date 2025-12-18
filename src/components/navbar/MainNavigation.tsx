"use client";

import React from "react";
import NextLink from "next/link";
import { StoreIcon, PhoneIcon } from "lucide-react";
import CategoriesDropdownClient from "./CategoriesDropdownClient";
import { Category } from "@/src/data/CategoriesData";
import { usePathname } from "next/navigation";

interface MainNavigationProps {
  categories: Category[];
}

export default function MainNavigation({ categories }: MainNavigationProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-[73px] z-50 bg-primary shadow-sm hidden md:block text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-6 sm:gap-8">
            <CategoriesDropdownClient categories={categories} buttonText="Shop by Category" />
            <NextLink
              href="/shop"
              className={`text-sm font-semibold transition-colors ${isActive("/shop") ? "text-white underline underline-offset-4" : "hover:text-white/80"}`}
            >
              Shop
            </NextLink>
            <NextLink
              href="/track-order"
              className={`text-sm font-semibold transition-colors ${isActive("/track-order") ? "text-white underline underline-offset-4" : "hover:text-white/80"}`}
            >
              Track Order
            </NextLink>
            <NextLink
              href="/deals"
              className={`text-sm font-semibold transition-colors ${isActive("/deals") ? "text-white underline underline-offset-4" : "hover:text-white/80"}`}
            >
              Great Deals
            </NextLink>
          </div>
          <div className="hidden lg:flex items-center gap-6 sm:gap-8">
            <NextLink
              href="/outlets"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive("/outlets") ? "text-white underline underline-offset-4" : "hover:text-white/80"}`}
            >
              <StoreIcon className="w-5 h-5" />
              Our Outlets
            </NextLink>
            <NextLink
              href="/help"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${isActive("/help") ? "text-white underline underline-offset-4" : "hover:text-white/80"}`}
            >
              <PhoneIcon className="w-5 h-5" />
              Helpline
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
