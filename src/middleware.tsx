import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminPrivate = createRouteMatcher(["/manage/(.*)"]);

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default clerkMiddleware(async (auth, req) => {
  if (isAdminPrivate(req))
    await auth.protect((has) => {
      return has({ role: "org:admin" });
    });
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
