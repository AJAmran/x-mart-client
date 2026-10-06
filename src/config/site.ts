import { primaryNav } from "./navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: "X-mart",
  legalName: "X-mart",
  description:
    "X-mart — fresh groceries, pantry staples and daily essentials delivered across Bangladesh. Same-day delivery slots, secure checkout and 12 nationwide outlets.",
  tagline: "Fresh groceries, delivered fast",
  url: siteUrl ?? "http://localhost:3000",
  ogImage: "/opengraph-image.png",
  locale: "en_US",
  currency: "BDT",
  supportPhone: "+880 1700 000001",
  supportEmail: "support@xmart.com",
  contacts: [
    { label: "Support", phone: "+880 1700 000001", email: "support@xmart.com" },
    { label: "Sales", phone: "+880 1800 000002", email: "sales@xmart.com" },
    { label: "Helpline", phone: "+880 1900 000003", email: "helpline@xmart.com" },
  ],

  navItems: primaryNav,

  links: {
    github: "https://github.com/AJAmran/xmart",
    twitter: "https://twitter.com/xmart",
    facebook: "https://facebook.com/xmart",
    instagram: "https://instagram.com/xmart",
    linkedin: "https://linkedin.com/company/xmart",
  },
} as const;