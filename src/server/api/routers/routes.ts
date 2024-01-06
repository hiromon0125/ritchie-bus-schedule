import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const routesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.routes.findMany()),
  getAllByBusId: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          busId: input.busId,
        },
      }),
    ),
  getAllByStopId: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          stopId: input.stopId,
        },
      }),
    ),
  addRoutes: privateProcedure
    .input(
      z.array(
        z.object({
          busId: z.number(),
          stopId: z.number(),
          index: z.number(),
          deptTime: z.date(),
          arriTime: z.date().optional(),
        }),
      ),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.routes.createMany({
        data: input,
      });
    }),
  getCurrentRouteOfBus: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const nowNotUTC = new Date();
      const now = new Date(
        nowNotUTC.getTime() - nowNotUTC.getTimezoneOffset() * 60000,
      );
      const firstRoute = await ctx.db.routes.findFirst({
        where: {
          busId: input.busId,
        },
      });
      if (!firstRoute) return null;
      now.setFullYear(firstRoute.deptTime.getFullYear());
      now.setMonth(firstRoute.deptTime.getMonth());
      now.setDate(firstRoute.deptTime.getDate());
      return ctx.db.routes.findFirst({
        where: {
          busId: input.busId,
          deptTime: {
            gt: now,
          },
        },
      });
    }),
});
