import type { LucideIcon } from "lucide-react";
import NextLink from "next/link";
import { ArrowRight, Construction } from "lucide-react";

import { Container } from "./Container";

type ComingSoonProps = {
  icon: LucideIcon;
  title: string;
  eyebrow?: string;
  /** Set expectations honestly instead of implying the page exists. */
  description: string;
  /** Optional detail bullets shown under the description. */
  highlights?: string[];
  /** Route the visitor to something useful instead of a dead end. */
  cta?: { label: string; href: string };
};

export function ComingSoon({
  icon: Icon,
  title,
  eyebrow = "Coming soon",
  description,
  highlights,
  cta,
}: ComingSoonProps) {
  return (
    <Container width="narrow" className="py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <span className="relative mb-8 grid size-20 place-items-center rounded-xl bg-brand-subtle text-brand">
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-xl bg-brand/20 blur-2xl"
          />
          <Icon aria-hidden className="size-9" strokeWidth={1.75} />
        </span>

        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line-hairline bg-surface-raised px-3 py-1 text-overline font-semibold uppercase tracking-[0.14em] text-content-subtle">
          <Construction aria-hidden size={12} />
          {eyebrow}
        </p>

        <h1 className="text-display-md font-bold text-content">{title}</h1>

        <p className="mt-4 max-w-prose text-body-lg text-content-muted">
          {description}
        </p>

        {highlights && highlights.length > 0 && (
          <ul className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-sm border border-line-hairline bg-surface-raised p-4 text-body-sm text-content-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {cta && (
            <NextLink
              className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-5 text-body-sm font-semibold text-brand-contrast shadow-brand transition-colors duration-fast ease-standard hover:bg-brand-hover"
              href={cta.href}
            >
              {cta.label}
              <ArrowRight aria-hidden size={16} />
            </NextLink>
          )}
          <NextLink
            className="inline-flex h-11 items-center rounded-md border border-line-hairline px-5 text-body-sm font-semibold text-content transition-colors duration-fast ease-standard hover:bg-surface-sunken"
            href="/shop"
          >
            Browse products
          </NextLink>
        </div>
      </div>
    </Container>
  );
}

export default ComingSoon;