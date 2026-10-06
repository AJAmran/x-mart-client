import type { Metadata } from "next";
import { Heart } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Sign in to see the items you have saved, move them into your cart, or get notified when they drop in price.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "Continue shopping", href: "/shop" }}
      description="Sign in to see the items you have saved, move them into your cart, or get notified when they drop in price."
      eyebrow="Saved for later"
      highlights={[
        "Price alerts",
        "One-tap to cart",
        "Saved locally"
      ]}
      icon={Heart}
      title="Your wishlist"
    />
  );
}