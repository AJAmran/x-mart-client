import type { Metadata } from "next";
import { LifeBuoy } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Help centre",
  description: "Track a delivery, understand your delivery window, or resolve an issue with an order. Start with the shortcuts below.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "Track your order", href: "/track-order" }}
      description="Track a delivery, understand your delivery window, or resolve an issue with an order. Start with the shortcuts below."
      eyebrow="How can we help?"
      highlights={[
        "Track an order",
        "Returns",
        "Contact"
      ]}
      icon={LifeBuoy}
      title="Help centre"
    />
  );
}