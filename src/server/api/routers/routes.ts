import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getCurrentTime } from "../../../app/_components/util";

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
        orderBy: {
          index: "asc",
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
  updateRoutes: privateProcedure
    .input(
      z.array(
        z.object({
          id: z.number().optional(),
          busId: z.number(),
          stopId: z.number(),
          index: z.number(),
          deptTime: z.date(),
          arriTime: z.date().optional(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return Promise.all(
        input.map(async (route) => {
          if (route.id != undefined) {
            return ctx.db.routes.update({
              where: { id: route.id },
              data: route,
            });
          } else {
            await ctx.db.routes.deleteMany({
              where: {
                busId: route.busId,
                index: route.index,
              },
            });
            return ctx.db.routes.create({
              data: route,
            });
          }
        }),
      );
    }),
  getCurrentRouteOfBus: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = getCurrentTime();
      return ctx.db.routes.findFirst({
        where: {
          busId: input.busId,
          deptTime: {
            gt: now.date,
          },
          bus: {
            isWeekend: now.isWeekend,
          },
        },
      });
    }),
  getCurrentRouteOfBuses: publicProcedure
    .input(
      z.object({
        busIds: z.array(z.number()),
        date: z.date(),
        isWeekend: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return Promise.all(
        input.busIds.map(async (busId) => {
          const res = await ctx.db.routes.findFirst({
            where: {
              busId,
              deptTime: {
                gt: input.date,
              },
              bus: {
                isWeekend: input.isWeekend,
              },
            },
          });
          return {
            busId,
            route: res,
          };
        }),
      );
    }),
});
