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
          includeHiddenBus: z.boolean().optional().default(false),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      ctx.db.stops.findMany({
        include: {
          buses: input?.includeRelatedBus
            ? input.includeHiddenBus
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
        includeHiddenBus: z.boolean().optional().default(false),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.stops.findUnique({
        where: {
          id: input.id,
        },
        include: {
          buses: input.includeHiddenBus
            ? true
            : {
                where: {
                  isVisible: true,
                },
              },
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
  getStopIdsByBusID: publicProcedure
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
        .then((bus) => bus?.stops.map((stop) => stop.id));
    }),
  getCoorOfAllStop: publicProcedure.query(({ ctx }) =>
    ctx.db.stops.findMany({
      select: {
        id: true,
        name: true,
        tag: true,
        latitude: true,
        longitude: true,
      },
    }),
  ),
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
