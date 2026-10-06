"use client";

import Image from "next/image";
import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";

import {
  directionsHref,
  isOpenNow,
  scheduleSummary,
  statusLine,
} from "@/src/lib/branchHours";
import { isBranchStatus, type TBranch } from "@/src/interface/branch";

const facilityLabels: { key: keyof NonNullable<TBranch["facilities"]>; label: string }[] = [
  { key: "parking", label: "Parking" },
  { key: "delivery", label: "Delivery" },
  { key: "pickup", label: "Click & collect" },
  { key: "atm", label: "ATM" },
];

export function OutletCard({ outlet }: { outlet: TBranch }) {
  const open = isOpenNow(outlet);
  const active = isBranchStatus(outlet.status, "active");
  const facilities = facilityLabels.filter(
    ({ key }) => outlet.facilities?.[key]
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xs transition-all duration-base ease-standard hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg">
      {/* ---- Media ---- */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunken">
        <Image
          alt={outlet.name}
          className="object-cover transition-transform duration-slower ease-entrance hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={outlet.images?.[0] || "/placeholder.jpg"}
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
          {!active ? (
            <span className="bg-surface-inverse/85 text-content-inverted">
              Temporarily closed
            </span>
          ) : open ? (
            <span className="bg-success/90 text-white">
              <span aria-hidden className="size-1.5 rounded-full bg-white" />
              Open now
            </span>
          ) : (
            <span className="bg-surface-inverse/85 text-content-inverted">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              Closed
            </span>
          )}
        </span>
      </div>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-title-md font-semibold text-content">{outlet.name}</h3>
          <p className="tabular mt-0.5 text-label-sm text-content-subtle">
            {outlet.code}
            {outlet.type && (
              <span className="ml-2 capitalize text-content-subtle">{outlet.type}</span>
            )}
          </p>
        </div>

        <address className="flex items-start gap-2 text-body-sm not-italic text-content-muted">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            {outlet.location?.address}
            {outlet.location?.city && (
              <>
                <br />
                {outlet.location.city}
                {outlet.location.state ? `, ${outlet.location.state}` : ""}
              </>
            )}
          </span>
        </address>

        <div className="rounded-sm bg-surface-sunken px-3 py-2">
          <p className="flex items-center gap-2 text-body-sm font-medium text-content">
            <Clock aria-hidden className="size-4 shrink-0 text-brand" />
            {statusLine(outlet)}
          </p>
          <p className="mt-1 text-label-sm leading-relaxed text-content-subtle">
            {scheduleSummary(outlet)}
          </p>
        </div>

        {facilities.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {facilities.map((facility) => (
              <li
                key={facility.key}
                className="rounded-full border border-line-hairline px-2.5 py-1 text-[11px] font-medium text-content-subtle"
              >
                {facility.label}
              </li>
            ))}
          </ul>
        )}

        {/* ---- Actions ---- */}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <a
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-sm bg-brand text-label-sm font-semibold text-brand-contrast transition-colors duration-fast ease-standard hover:bg-brand-hover"
            href={directionsHref(outlet)}
            rel="noopener noreferrer"
            target="_blank"
          >
            Directions
            <ExternalLink aria-hidden size={14} />
          </a>
          {outlet.contact?.phone && (
            <a
              aria-label={`Call ${outlet.name}`}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm border border-line-hairline text-content-muted transition-colors duration-fast ease-standard hover:border-brand/50 hover:text-brand"
              href={`tel:${outlet.contact.phone}`}
            >
              <Phone aria-hidden size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default OutletCard;