import type { ReactNode } from "react";
import Sidebar from "@/src/components/UI/Sidebar";
import { AdminHeader } from "@/src/components/dashboard/AdminHeader";

/**
 * Admin Shell - React Server Component (RSC)
 *
 * Converted to a Server Component to remove unnecessary client-side JS bundle overhead.
 * Client interactivity (Search, ThemeSwitch, Profile Chip) is encapsulated inside
 * the AdminHeader client island, reducing client hydration work.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface font-sans">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />

        {/* Gradient hairline — brand accent under the sticky bar. */}
        <div aria-hidden className="rule-brand h-px w-full" />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
