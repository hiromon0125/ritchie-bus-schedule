import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const stopsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.stops.findMany()),
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
});
