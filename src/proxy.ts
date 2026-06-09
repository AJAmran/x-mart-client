import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// C-03 FIX: verify the JWT signature locally on the Edge runtime using jose.
// The previous implementation decoded the JWT with jwt-decode (no signature
// check), which meant any forged token with the right shape passed the gate.

const PUBLIC_ROUTES = new Set<string>(["/auth/login", "/auth/register"]);
const PUBLIC_PREFIXES = ["/_next", "/api/auth", "/favicon", "/site.webmanifest", "/robots.txt", "/sitemap.xml"];

const ROLE_RULES: Array<{ roles: string[]; match: RegExp }> = [
  { roles: ["USER", "ADMIN"], match: /^\/profile(\/.*)?$/ },
  { roles: ["USER", "ADMIN"], match: /^\/checkout(\/.*)?$/ },
  { roles: ["USER", "ADMIN"], match: /^\/orders(\/.*)?$/ },
  { roles: ["USER", "ADMIN"], match: /^\/payment(\/.*)?$/ },
  { roles: ["ADMIN"], match: /^\/dashboard(\/.*)?$/ },
];

const secret = process.env.JWT_SECRET;

if (!secret) {
  // Deny-by-default in production: refuse to start. In development, fall back
  // to a placeholder so the dev server stays alive — signature verification
  // will still reject every cookie-issued token, so unauthenticated access is
  // the only "leak" (which is correct: the user must log in).
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET is required by middleware. Set it in your environment (must match the backend's JWT_SECRET)."
    );
  }
  console.warn(
    "[proxy] JWT_SECRET is not set — using a dev-only placeholder. Add JWT_SECRET to .env.local to match the backend."
  );
}
const key = new TextEncoder().encode(secret ?? "dev-only-placeholder-do-not-use-in-prod");

// Next.js 16 reads either a default export or the named `proxy` export.
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return redirectToLogin(request, pathname);
  }

  let payload: { role?: string; status?: string; exp?: number } = {};

  try {
    const verified = await jwtVerify(accessToken, key, { algorithms: ["HS256"] });

    payload = verified.payload as typeof payload;
  } catch {
    return redirectToLogin(request, pathname);
  }

  if (payload.status === "BLOCKED") {
    return NextResponse.redirect(new URL("/auth/login?error=blocked", request.url));
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    return redirectToLogin(request, pathname);
  }

  const rule = ROLE_RULES.find((r) => r.match.test(pathname));

  if (rule && !rule.roles.includes(payload.role ?? "")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest, pathname: string) {
  return NextResponse.redirect(
    new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url)
  );
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/payment/:path*",
    "/auth/:path*",
  ],
};
