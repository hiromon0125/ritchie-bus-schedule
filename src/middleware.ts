import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPrivate = createRouteMatcher(["/manage/(.*)"]);

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default clerkMiddleware((auth, req) => {
  if (isPrivate(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
