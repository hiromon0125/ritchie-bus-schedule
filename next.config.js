/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { withPostHogConfig } from "@posthog/nextjs-config";

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.buymeacoffee.com",
        pathname: "**",
      },
    ],
  },
};

// Upload source maps to PostHog on production builds so error stack traces are
// readable instead of minified. This only runs when the build provides the
// credentials, so local and credential-less builds stay unaffected.
const posthogApiKey = process.env.POSTHOG_API_KEY;
const posthogProjectId = process.env.POSTHOG_PROJECT_ID;

export default posthogApiKey && posthogProjectId
  ? withPostHogConfig(config, {
      personalApiKey: posthogApiKey,
      projectId: posthogProjectId,
    })
  : config;
