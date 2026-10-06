import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";
import { siteConfig } from "@/src/config/site";

const blurb = `Seasonal buying guides, recipe ideas and supplier stories from the ${siteConfig.name} editorial desk.`;

export const metadata: Metadata = {
  title: "Blog",
  description: blurb,
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <ComingSoon
      cta={{ label: "Browse the range", href: "/shop" }}
      description={`${blurb} The first issue publishes next month.`}
      eyebrow="Editorial"
      highlights={["Buying guides", "Recipes", "Supplier stories"]}
      icon={Newspaper}
      title={`The ${siteConfig.name} journal`}
    />
  );
}