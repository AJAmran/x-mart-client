// components/ProtectedRoute.tsx
"use client";

import { useCurrentUser } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push("/auth/login"); // Redirect to login if unauthorized
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>; // Add a loading spinner
  }

  return <>{children}</>;
}
