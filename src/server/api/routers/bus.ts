import type { Bus, PrismaClient } from "@prisma/client";
import SuperJSON from "superjson";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LONG_CACHE_TIME_OPTION, type ThenArg } from "../cacheUtil";

type UsersWithPosts = ThenArg<ReturnType<typeof getBusById>>;

function getBusById(
  prismaClient: PrismaClient,
  params: {
    id: number;
    includeStops: boolean;
    includeDays: boolean;
    isVisible?: boolean;
    throwIfNotFound: boolean;
  },
) {
  return prismaClient.bus
    .findUnique({
      where: {
        id: params.id,
        isVisible: params.isVisible,
      },
      include: {
        stops: params.includeStops,
        operatingDays: params.includeDays,
      },
    })
    .then((bus) => {
      if (params.throwIfNotFound && !bus) {
        throw new Error(`Bus with ID ${params.id} not found`);
      }
      return bus;
    });
}

export const busRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          isVisible: z.boolean().default(true).optional(),
        })
        .default({
          isVisible: true,
        }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `bus:all:${input.isVisible ? "vis" : "inv"}`;
      const cache: string | null = await ctx.cache.get(cacheKey);
      if (cache) {
        return SuperJSON.parse<Bus[]>(cache);
      }
      const buses = await ctx.db.bus.findMany({
        where: {
          isVisible: input.isVisible,
        },
        orderBy: {
          id: "asc",
        },
      });
      await ctx.cache.set(
        cacheKey,
        SuperJSON.stringify(buses),
        LONG_CACHE_TIME_OPTION,
      );
      return buses;
    }),
  getAllID: publicProcedure
    .input(
      z
        .object({
          isVisible: z.boolean().default(true).optional(),
        })
        .default({
          isVisible: true,
        }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `bus:all:id:${input.isVisible ? "vis" : "inv"}`;
      const cache: string | null = await ctx.cache.get(cacheKey);
      if (cache) {
        return SuperJSON.parse<number[]>(cache);
      }
      const busIds = ctx.db.bus
        .findMany({
          where: {
            isVisible: input.isVisible,
          },
          select: {
            id: true,
          },
        })
        .then((buses) => buses.map((bus) => bus.id));
      await ctx.cache.set(
        cacheKey,
        SuperJSON.stringify(busIds),
        LONG_CACHE_TIME_OPTION,
      );
      return busIds;
    }),
  getByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
        isVisible: z.boolean().default(true).optional(),
        includeStops: z.boolean().default(false),
        includeDays: z.boolean().default(false),
        throwIfNotFound: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `bus:${input.id}:${input.isVisible ? "vis" : "inv"}:${
        input.includeStops ? "stops" : "nostops"
      }:${input.includeDays ? "days" : "nodays"}`;
      const cache: string | null = await ctx.cache.get(cacheKey);
      if (cache) {
        return SuperJSON.parse<UsersWithPosts | null>(cache);
      }
      const bus = await getBusById(ctx.db, {
        id: input.id,
        includeStops: input.includeStops,
        includeDays: input.includeDays,
        isVisible: input.isVisible,
        throwIfNotFound: input.throwIfNotFound,
      });
      await ctx.cache.set(
        cacheKey,
        SuperJSON.stringify(bus),
        LONG_CACHE_TIME_OPTION,
      );
      return bus;
    }),
  addBus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        color: z.string(),
        isVisible: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.bus.create({
        data: input,
      });
      await ctx.cache.del("bus:all:*", `bus:${input.id}:*`);
    }),
  editBus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        tag: z.string().optional().nullable(),
        name: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        isVisible: z.boolean().optional(),
        operatingDays: z
          .array(
            z.object({
              day: z.date(),
              isWeekly: z.boolean(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.operatingDays != undefined) {
        const newOperatingDays = input.operatingDays;
        await ctx.db.busOperatingDay.deleteMany({
          where: {
            busId: input.id,
          },
        });
        await ctx.db.busOperatingDay.createMany({
          data: newOperatingDays.map((d) => ({ ...d, busId: input.id })),
        });
      }
      const res = await ctx.db.bus.update({
        where: {
          id: input.id,
        },
        data: { ...input, operatingDays: undefined },
      });
      await ctx.cache.del("bus:all:*", `bus:${input.id}:*`);
      return res;
    }),
  deleteBus: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.bus.delete({
        where: {
          id: input.id,
        },
      });
      await ctx.cache.del("bus:all:*", `bus:${input.id}:*`);
    }),
});
