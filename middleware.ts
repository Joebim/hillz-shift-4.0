import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Use the same cookie name as defined in .env.local or fallback to default
  const SESSION_COOKIE_NAME = "ministry_admin_session";

  // Check if accessing admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      // Redirect to login if no session
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists, allow access
    return NextResponse.next();
  }

  // If accessing login while already logged in, redirect to dashboard
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
