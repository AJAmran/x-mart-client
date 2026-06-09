"use server";

import { cookies } from "next/headers";

const BACKEND = process.env.NEXT_PUBLIC_BASE_API ?? "";
const ACCESS = "accessToken";
const REFRESH = "refreshToken";

type ApiSuccess<T> = { success: true; data: T };
type ApiFailure = { success: false; message?: string };

const isApiSuccess = <T,>(v: unknown): v is ApiSuccess<T> =>
  typeof v === "object" && v !== null && (v as { success?: unknown }).success === true;

const clearServerCookies = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS);
  cookieStore.delete(REFRESH);
};

const callBackend = async <T,>(
  path: string,
  init: RequestInit & { method?: string; body?: unknown }
): Promise<T> => {
  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");

  // Forward the auth cookies on every server-side call so the protected
  // endpoints keep working under SSR.
  const cookieStore = await cookies();
  const cookieHeader = [
    cookieStore.get(ACCESS) && `${ACCESS}=${cookieStore.get(ACCESS)?.value}`,
    cookieStore.get(REFRESH) && `${REFRESH}=${cookieStore.get(REFRESH)?.value}`,
  ]
    .filter(Boolean)
    .join("; ");

  if (cookieHeader) headers.set("cookie", cookieHeader);

  const res = await fetch(`${BACKEND}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  await forwardSetCookies(res);
  const text = await res.text();
  let json: unknown = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const message =
      (json as { message?: string })?.message ??
      `Request failed with status ${res.status}`;

    throw new Error(message);
  }

  return json as T;
};

/**
 * Forward every `Set-Cookie` header from a backend response into the Next.js
 * cookie store. The backend keeps tokens in httpOnly cookies (XSS-safe), so
 * the server action's job is to copy those cookies onto the browser response.
 */
const forwardSetCookies = async (res: Response) => {
  const setCookieHeaders = res.headers.getSetCookie?.() ?? [];

  if (setCookieHeaders.length === 0) return;
  const cookieStore = await cookies();

  for (const cookieStr of setCookieHeaders) {
    const parts = cookieStr.split(";").map((s) => s.trim());
    const [pair] = parts;
    const eqIdx = pair.indexOf("=");

    if (eqIdx <= 0) continue;
    const name = pair.slice(0, eqIdx);
    const value = pair.slice(eqIdx + 1);
    const lower = parts.map((p) => p.toLowerCase());

    cookieStore.set(name, value, {
      httpOnly: lower.some((p) => p === "httponly"),
      secure: lower.some((p) => p === "secure"),
      sameSite: lower.some((p) => p.startsWith("samesite=none"))
        ? "none"
        : lower.some((p) => p.startsWith("samesite=strict"))
          ? "strict"
          : "lax",
      path: (parts.find((p) => p.toLowerCase().startsWith("path="))?.split("=")[1]) || "/",
      maxAge: Number(parts.find((p) => p.toLowerCase().startsWith("max-age="))?.split("=")[1]) || undefined,
    });
  }
};

export const registerUser = async (userData: Record<string, unknown>) => {
  const data = await callBackend<ApiSuccess<unknown> | ApiFailure>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!isApiSuccess(data)) {
    throw new Error("Registration failed");
  }

  // Tokens are written to the browser via forwarded Set-Cookie headers above.
  return { success: true, user: (data as { data: { user?: unknown } }).data.user };
};

export const loginUser = async (userData: Record<string, unknown>) => {
  const data = await callBackend<ApiSuccess<unknown> | ApiFailure>("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (!isApiSuccess(data)) {
    throw new Error("Login failed");
  }

  // Tokens are written to the browser via forwarded Set-Cookie headers above.
  return { success: true, user: (data as { data: { user?: unknown } }).data.user };
};

export const logout = async () => {
  try {
    await callBackend("/auth/logout", { method: "POST" });
  } catch {
    // Best-effort — we always clear local cookies below
  }
  await clearServerCookies();
};

export const getCurrentUser = async () => {
  // Always re-verify by calling a server route that decodes the cookie OR
  // by directly calling a backend endpoint. We do the latter for safety.
  try {
    const res = await callBackend<ApiSuccess<{ user: unknown }>>("/auth/me", {
      method: "GET",
    });

    return isApiSuccess<{ user: unknown }>(res) ? res.data.user : null;
  } catch {
    return null;
  }
};

export const changePassword = async (passwordData: {
  oldPassword: string;
  newPassword: string;
}) => {
  const data = await callBackend<ApiSuccess<unknown> | ApiFailure>(
    "/auth/change-password",
    { method: "POST", body: JSON.stringify(passwordData) }
  );

  if (!isApiSuccess(data)) throw new Error("Password change failed");

  return data;
};

export const refreshAccessToken = async () => {
  const data = await callBackend<ApiSuccess<unknown> | ApiFailure>("/auth/refresh-token", {
    method: "POST",
  });

  if (!isApiSuccess(data)) {
    await clearServerCookies();
    throw new Error("Refresh failed");
  }

  // Tokens are written to the browser via forwarded Set-Cookie headers above.
  return data;
};
