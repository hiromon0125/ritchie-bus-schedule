import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const stopsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          includeRelatedBus: z.boolean().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      ctx.db.stops.findMany({
        include: { buses: input?.includeRelatedBus ?? false },
        orderBy: {
          id: "asc",
        },
      }),
    ),
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
        include: {
          buses: true,
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
      return ctx.db.bus
        .findFirst({
          where: {
            id: input.busId,
          },
          select: {
            stops: true,
          },
        })
        .then((bus) => bus?.stops);
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
      return ctx.db.stops.update({
        where: {
          id: input.id,
        },
        data: input,
      });
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
