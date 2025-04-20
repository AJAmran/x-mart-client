import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getCurrentUser } from "./services/AuthService";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

// Role-based route access
const ROLE_BASED_ROUTES = {
  USER: [/^\/profile(\/.*)?$/],
  ADMIN: [/^\/profile(\/.*)?$/, /^\/dashboard(\/.*)?$/],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the current user
  const user = await getCurrentUser();

  // If the user is not authenticated
  if (!user) {
    // Allow access to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }
    // Redirect to login for protected routes

    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${pathname}`, request.url)
    );
  }

  // If the user is authenticated, check role-based access
  if (
    user?.role &&
    ROLE_BASED_ROUTES[user.role as keyof typeof ROLE_BASED_ROUTES]
  ) {
    const allowedRoutes =
      ROLE_BASED_ROUTES[user.role as keyof typeof ROLE_BASED_ROUTES];

    // Check if the current route is allowed for the user's role
    if (allowedRoutes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  // If the user is authenticated and trying to access the checkout page
  if (pathname.startsWith("/checkout")) {
    return NextResponse.next();
  }

  // Redirect to the default route if the user is not authorized
  return NextResponse.redirect(new URL("/", request.url));
}

// Define the routes to apply the middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout",
    "/auth/login",
    "/auth/register",
  ],
};
