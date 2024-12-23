import { url } from "inspector";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token");
  if (!token && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  return NextResponse.redirect(new URL("/", req.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
