export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "X-mart",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  navMenuItems: [
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Orders",
      href: "/orders",
    },
    {
      label: "Logout",
      href: "#",
    },
  ],
};
