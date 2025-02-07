import { getCurrentTimeServer } from "@/util";
import _ from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

function resetDate(date: Date) {
  date.setUTCFullYear(1970, 0, 1);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

function isSameDate(date: Date, date2: Date) {
  return (
    date.getUTCFullYear() === date2.getUTCFullYear() &&
    date.getUTCMonth() === date2.getUTCMonth() &&
    date.getUTCDate() === date2.getUTCDate()
  );
}

export const routesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.routes.findMany()),
  getAllByBusId: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
        offset: z.number().default(0),
        windowsize: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          busId: input.busId,
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
        orderBy: {
          index: "asc",
        },
        skip: input.offset,
        take: input.windowsize,
      }),
    ),
  getAllByBusIdPaginated: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // id of the last fetched route
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const result = await ctx.db.routes.findMany({
        where: {
          busId: input.busId,
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
        orderBy: {
          index: "asc",
        },
        take: limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });
      let nextCursor: typeof input.cursor = null;
      if (result.length > limit) {
        nextCursor = result.pop()!.id;
      }
      return {
        data: result,
        nextCursor,
      };
    }),
  getAllByStopId: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
        isVisible: z.boolean().default(true),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          stopId: input.stopId,
          bus: {
            isVisible: input.isVisible,
          },
        },
      }),
    ),
  getAllByStopAndBus: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
        busId: z.number(),
        isVisible: z.boolean().default(true),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          stopId: input.stopId,
          busId: input.busId,
          bus: {
            isVisible: input.isVisible,
          },
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
            },
          });
          return {
            busId,
            route: res,
          };
        }),
      );
    }),
  isBusOperating: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        isVisible: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = getCurrentTimeServer();
      const res = await ctx.db.bus.findFirst({
        where: {
          id: input.busId,
          isVisible: input.isVisible,
        },
        include: {
          operatingDays: true,
        },
      });
      if (!res) return false;
      // TODO: Disable isWeekend for the future but support both for previous versions
      if (res.isWeekend != null) {
        return res.isWeekend === now.isWeekend;
      }
      const opDay = _.find(res.operatingDays, (opDay) => {
        const { day, isWeekly } = opDay;
        const nowDate = now.date;
        return (
          (isWeekly && day.getDay() === nowDate.getDay()) ||
          isSameDate(day, nowDate)
        );
      });
      return Boolean(opDay);
    }),
  isLastBusFinished: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      /**
       * This is used so that the client does not have to go up the pagination of the routes to check if the last bus has finished.
       * This is useful for when the bus is done for the day and the server guesses that the current route is undefined which the client
       * instead interprets that as the server is unable to fetch the current route thus manually checking on the client side by
       * going from the first route of the day to the very last. This creates a flickering effect and uses unnecessary resources.
       */
      const now = getCurrentTimeServer();
      const lastRoute = await ctx.db.routes.findFirst({
        orderBy: {
          deptTime: "desc",
        },
        where: {
          busId: input.busId,
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
      });
      return lastRoute
        ? lastRoute?.deptTime.getTime() < now.date.getTime()
        : false;
    }),
});
