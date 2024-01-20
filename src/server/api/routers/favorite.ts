import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

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
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.favoriteBus.create({
        data: {
          userId: ctx.user.id,
          busId: input.busId,
        },
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
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.favoriteStop.create({
        data: {
          userId: ctx.user.id,
          stopId: input.stopId,
        },
      });
    }),
});
