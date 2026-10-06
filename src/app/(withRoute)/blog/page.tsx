import type { Metadata } from "next";
import { Newspaper } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Seasonal buying guides, recipe ideas and supplier stories from the X-mart editorial desk.",
  robots: { index: false, follow: true },
};

export default function BlogPage() {
  return (
    <ComingSoon
      cta={{ label: "Browse the range", href: "/shop" }}
      description="Seasonal buying guides, recipe ideas and supplier stories from the X-mart editorial desk. The first issue publishes next month."
      eyebrow="Editorial"
      highlights={["Buying guides", "Recipes", "Supplier stories"]}
      icon={Newspaper}
      title="The X-mart journal"
    />
  );
}