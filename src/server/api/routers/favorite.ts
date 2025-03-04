import type { PartialKey } from "@/types";
import type { FavoriteBus, FavoriteStop } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  userProcedure,
} from "~/server/api/trpc";

function isValidPriority<T extends { priority: number }>(
  list: PartialKey<T, "priority">[],
): list is T[] {
  return (
    _.find(list, (bus) => bus.priority === undefined) === undefined &&
    new Set(list.map((b) => b.priority)).size === list.length
  );
}

export const favoriteRouter = createTRPCRouter({
  getAllBus: userProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user == undefined) {
      return [];
    }
    return ctx.db.favoriteBus.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        priority: "asc",
      },
    });
  }),
  addBus: privateProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lastBus = await ctx.db.favoriteBus.findFirst({
        orderBy: {
          priority: "desc",
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
      const newPriority = lastBus != null ? lastBus.priority + 1 : 0;
      return ctx.db.favoriteBus.create({
        data: {
          userId: ctx.session.user.id,
          busId: input.busId,
          priority: newPriority,
        },
      });
    }),
  reorderBus: privateProcedure
    .input(z.object({ priority: z.record(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const buses = await ctx.db.favoriteBus.findMany({
        where: {
          userId: ctx.session.user.id,
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
          userId: ctx.session.user.id,
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
          userId: ctx.session.user.id,
        },
      });
      const { count } = await ctx.db.favoriteBus.deleteMany({
        where: {
          userId: ctx.session.user.id,
          busId: input.busId,
        },
      });
      const newBusesList = buses
        .filter((bus) => bus.busId !== input.busId)
        .map((bus, i) => ({
          ...bus,
          priority: i,
        }));
      if (newBusesList.length != 0) {
        await Promise.all(
          newBusesList.map((bus) =>
            ctx.db.favoriteBus.update({
              where: {
                id: bus.id,
              },
              data: {
                priority: bus.priority,
              },
            }),
          ),
        );
      }
      return count;
    }),
  getAllStop: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.favoriteStop.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  addStop: privateProcedure
    .input(
      z.object({
        stopId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lastStop = await ctx.db.favoriteStop.findFirst({
        orderBy: {
          priority: "desc",
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
      const newPriority = lastStop != null ? lastStop.priority + 1 : 0;
      return ctx.db.favoriteStop.create({
        data: {
          userId: ctx.session.user.id,
          stopId: input.stopId,
          priority: newPriority,
        },
      });
    }),
  reorderStop: privateProcedure
    .input(z.object({ priority: z.record(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const stops = await ctx.db.favoriteStop.findMany({
        where: {
          userId: ctx.session.user.id,
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
          userId: ctx.session.user.id,
        },
        data: newStopList,
      });
    }),
  delStop: privateProcedure
    .input(z.object({ stopId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const stops = await ctx.db.favoriteStop.findMany({
        orderBy: {
          priority: "asc",
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
      const { count } = await ctx.db.favoriteStop.deleteMany({
        where: {
          userId: ctx.session.user.id,
          stopId: input.stopId,
        },
      });
      const newStopsList = stops
        .filter((stop) => stop.id !== input.stopId)
        .map((bus, i) => ({
          ...bus,
          priority: i,
        }));
      if (newStopsList.length != 0) {
        await Promise.all(
          newStopsList.map((stop) =>
            ctx.db.favoriteStop.update({
              where: {
                id: stop.id,
              },
              data: {
                priority: stop.priority,
              },
            }),
          ),
        );
      }
      return count;
    }),
});
