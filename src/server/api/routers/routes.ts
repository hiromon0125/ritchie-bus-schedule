import { getCurrentTimeServer } from "@/util";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

function resetDate(date: Date) {
  date.setFullYear(1970, 0, 1);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export const routesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.routes.findMany()),
  getAllByBusId: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
        offset: z.number().optional().default(0),
        windowsize: z.number().optional(),
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
        skip: input.offset,
        take: input.windowsize,
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
  getAllByStopAndBus: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
        busId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          stopId: input.stopId,
          busId: input.busId,
        },
        orderBy: {
          index: "asc",
        },
      }),
    ),
  updateRoutes: privateProcedure
    .input(
      z.object({
        busId: z.number(),
        stopIds: z.array(z.number()),
        routes: z.array(
          z.object({
            id: z.number().optional(),
            busId: z.number(),
            stopId: z.number(),
            index: z.number(),
            deptTime: z.date(),
            arriTime: z.date().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Nuke the data that is going to be updated
      await ctx.db.routes.deleteMany({
        where: {
          busId: input.busId,
        },
      });
      const stops = await ctx.db.stops.findMany({
        where: {
          id: {
            notIn: input.stopIds,
          },
          buses: {
            some: {
              id: input.busId,
            },
          },
        },
      });
      await Promise.all(
        stops.map(async (stop) => {
          await ctx.db.stops.update({
            where: {
              id: stop.id,
            },
            data: {
              buses: {
                disconnect: [{ id: input.busId }],
              },
            },
            include: {
              buses: true,
            },
          });
        }),
      );
      // Insert the new data
      await ctx.db.routes.createMany({
        data: input.routes.map((route) => {
          const dep = resetDate(new Date(route.deptTime));
          const arr = route.arriTime
            ? resetDate(new Date(route.arriTime))
            : undefined;
          return { ...route, deptTime: dep, arriTime: arr };
        }),
      });
      await ctx.db.bus.update({
        where: {
          id: input.busId,
        },
        data: {
          stops: {
            connect: input.stopIds.map((stopId) => ({
              id: stopId,
            })),
          },
        },
      });
    }),
  getLastRouteOfBuses: publicProcedure
    .input(
      z
        .object({
          busId: z.number(),
          stopId: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const buses = input
        ? [{ id: input.busId }]
        : await ctx.db.bus.findMany({ select: { id: true } });
      return Promise.all(
        buses.map(async (bus) => {
          const lastRoute = await ctx.db.routes.findFirst({
            where: {
              busId: bus.id,
              ...(input?.stopId ? { stopId: input.stopId } : {}),
            },
            orderBy: {
              deptTime: "desc",
            },
          });
          return {
            busId: bus.id,
            lastRoute,
          };
        }),
      );
    }),
  getCurrentRouteOfBus: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = getCurrentTimeServer();
      return ctx.db.routes.findFirst({
        orderBy: {
          deptTime: "asc",
        },
        where: {
          busId: input.busId,
          deptTime: {
            gt: now.date,
          },
          bus: {
            isWeekend: now.isWeekend,
          },
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
      });
    }),
  getCurrentRouteOfBuses: publicProcedure
    .input(
      z.object({
        busIds: z.array(z.number()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = getCurrentTimeServer();
      console.log("current time:", now.date.getTime());

      return Promise.all(
        input.busIds.map(async (busId) => {
          const res = await ctx.db.routes.findFirst({
            orderBy: {
              deptTime: "asc",
            },
            where: {
              busId,
              deptTime: {
                gt: now.date,
              },
              bus: {
                isWeekend: now.isWeekend,
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
