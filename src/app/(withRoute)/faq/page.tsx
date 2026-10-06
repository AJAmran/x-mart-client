import type { Metadata } from "next";
import { CircleHelp } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Delivery windows, payment methods, returns and substitutions - the questions we get asked most, answered plainly.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "Visit help centre", href: "/help" }}
      description="Delivery windows, payment methods, returns and substitutions - the questions we get asked most, answered plainly."
      eyebrow="Answers, not hold music"
      highlights={[
        "Delivery and slots",
        "Payments",
        "Returns"
      ]}
      icon={CircleHelp}
      title="Frequently asked questions"
    />
  );
}