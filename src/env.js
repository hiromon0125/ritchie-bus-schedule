import { createEnv } from "@t3-oss/env-nextjs";
import process from "process";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    DIRECT_URL: z.string({ message: "Direct URL Missing" }).url().optional(),
    CLERK_SECRET_KEY: z.string({
      message: "Please provide a valid Clerk secret key.",
    }),
    SERVICE_INFO_LINK: z
      .string({ message: "Service Info link missing" })
      .url()
      .optional(),
    SERVICE_INFO_SECRET_KEY: z
      .string({ message: "Service Info key missing" })
      .optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z
      .string({ message: "PostHog Key missing" })
      .optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z
      .string({ message: "PostHog Host Link missing" })
      .optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string({
      message: "Clerk Publishable key is missing. This is a required variable",
    }),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    SERVICE_INFO_LINK: process.env.SERVICE_INFO_LINK,
    SERVICE_INFO_SECRET_KEY: process.env.SERVICE_INFO_SECRET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
