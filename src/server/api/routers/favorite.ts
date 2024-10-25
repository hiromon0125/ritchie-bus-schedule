import type { FavoriteBus, FavoriteStop } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import type { PartialKey } from "../../../app/_components/types";

function isValidPriority<T extends { priority: number }>(
  list: PartialKey<T, "priority">[],
): list is Array<T> {
  return (
    _.find(list, (bus) => bus.priority === undefined) === undefined &&
    new Set(list.map((b) => b.priority)).size === list.length
  );
}

export const favoriteRouter = createTRPCRouter({
  getAllBus: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.favoriteBus.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  addBus: privateProcedure
    .input(
      z.object({
        busId: z.number(),
        priority: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.favoriteBus.create({
        data: {
          userId: ctx.user.id,
          busId: input.busId,
          priority: input.priority,
        },
      });
    }),
  reorderBus: privateProcedure
    .input(z.object({ priority: z.record(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const buses = await ctx.db.favoriteBus.findMany({
        where: {
          userId: ctx.user.id,
        },
      });
      const newBusesList = buses.map((bus) => ({
        ...bus,
        priority: input.priority[bus.id.toString()],
      }));
      if (!isValidPriority<FavoriteBus>(newBusesList)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid priority",
        });
      }
      return ctx.db.favoriteBus.updateMany({
        where: {
          userId: ctx.user.id,
        },
        data: newBusesList,
      });
    }),
  delBus: privateProcedure
    .input(z.object({ busId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const buses = await ctx.db.favoriteBus.findMany({
        orderBy: {
          priority: "asc",
        },
        where: {
          userId: ctx.user.id,
        },
      });
      await ctx.db.favoriteBus.deleteMany({
        where: {
          userId: ctx.user.id,
          busId: input.busId,
        },
      });
      const newBusesList = buses
        .filter((bus) => bus.id !== input.busId)
        .map((bus, i) => ({
          ...bus,
          priority: i,
        }));
      return ctx.db.favoriteBus.updateMany({
        where: {
          userId: ctx.user.id,
        },
        data: newBusesList,
      });
    }),
  getAllStop: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.favoriteStop.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  addStop: privateProcedure
    .input(
      z.object({
        stopId: z.number(),
        priority: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.favoriteStop.create({
        data: {
          userId: ctx.user.id,
          stopId: input.stopId,
          priority: input.priority,
        },
      });
    }),
  reorderStop: privateProcedure
    .input(z.object({ priority: z.record(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const stops = await ctx.db.favoriteStop.findMany({
        where: {
          userId: ctx.user.id,
        },
      });
      const newStopList = stops.map((stop) => ({
        ...stop,
        priority: input.priority[stop.id.toString()],
      }));
      if (!isValidPriority<FavoriteStop>(newStopList)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid priority",
        });
      }
      return ctx.db.favoriteBus.updateMany({
        where: {
          userId: ctx.user.id,
        },
        data: newStopList,
      });
    }),
  delStop: privateProcedure
    .input(z.object({ stopId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const buses = await ctx.db.favoriteStop.findMany({
        orderBy: {
          priority: "asc",
        },
        where: {
          userId: ctx.user.id,
        },
      });
      await ctx.db.favoriteStop.deleteMany({
        where: {
          userId: ctx.user.id,
          stopId: input.stopId,
        },
      });
      const newBusesList = buses
        .filter((bus) => bus.id !== input.stopId)
        .map((bus, i) => ({
          ...bus,
          priority: i,
        }));
      return ctx.db.favoriteBus.updateMany({
        where: {
          userId: ctx.user.id,
        },
        data: newBusesList,
      });
    }),
});
