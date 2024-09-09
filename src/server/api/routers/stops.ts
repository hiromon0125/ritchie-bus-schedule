import { type Stops } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const stopsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.stops.findMany()),
  getAllID: publicProcedure.query(({ ctx }) =>
    ctx.db.stops.findMany({
      select: {
        id: true,
      },
    }),
  ),
  getOneByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.stops.findUnique({
        where: {
          id: input.id,
        },
      }),
    ),
  getStopsByBusID: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        ctx.db.bus
          .findFirst({
            where: {
              id: input.busId,
            },
            select: {
              stops: true,
            },
          })
          // I don't fucking know why I need this.
          // The typeserver is good enough to know what type this is,
          // but eslint is yelling at me for no reason.
          .then((bus) => bus?.stops as Stops[] | undefined)
      );
    }),
  addBusStop: privateProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
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
    }),
  deleteBusStop: privateProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.stops.delete({
        where: input,
      }),
    ),
});
