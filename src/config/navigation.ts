import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  Building2,
  LifeBuoy,
  MapPin,
  Receipt,
  RotateCcw,
  Search,
  Store,
  Truck,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Shown as a small marker in the footer. */
  description?: string;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

/** Primary navigation — the horizontal bar under the header. */
export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop", icon: Search },
  { label: "Track Order", href: "/track-order", icon: Receipt },
  { label: "Great Deals", href: "/deals", icon: BadgePercent },
  { label: "Our Outlets", href: "/outlets", icon: Store },
  { label: "Help Line", href: "/help", icon: LifeBuoy },
];

/** Secondary navigation — only surfaced to a signed-in user. */
export const accountNav: NavLink[] = [
  { label: "Orders", href: "/orders", icon: Receipt },
  { label: "Wishlist", href: "/wishlist", icon: MapPin },
];

/** Footer column — shopping. */
export const shopGroup: NavGroup = {
  title: "Shop",
  links: [
    { label: "All Products", href: "/shop" },
    { label: "Great Deals", href: "/deals", description: "Up to 50% off" },
    { label: "New Arrivals", href: "/shop?sortBy=createdAt&sortOrder=desc" },
    { label: "Track Order", href: "/track-order" },
  ],
};

/** Footer column — company. */
export const companyGroup: NavGroup = {
  title: "Company",
  links: [
    { label: "About Us", href: "/about" },
    { label: "Our Outlets", href: "/outlets", description: "Store locations" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

/** Footer column — help & policies. */
export const supportGroup: NavGroup = {
  title: "Help & Policies",
  links: [
    { label: "Help Center", href: "/help", icon: LifeBuoy },
    { label: "Shipping Policy", href: "/shipping", icon: Truck },
    { label: "Returns & Refunds", href: "/returns", icon: RotateCcw },
    { label: "FAQs", href: "/help#faq" },
    { label: "Contact Support", href: "/contact" },
  ],
};

/** Footer legal row. */
export const legalNav: NavLink[] = [
  { label: "Privacy", href: "/about" },
  { label: "Terms", href: "/about" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

/** Trust signals rendered in the footer. */
export const trustSignals: { icon: LucideIcon; label: string; detail: string }[] = [
  { icon: Truck, label: "Free delivery", detail: "On orders over ৳999" },
  { icon: Building2, label: "12 outlets", detail: "Nationwide coverage" },
  { icon: Receipt, label: "Secure checkout", detail: "SSLCommerz protected" },
];

/** Flat lookup used to validate that every href points at a real route. */
export const allRoutes: string[] = Array.from(
  new Set(
    [
      ...primaryNav,
      ...accountNav,
      ...shopGroup.links,
      ...companyGroup.links,
      ...supportGroup.links,
      ...legalNav,
    ].map((link) => link.href.split("?")[0].split("#")[0])
  )
);