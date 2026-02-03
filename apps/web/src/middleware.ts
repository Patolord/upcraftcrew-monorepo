import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Valid locales for the landing page
const VALID_LOCALES = ["en", "pt"];

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/reset-password-done(.*)",
  "/legal/(.*)",
  "/api/webhook(.*)",
]);

// Check if the request is for a valid locale route (landing page)
function isLocaleRoute(pathname: string): boolean {
  // Check exact locale match like /en or /pt
  if (VALID_LOCALES.includes(pathname.slice(1))) {
    return true;
  }

  // Check locale prefix like /en/... or /pt/...
  for (const locale of VALID_LOCALES) {
    if (pathname.startsWith(`/${locale}/`)) {
      return true;
    }
  }

  return false;
}

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;

  // Allow public routes and locale routes (landing page)
  if (isPublicRoute(request) || isLocaleRoute(pathname)) {
    return NextResponse.next();
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files (images, fonts, etc.)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)",
  ],
};
