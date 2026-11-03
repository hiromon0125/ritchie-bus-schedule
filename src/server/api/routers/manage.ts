import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const manageRouter = createTRPCRouter({
  isManager: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.manager.findFirst({
        where: input,
      }),
    ),
  getAllManagers: adminProcedure.query(({ ctx }) => ctx.db.manager.findMany()),
  flushAllCache: adminProcedure.input(z.number()).mutation(async ({ ctx }) => {
    const allKeys = await ctx.cache.keys("*");
    const result = await ctx.cache.del(...allKeys);
    return result;
  }),
});
