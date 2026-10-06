import { primaryNav } from "./navigation";

/**
 * Store identity — the single place a store owner changes to rebrand the
 * storefront.
 *
 * IMPORTANT: every variable below is read with a *static* `process.env.X`
 * reference. Next.js inlines `NEXT_PUBLIC_*` values into the client bundle at
 * build time by rewriting that exact syntax; a dynamic lookup like
 * `process.env[key]` is left untouched and arrives in the browser as
 * `undefined`. Reading these dynamically silently produces a half-branded store
 * whose server-rendered pages look right and whose client components do not.
 *
 * All values are public by design — never put a secret here.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  /** Shown in the navbar, page titles, invoices and the admin console. */
  name: process.env.NEXT_PUBLIC_STORE_NAME || "X-mart",
  legalName: process.env.NEXT_PUBLIC_STORE_LEGAL_NAME || "X-mart",
  /** One or two sentences, used for metadata and the footer. */
  description:
    process.env.NEXT_PUBLIC_STORE_DESCRIPTION ||
    "Fresh groceries, pantry staples and daily essentials delivered across Bangladesh. Same-day delivery slots, secure checkout and 12 nationwide outlets.",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Fresh groceries, delivered fast",

  url: siteUrl ?? "http://localhost:3000",
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/opengraph-image.png",
  locale: process.env.NEXT_PUBLIC_STORE_LOCALE || "en_US",
  currency: process.env.NEXT_PUBLIC_STORE_CURRENCY || "BDT",

  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+880 1700 000001",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@xmart.com",

  /**
   * The contact block.
   *
   * Defaults to three lines. A store with a different number of contacts sets
   * NEXT_PUBLIC_CONTACT_LINES instead:
   *   "Sales:01800000000,Support:01700000000:support@shop.com"
   * (Label:phone, with an optional email after a semicolon.)
   */
  contacts: (() => {
    const raw = process.env.NEXT_PUBLIC_CONTACT_LINES;

    if (raw) {
      return raw
        .split(",")
        .map((entry) => {
          const [label, rest] = entry.split(":").map((part) => part.trim());
          const [phone, email] = (rest ?? "").split(";").map((part) => part.trim());

          return { label, phone, email };
        })
        .filter((contact) => contact.label && contact.phone);
    }

    return [
      { label: "Support", phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+880 1700 000001", email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@xmart.com" },
      { label: "Sales", phone: "+880 1800 000002", email: "sales@xmart.com" },
      { label: "Helpline", phone: "+880 1900 000003", email: "helpline@xmart.com" },
    ];
  })(),

  navItems: primaryNav,

  /**
   * Social profiles. Any value left blank renders no link, so a store without
   * social accounts does not ship dead icons.
   */
  links: {
    github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || "https://github.com/AJAmran/xmart",
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
  },
} as const;