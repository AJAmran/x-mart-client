import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { ComingSoon } from "@/src/components/UI/ComingSoon";

export const metadata: Metadata = {
  title: "Careers",
  description: "We are hiring across engineering, merchandising and retail operations. Openings are posted here first, before they go public.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <ComingSoon
      cta={{ label: "See open roles", href: "/contact" }}
      description="We are hiring across engineering, merchandising and retail operations. Openings are posted here first, before they go public."
      eyebrow="We are building the team"
      highlights={[
        "Engineering",
        "Retail operations",
        "Merchandising"
      ]}
      icon={Briefcase}
      title="Careers"
    />
  );
}