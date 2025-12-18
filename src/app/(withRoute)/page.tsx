import { Suspense } from "react";
import { Metadata } from "next";

import Categories from "@/src/components/homepageComponent/Categories";
import HeroSkeleton from "@/src/components/homepageComponent/HeroSkeleton";
import CategoriesSkeleton from "@/src/components/homepageComponent/CategoriesSkeleton";
import FeatureProduct from "@/src/components/homepageComponent/FeatureProducts";
import FeatureProductSkeleton from "@/src/components/homepageComponent/FeatureProductSkeleton";
import HeroSection from "@/src/components/heroSection/HeroSection";
import CategoriesShowcase from "@/src/components/categories/CategoriesShowcase";
import { siteConfig } from "@/src/config/site";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Your One-Stop Shop for Groceries & More",
  description:
    "Discover fresh produce, trendy kitchen gadgets, and exclusive deals at X-mart. Shop now and enjoy free shipping on select items!",
  openGraph: {
    title: "X-mart | Your One-Stop Shop",
    description:
      "Explore a wide range of groceries, household items, and more with X-mart.",
    images: [siteConfig.ogImage],
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <h1 className="sr-only">X-mart - Fresh Groceries, Premium Kitchenware & Daily Essentials</h1>

      {/* Hero Section with Suspense */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Categories Section with Suspense */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>

      {/* Featured Products Section with Suspense */}
      <Suspense fallback={<FeatureProductSkeleton />}>
        <FeatureProduct />
      </Suspense>
      <Suspense fallback={<FeatureProductSkeleton />}>
        <CategoriesShowcase />
      </Suspense>
    </main>
  );
}
