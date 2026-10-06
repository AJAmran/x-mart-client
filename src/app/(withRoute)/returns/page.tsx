import type { Metadata } from "next";
import { RotateCcw } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Returns and refunds",
  description: "Not right? Most items can be returned within 30 days of delivery, unopened. Perishables and personal care items are non-returnable for safety reasons.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "Start a return", href: "/orders" }}
      description="Not right? Most items can be returned within 30 days of delivery, unopened. Perishables and personal care items are non-returnable for safety reasons."
      eyebrow="30-day returns"
      highlights={[
        "30-day window",
        "Refund timing",
        "Exclusions"
      ]}
      icon={RotateCcw}
      title="Returns and refunds"
    />
  );
}