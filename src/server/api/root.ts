import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { busRouter } from "./routers/bus";
import { favoriteRouter } from "./routers/favorite";
import { manageRouter } from "./routers/manage";
import { routesRouter } from "./routers/routes";
import { serviceInfoRouter } from "./routers/serviceInfo";
import { stopsRouter } from "./routers/stops";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bus: busRouter,
  routes: routesRouter,
  stops: stopsRouter,
  favorite: favoriteRouter,
  manager: manageRouter,
  serviceinfo: serviceInfoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
