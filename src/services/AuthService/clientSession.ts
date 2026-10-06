"use client";

import axiosInstance from "@/src/lib/axios";
import type { IUser } from "@/src/types";

const TTL_MS = 30_000;

let cache: { user: IUser | null; at: number } | null = null;
let inflight: Promise<IUser | null> | null = null;

async function requestCurrentUser(): Promise<IUser | null> {
  try {
    const { data } = await axiosInstance.get("/auth/me");

    return data?.success && data?.data?.user ? (data.data.user as IUser) : null;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser(): Promise<IUser | null> {
  if (typeof window === "undefined") return null;

  if (cache && Date.now() - cache.at < TTL_MS) return cache.user;

  inflight ??= requestCurrentUser().finally(() => {
    inflight = null;
  });

  const user = await inflight;

  cache = { user, at: Date.now() };

  return user;
}

export function clearCurrentUserCache(): void {
  cache = null;
}
