import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .query(({ ctx, input }) =>
      ctx.db.bus.findMany({
        where: {
          isVisible: input.isVisible,
        },
        orderBy: {
          id: "asc",
        },
      }),
    ),
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
    .query(({ ctx, input }) =>
      ctx.db.bus
        .findMany({
          where: {
            isVisible: input.isVisible,
          },
          select: {
            id: true,
          },
        })
        .then((buses) => buses.map((bus) => bus.id)),
    ),
  getByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
        isVisible: z.boolean().default(true).optional(),
        includeStops: z.boolean().default(false),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.bus.findUnique({
        where: {
          id: input.id,
          isVisible: input.isVisible,
        },
        include: {
          stops: input.includeStops,
        },
      }),
    ),
  getAllByStopID: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.stops.findUnique({
        select: {
          buses: true,
        },
        where: {
          id: input.stopId,
        },
      }),
    ),
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
    .mutation(({ ctx, input }) =>
      ctx.db.bus.create({
        data: input,
      }),
    ),
  editBus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        color: z.string(),
        isVisible: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.bus.update({
        where: {
          id: input.id,
        },
        data: input,
      }),
    ),
  deleteBus: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) =>
      ctx.db.bus.delete({
        where: {
          id: input.id,
        },
      }),
    ),
});
