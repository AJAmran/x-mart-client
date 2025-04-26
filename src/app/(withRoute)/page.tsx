import { Suspense } from "react";
import { Metadata } from "next";
import HeroSection from "@/src/components/homepageComponent/HeroSection";
import Categories from "@/src/components/homepageComponent/Categories";
import HeroSkeleton from "@/src/components/homepageComponent/HeroSkeleton";
import CategoriesSkeleton from "@/src/components/homepageComponent/CategoriesSkeleton";
import FeatureProduct from "@/src/components/homepageComponent/FeatureProducts";
import FeatureProductSkeleton from "@/src/components/homepageComponent/FeatureProductSkeleton";


// Metadata for SEO
export const metadata: Metadata = {
  title: "X-mart | Your One-Stop Shop for Groceries & More",
  description: "Discover fresh produce, trendy kitchen gadgets, and exclusive deals at X-mart. Shop now and enjoy free shipping on select items!",
  openGraph: {
    title: "X-mart | Your One-Stop Shop",
    description: "Explore a wide range of groceries, household items, and more with X-mart.",
    images: ["https://i.ibb.co.com/kMQpNqy/Smart-Blender.jpg"],
    url: "https://your-site.com",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
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
    </main>
  );
}