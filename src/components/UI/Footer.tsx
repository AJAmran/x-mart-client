import NextLink from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

import { Container } from "./Container";
import { Logo } from "./Logo";
import NewsletterForm from "./NewsletterForm";
import {
  companyGroup,
  shopGroup,
  supportGroup,
  type NavGroup,
} from "@/src/config/navigation";
import { siteConfig } from "@/src/config/site";

const groups: NavGroup[] = [shopGroup, companyGroup, supportGroup];

const socials = [
  { label: "Facebook", href: siteConfig.links.facebook, Icon: Facebook },
  { label: "Instagram", href: siteConfig.links.instagram, Icon: Instagram },
  { label: "X (Twitter)", href: siteConfig.links.twitter, Icon: Twitter },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: Linkedin },
];

/** Payment / trust marks — replace with your real gateway logos. */
const paymentMarks = ["Visa", "Mastercard", "bKash", "Nagad", "Cash on Delivery"];

function LinkColumn({ group }: { group: NavGroup }) {
  const headingId = `footer-${group.title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <nav aria-labelledby={headingId}>
      <h2
        className="text-overline font-semibold uppercase tracking-[0.14em] text-content"
        id={headingId}
      >
        {group.title}
      </h2>
      <ul className="mt-4 flex flex-col gap-1">
        {group.links.map((link) => (
          <li key={`${group.title}-${link.href}-${link.label}`}>
            <NextLink
              className="group inline-flex items-baseline gap-1.5 rounded-xs py-1 text-body-sm text-content-muted transition-colors duration-fast ease-standard hover:text-brand"
              href={link.href}
            >
              {link.label}
              {link.description && (
                <span className="text-label-sm text-content-subtle transition-colors group-hover:text-brand/70">
                  {link.description}
                </span>
              )}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Site footer.
 *
 * Four zones, in the order people actually need them:
 *   1. Contact block + newsletter — the two things a visitor looks for first
 *   2. Sitemap columns
 *   3. Trust/payment marks
 *   4. Legal + social
 *
 * Every link is read from the shared navigation config, which is what stopped
 * the previous version from pointing at routes that 404.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line-hairline bg-surface-raised">
      <Container>
        {/* ---- Zone 1: brand, contact, newsletter ---- */}
        <div className="grid gap-10 border-b border-line-hairline py-12 lg:grid-cols-12 lg:gap-8 lg:py-14">
          <div className="lg:col-span-5">
            <NextLink
              aria-label="X-mart — go to homepage"
              className="inline-flex items-center"
              href="/"
            >
              <Logo height={32} />
            </NextLink>

            <p className="mt-5 max-w-prose text-body-sm leading-relaxed text-content-muted">
              Fresh groceries, pantry staples and daily essentials, delivered
              across Bangladesh. Order by 4pm for a same-day slot inside Dhaka.
            </p>

            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  className="group inline-flex items-start gap-2.5 text-body-sm text-content-muted transition-colors duration-fast hover:text-brand"
                  href={`tel:${siteConfig.supportPhone.replace(/\s/g, "")}`}
                >
                  <Phone aria-hidden className="mt-0.5 shrink-0" size={15} />
                  {siteConfig.supportPhone}
                </a>
              </li>
              <li>
                <a
                  className="group inline-flex items-start gap-2.5 text-body-sm text-content-muted transition-colors duration-fast hover:text-brand"
                  href={`mailto:${siteConfig.supportEmail}`}
                >
                  <Mail aria-hidden className="mt-0.5 shrink-0" size={15} />
                  {siteConfig.supportEmail}
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-body-sm text-content-muted">
                <Clock aria-hidden className="mt-0.5 shrink-0" size={15} />
                <span>
                  Support 9am&ndash;9pm, every day
                  <span className="block text-label-sm text-content-subtle">
                    Orders after 4pm dispatch next morning
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-7">
              <NewsletterForm />
            </div>
          </div>

          {/* ---- Zone 2: sitemap ---- */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {groups.map((group) => (
              <LinkColumn key={group.title} group={group} />
            ))}
          </div>
        </div>

        {/* ---- Zone 3: trust marks ---- */}
        <div className="flex flex-col gap-5 border-b border-line-hairline py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-label-sm font-medium uppercase tracking-[0.12em] text-content-subtle">
            We accept
          </p>
          <ul className="flex flex-wrap items-center gap-2">
            {paymentMarks.map((mark) => (
              <li
                key={mark}
                className="rounded-xs border border-line-hairline bg-surface px-2.5 py-1.5 text-label-sm font-medium text-content-muted"
              >
                {mark}
              </li>
            ))}
          </ul>
          <p className="inline-flex items-center gap-2 text-label-sm text-content-subtle">
            <MapPin aria-hidden size={14} />
            12 outlets nationwide
          </p>
        </div>

        {/* ---- Zone 4: legal + social ---- */}
        <div className="flex flex-col-reverse items-center gap-5 py-7 sm:flex-row sm:justify-between">
          <p className="text-center text-label-sm text-content-subtle sm:text-left">
            © {year} {siteConfig.legalName}. All rights reserved.{" "}
            <span className="hidden sm:inline">
              Prices include VAT. Delivery fees calculated at checkout.
            </span>
          </p>

          <ul className="flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  aria-label={`X-mart on ${label}`}
                  className="grid size-9 place-items-center rounded-sm text-content-subtle transition-colors duration-fast ease-standard hover:bg-surface-sunken hover:text-content"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon aria-hidden size={17} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;