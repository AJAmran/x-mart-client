import type { Metadata } from "next";

import Footer from "@/src/components/UI/Footer";
import Navbar from "@/src/components/navbar/Navbar";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
};

/**
 * Storefront shell: sticky header, page slot, footer.
 *
 * `id="main"` is the skip-link target declared in the root layout. The
 * `scroll-mt` offset means an in-page anchor clears the sticky header stack
 * without a spacer element.
 */
const StorefrontLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-dvh flex-col bg-surface">
    <Navbar />
    <main className="flex-1 scroll-mt-32" id="main">
      {children}
    </main>
    <Footer />
  </div>
);

export default StorefrontLayout;