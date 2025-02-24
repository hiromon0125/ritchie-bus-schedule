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
        includeDays: z.boolean().default(false),
        throwIfNotFound: z.boolean().default(false),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.bus
        .findUnique({
          where: {
            id: input.id,
            isVisible: input.isVisible,
          },
          include: {
            stops: input.includeStops,
            operatingDays: input.includeDays,
          },
        })
        .then((bus) => {
          if (input.throwIfNotFound && !bus) {
            throw new Error(`Bus with ID ${input.id} not found`);
          }
          return bus;
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
      return await ctx.db.bus.update({
        where: {
          id: input.id,
        },
        data: { ...input, operatingDays: undefined },
      });
    }),
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
