import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const favoriteRouter = createTRPCRouter({
  getAllBus: privateProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    return ctx.db.favoriteBus.findMany({
      where: {
        userId: session.userId!,
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
      const session = ctx.session;
      return ctx.db.favoriteBus.create({
        data: {
          userId: session.userId!,
          busId: input.busId,
        },
      });
    }),
  getAllStop: privateProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    return ctx.db.favoriteStop.findMany({
      where: {
        userId: session.userId!,
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
      const session = ctx.session;
      return ctx.db.favoriteStop.create({
        data: {
          userId: session.userId!,
          stopId: input.stopId,
        },
      });
    }),
});
