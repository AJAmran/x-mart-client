import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

/** Requires any signed-in user. */
const USER_PREFIXES = [
  "/profile",
  "/orders",
  "/wishlist",
  "/checkout",
];

/** Requires the ADMIN role. */
const ADMIN_PREFIXES = ["/dashboard"];

const LOGIN_PATH = "/auth/login";

const matches = (pathname: string, prefixes: string[]) =>
  prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

type Session = { authenticated: boolean; role?: string };

async function getSession(req: NextRequest): Promise<Session> {
  const hasAccess = Boolean(req.cookies.get(ACCESS_COOKIE)?.value);
  const hasRefresh = Boolean(req.cookies.get(REFRESH_COOKIE)?.value);

  if (!hasAccess && !hasRefresh) return { authenticated: false };

  const baseApi = (
    process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:5000/api/v1"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseApi}/auth/me`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });

    if (res.ok) {
      const body = (await res.json()) as {
        data?: { user?: { role?: string } };
      };

      return { authenticated: true, role: body?.data?.user?.role };
    }

    // Access token expired (or was revoked) but a refresh token survives.
    if (hasRefresh) return { authenticated: true };
  } catch {
    // Backend unreachable — fail closed for admin routes so a backend outage
    // never silently downgrades into "public admin console".
    return { authenticated: hasAccess || hasRefresh };
  }

  return { authenticated: false };
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const needsAdmin = matches(pathname, ADMIN_PREFIXES);
  const needsUser = matches(pathname, USER_PREFIXES);

  if (!needsAdmin && !needsUser) return NextResponse.next();

  const session = await getSession(req);

  // Signed in, but not an admin → keep them out of the console entirely.
  if (needsAdmin && (!session.authenticated || session.role !== "ADMIN")) {
    const url = req.nextUrl.clone();

    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("redirect", `${pathname}${search}`);
    url.searchParams.set(
      "reason",
      session.authenticated ? "forbidden" : "unauthenticated"
    );

    return NextResponse.redirect(url);
  }

  if (needsUser && !session.authenticated) {
    const url = req.nextUrl.clone();

    url.pathname = LOGIN_PATH;
    url.search = "";
    url.searchParams.set("redirect", `${pathname}${search}`);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Only the guarded trees. Anything not matched here (storefront, marketing
   * pages, `/api/*`, static assets) skips Proxy entirely.
   *
   * Server Functions are POSTs to the page they are used on, so this also
   * covers the action calls made from `/dashboard/*`.
   */
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
  ],
};

export default proxy;