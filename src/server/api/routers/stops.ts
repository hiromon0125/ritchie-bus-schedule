import type { PrismaClient, Stops } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import type { ThenArg } from "../cacheUtil";

type StopsWithBuses = ThenArg<ReturnType<typeof getAllStop>>;
type StopWithBuses = ThenArg<ReturnType<typeof getStopById>>;

function getAllStop(
  prismaClient: PrismaClient,
  params: {
    includeRelatedBus: boolean;
    includeHiddenBus: boolean;
  },
) {
  return prismaClient.stops.findMany({
    include: {
      buses: params.includeRelatedBus
        ? params.includeHiddenBus
          ? true
          : {
              where: {
                isVisible: true,
              },
            }
        : false,
    },
    orderBy: {
      id: "asc",
    },
  });
}

function getStopById(
  prismaClient: PrismaClient,
  params: {
    id: number;
    includeHiddenBus: boolean;
  },
) {
  return prismaClient.stops.findUnique({
    where: {
      id: params.id,
    },
    include: {
      buses: params.includeHiddenBus
        ? true
        : {
            where: {
              isVisible: true,
            },
          },
    },
  });
}

export const stopsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          includeRelatedBus: z.boolean().optional(),
          includeHiddenBus: z.boolean().optional().default(false),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `stops:all:${input?.includeRelatedBus ? "rel" : "no"}:${
        input?.includeHiddenBus ? "hid" : "vis"
      }`;
      const cache = await ctx.cacheGet<StopsWithBuses>(cacheKey);
      if (cache) return cache;
      const stops = await getAllStop(ctx.db, {
        includeRelatedBus: !!input?.includeRelatedBus,
        includeHiddenBus: !!input?.includeHiddenBus,
      });
      return await ctx.cacheSetReturn(cacheKey, stops);
    }),
  getAllID: publicProcedure.query(async ({ ctx }) => {
    const cacheKey = `stops:all:id`;
    const cache = await ctx.cacheGet(cacheKey);
    if (cache) return cache;
    const stopIds = await ctx.db.stops.findMany({
      select: {
        id: true,
      },
    });
    return await ctx.cacheSetReturn(cacheKey, stopIds);
  }),
  getOneByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
        includeHiddenBus: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `stops:${input.id}:${
        input.includeHiddenBus ? "hid" : "vis"
      }`;
      const cache = await ctx.cacheGet<StopWithBuses>(cacheKey);
      if (cache) return cache;
      const res = await getStopById(ctx.db, {
        id: input.id,
        includeHiddenBus: input.includeHiddenBus,
      });
      return await ctx.cacheSetReturn(cacheKey, res);
    }),
  getStopIdsByBusID: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `stops:bus:${input.busId}`;
      const cache = await ctx.cacheGet<number[]>(cacheKey);
      if (cache) return cache;
      const stopIds =
        (await ctx.db.bus
          .findFirst({
            where: {
              id: input.busId,
            },
            select: {
              stops: {
                select: {
                  id: true,
                },
                orderBy: {
                  id: "asc",
                },
              },
            },
          })
          .then((bus) => bus?.stops.map((stop) => stop.id))) ?? null;
      return await ctx.cacheSetReturn(cacheKey, stopIds);
    }),
  getCoorOfAllStop: publicProcedure.query(async ({ ctx }) => {
    const cacheKey = `stops:coor`;
    const cache =
      await ctx.cacheGet<
        Pick<Stops, "id" | "name" | "tag" | "latitude" | "longitude">[]
      >(cacheKey);
    if (cache) return cache;
    const stops = await ctx.db.stops.findMany({
      select: {
        id: true,
        name: true,
        tag: true,
        latitude: true,
        longitude: true,
      },
    });
    return await ctx.cacheSetReturn(cacheKey, stops);
  }),
  addBusStop: privateProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        description: z.string(),
        tag: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        return ctx.db.stops.update({
          where: {
            id: input.id,
          },
          data: input,
        });
      } else {
        await ctx.db.stops.create({
          data: input,
        });
      }
      const caches = [`stops:all:*`, `stops:coor`, `stops:${input.id}:*`];
      await ctx.cache.del(...caches);
    }),
  editBusStop: privateProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        tag: z.string().optional(),
        description: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.stops.update({
        where: {
          id: input.id,
        },
        data: input,
      });
      const caches = [`stops:all:*`, `stops:coor`, `stops:${input.id}:*`];
      await ctx.cache.del(...caches);
    }),
  deleteBusStop: privateProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.stops.delete({
        where: input,
      });
      const caches = [`stops:all:*`, `stops:coor`, `stops:${input.id}:*`];
      await ctx.cache.del(...caches);
    }),
});
