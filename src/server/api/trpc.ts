/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { auth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { type NextRequest } from "next/server";
import posthog from "posthog-js";
import superjson from "superjson";
import { ZodError } from "zod";

import type { SetCommandOptions } from "@upstash/redis";
import { cache, db } from "~/server/db";
import { env } from "../../env";

const isPosthogEnabled = env.NEXT_PUBLIC_POSTHOG_KEY != undefined;

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  req?: NextRequest;
}) => {
  const cacheSetReturn = <TData>(
    key: string,
    value: TData,
    opts?: SetCommandOptions,
  ): Promise<TData> =>
    cache.set(key, `$${superjson.stringify(value)}`, opts).then(() => value);
  const cacheGet = async <TData extends object | null>(key: string) => {
    const cachedData = await cache.get<string>(key);
    if (!cachedData) return null;
    if (!cachedData.startsWith("$")) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Cache hit for ${key} but not superjson data. Make sure to use cacheSetReturn to cache data or use ctx.cache.set for regular string.`,
      });
    }
    return superjson.parse<TData>(cachedData.slice(1));
  };
  const cacheDel = async (cacheKeys: string[]) => {
    const keys = (
      await Promise.all(cacheKeys.map((k) => cache.keys(k)))
    ).flat();
    if (keys.length === 0) return;
    await cache.del(...keys.flat());
  };
  return {
    db,
    cache,
    cacheSetReturn,
    cacheGet,
    cacheDel,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);
  if (isPosthogEnabled)
    posthog.capture("TRPC Procedure", {
      path,
      duration: end - start,
    });
  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * User procedure
 *
 * This is a procedure that can be used with unauthenticated users as well as authenticated users.
 * Where the difference is that this will not error for unauthenticated users, but will provide the
 * user object if they are authenticated.
 */
export const userProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authObj = await auth();
  return next({
    ctx: {
      ...ctx,
      // infers the `session` as nullable
      session: {
        ...authObj,
      },
    },
  });
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const privateProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    const authObj = await auth();
    if (!authObj.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
    return next({
      ctx: {
        ...ctx,
        // infers the `session` as non-nullable
        session: {
          ...authObj,
        },
      },
    });
  });
