import type { Metadata } from "next";
import { Clock, Globe, MapPin, Phone } from "lucide-react";

import { Container } from "@/src/components/UI/Container";
import OutletsBrowser from "@/src/components/outlets/OutletsBrowser";
import { getAllBranches } from "@/src/services/BranchService";
import type { TBranch } from "@/src/interface/branch";
import { siteConfig } from "@/src/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Outlets",
  description: `Find your nearest ${siteConfig.name} outlet. Every location lists its address, opening hours and a direct link to turn-by-turn directions.`,
};

const promises = [
  {
    icon: MapPin,
    title: "Conveniently located",
    detail: "In neighbourhood commercial centres, not industrial estates",
  },
  {
    icon: Clock,
    title: "Open late",
    detail: "Most outlets trade until 10pm, seven days a week",
  },
  {
    icon: Phone,
    title: "Call ahead",
    detail: "Each outlet has its own line for bulk and pre-orders",
  },
  {
    icon: Globe,
    title: "One standard",
    detail: "Same sourcing, same pricing, whichever branch you visit",
  },
];

export default async function OutletsPage() {
  let outlets: TBranch[] = [];

  try {
    // Deliberately not filtering by `status` here. Records seeded before the
    // enum was lowercased store "ACTIVE", so a `?status=active` filter matches
    // nothing and the page silently renders empty. `OutletsBrowser` does the
    // active check case-insensitively instead.
    const response = await getAllBranches({}, { limit: 50 });

    outlets = response.data || [];
  } catch (error) {
    /* eslint-disable no-console */
    console.error("Error fetching outlets:", error);
  }

  return (
    <>
      {/* ---- Intro ---- */}
      <Container className="pt-12 sm:pt-16">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-overline font-semibold uppercase tracking-[0.14em] text-brand">
            <span aria-hidden className="h-px w-6 bg-brand/50" />
            In store
          </p>
          <h1 className="text-display-md font-bold text-content">Our outlets</h1>
          <p className="mt-4 text-body-lg text-content-muted">
            {outlets.length > 0
              ? `${outlets.length} locations across Bangladesh. Search by city or area, then get turn-by-turn directions straight to the door.`
              : "Our outlet directory is being updated. Please check back shortly."}
          </p>
        </div>
      </Container>

      {/* ---- Promise strip ---- */}
      <Container className="mt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-line-hairline bg-surface-raised p-5 shadow-xs"
            >
              <span className="grid size-10 place-items-center rounded-sm bg-brand-subtle text-brand">
                <item.icon aria-hidden size={18} />
              </span>
              <p className="mt-4 text-body-sm font-semibold text-content">
                {item.title}
              </p>
              <p className="mt-1 text-label-sm leading-relaxed text-content-subtle">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>

      {/* ---- Directory ---- */}
      <Container className="py-12 sm:py-16">
        <h2 className="text-display-sm font-bold text-content">
          Find your nearest outlet
        </h2>
        <p className="mt-2 max-w-prose text-body-sm text-content-muted">
          Results update as you type and reflect each outlet&apos;s published
          trading hours.
        </p>

        <div className="mt-8">
          <OutletsBrowser outlets={outlets} />
        </div>
      </Container>
    </>
  );
}