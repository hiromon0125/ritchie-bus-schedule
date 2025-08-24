import { getCurrentTimeServer, NEWYORK_TIMEZONE } from "@/util";
import { type PrismaClient, type Routes } from "@prisma/client";
import _ from "lodash";
import { DateTime } from "luxon";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { LONG_CACHE_TIME_OPTION, type ThenArg } from "../cacheUtil";
function resetDate(date: Date) {
  date.setUTCFullYear(1970, 0, 1);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}

async function getRoutePaginated(
  db: PrismaClient,
  input: {
    busId: number;
    stopId?: number;
    limit: number;
    cursor?: { id: number; index: number } | null;
  },
) {
  const res = await db.routes.findMany({
    where: {
      busId: input.busId,
      ...(input.stopId ? { stopId: input.stopId } : {}),
    },
    orderBy: {
      index: "asc",
    },
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor.id } : undefined,
  });
  let nextCursor: typeof input.cursor;
  if (res.length > input.limit) {
    const curs = res.pop()!;
    nextCursor = {
      id: curs.id,
      index: curs.index,
    };
  }
  return {
    data: res,
    nextCursor,
  };
}
type ReturnGetRoutePaginated = ThenArg<ReturnType<typeof getRoutePaginated>>;

export const routesRouter = createTRPCRouter({
  getAllByBusId: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `routes:${input.busId}:${input.stopId ?? "undStopId"}`;
      const cached = await ctx.cacheGet<Routes[]>(cacheKey);
      if (cached) return cached;
      const res = await ctx.db.routes.findMany({
        where: {
          busId: input.busId,
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
        orderBy: {
          index: "asc",
        },
      });
      return await ctx.cacheSetReturn(cacheKey, res, LONG_CACHE_TIME_OPTION);
    }),
  getAllByBusIdPaginated: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z
          .object({
            id: z.number(),
            index: z.number(),
          })
          .nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `routes:${input.busId}:${input.stopId ?? "undStopId"}:${input.cursor?.id ?? "undCursor"}:${input.limit}`;
      const cached = await ctx.cacheGet<ReturnGetRoutePaginated>(cacheKey);
      if (cached) return cached;
      const result = await getRoutePaginated(ctx.db, input);
      return await ctx.cacheSetReturn<ReturnGetRoutePaginated>(
        cacheKey,
        result,
        LONG_CACHE_TIME_OPTION,
      );
    }),
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
      const [, stops] = await Promise.all([
        ctx.db.routes.deleteMany({
          where: {
            busId: input.busId,
          },
        }),
        ctx.db.stops.findMany({
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
        }),
      ]);
      const cachesToDel = [
        `routes:${input.busId}:*`,
        `stops:bus:${input.busId}`,
        `stops:all:rel:*`,
      ];
      const keys = await Promise.all(cachesToDel.map((k) => ctx.cache.keys(k)));
      return Promise.all([
        // Disconnect the bus from the stops that are not in the new data
        ...stops.map(async (stop) => {
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
        // Insert the new data
        ctx.db.routes.createMany({
          data: input.routes.map((route) => {
            const dep = resetDate(route.deptTime);
            const arr = route.arriTime ? resetDate(route.arriTime) : undefined;
            return { ...route, deptTime: dep, arriTime: arr };
          }),
        }),
        ctx.db.bus.update({
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
        }),
        // Reset cache
        async () => {
          const delKeys = keys.flat();
          if (delKeys.length === 0) return;
          await ctx.cache.del(...delKeys);
        },
      ]);
    }),
  getCurrentRouteOfBus: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.routes.findFirst({
        orderBy: {
          deptTime: "asc",
        },
        where: {
          busId: input.busId,
          deptTime: {
            gt: getCurrentTimeServer().dtUTC.toJSDate(),
          },
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
      });
      return res;
    }),
  isBusOperating: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        isVisible: z.boolean().default(true),
      }),
    )
    .query(async ({ ctx, input }) => {
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
      const opDay = _.find(res.operatingDays, (opDay) => {
        const { day: dayUTC, isWeekly } = opDay;
        const nowDate = getCurrentTimeServer().nowWeekday;
        const day = DateTime.fromJSDate(dayUTC, {
          zone: NEWYORK_TIMEZONE,
        });
        return (
          (isWeekly && day.weekday === nowDate) ||
          day.diff(DateTime.utc(), "days").days === 0
        );
      });
      return !!opDay;
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
      const lastRoute = await ctx.db.routes.findFirst({
        orderBy: {
          deptTime: "desc",
        },
        where: {
          busId: input.busId,
          stopId: input.stopId,
        },
      });
      if (!lastRoute) return false;
      const lastRouteDate = lastRoute.deptTime;
      const nowDateTime = getCurrentTimeServer().dtUTC;
      const lastRouteUTCDateTime = DateTime.fromJSDate(lastRouteDate, {
        zone: "utc",
      });

      return nowDateTime > lastRouteUTCDateTime;
    }),
  getFirstRouteIndex: publicProcedure
    .input(
      z.object({
        busId: z.number(),
        stopId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // This is used to determine the first route index by bus id and stop id
      // specifically both as it is not always zero.
      const res = await ctx.db.routes.findFirst({
        where: {
          busId: input.busId,
          ...(input.stopId ? { stopId: input.stopId } : {}),
        },
        orderBy: {
          index: "asc",
        },
      });
      return res?.index ?? 0;
    }),
});
