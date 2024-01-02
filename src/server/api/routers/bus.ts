import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const busRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.bus.findMany()),
  getAllID: publicProcedure.query(({ ctx }) =>
    ctx.db.bus.findMany({
      select: {
        id: true,
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
});
