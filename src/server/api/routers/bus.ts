import _ from "lodash";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const busRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.bus.findMany().then((buses) => _.orderBy(buses, ["id"], ["asc"])),
  ),
  getAllID: publicProcedure.query(({ ctx }) =>
    ctx.db.bus.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    }),
  ),
  getByID: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.bus.findUnique({
        where: {
          id: input.id,
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
        isWeekend: z.boolean(),
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
