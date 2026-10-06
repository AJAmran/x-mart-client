import { Suspense } from "react";
import type { Metadata } from "next";

import Categories from "@/src/components/homepageComponent/Categories";
import CategoriesSkeleton from "@/src/components/homepageComponent/CategoriesSkeleton";
import CategoriesShowcase from "@/src/components/categories/CategoriesShowcase";
import FeatureProduct from "@/src/components/homepageComponent/FeatureProducts";
import FeatureProductSkeleton from "@/src/components/homepageComponent/FeatureProductSkeleton";
import HeroSection from "@/src/components/heroSection/HeroSection";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description:
    "Fresh produce, pantry staples, kitchenware and daily essentials in one basket. Same-day delivery inside Dhaka, free over Tk 999, secure SSLCommerz checkout.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Fresh produce, pantry staples and daily essentials with same-day delivery.",
    images: [siteConfig.ogImage],
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <>
      {/* The hero is above the fold, so it is not wrapped in Suspense — a
          skeleton flash there would be worse than waiting. */}
      <HeroSection />
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<FeatureProductSkeleton />}>
        <FeatureProduct />
      </Suspense>
      <Suspense fallback={<FeatureProductSkeleton />}>
        <CategoriesShowcase />
      </Suspense>
    </>
  );
}