import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;
  
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  
  if (isAuthRoute) {
    if (isAuthenticated) {
      if (role === "employer") {
        return NextResponse.redirect(new URL("/dashboard/listings", nextUrl));
      }
      return NextResponse.redirect(new URL("/jobs", nextUrl));
    }
    return NextResponse.next();
  }
  
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (role !== "employer") {
      return NextResponse.redirect(new URL("/jobs", nextUrl));
    }
    return NextResponse.next();
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
};
