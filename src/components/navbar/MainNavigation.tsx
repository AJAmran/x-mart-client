"use client";

import React from "react";
import NextLink from "next/link";
import { StoreIcon, PhoneIcon } from "lucide-react";
import CategoriesDropdownClient from "./CategoriesDropdownClient";
import { Category } from "@/src/data/CategoriestData";


interface MainNavigationProps {
  categories: Category[];
}

export default function MainNavigation({ categories }: MainNavigationProps) {
  return (
    <div className="sticky top-[73px] z-50 bg-blue-500 shadow-sm hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-6 sm:gap-8">
            <CategoriesDropdownClient categories={categories} buttonText="Shop by Category" />
            <NextLink
              href="/shop"
              className="text-sm font-semibold text-white hover:text-blue-200"
            >
              Shop
            </NextLink>
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
  );
}