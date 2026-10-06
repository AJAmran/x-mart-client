import type { Metadata } from "next";
import { Truck } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Shipping and delivery",
  description: "We deliver seven days a week. Orders placed before 4pm inside Dhaka are usually same-day; everywhere else lands the next day.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "Track a delivery", href: "/track-order" }}
      description="We deliver seven days a week. Orders placed before 4pm inside Dhaka are usually same-day; everywhere else lands the next day."
      eyebrow="Same-day and next-day"
      highlights={[
        "Same-day slots",
        "Nationwide",
        "Free over Tk 999"
      ]}
      icon={Truck}
      title="Shipping and delivery"
    />
  );
}