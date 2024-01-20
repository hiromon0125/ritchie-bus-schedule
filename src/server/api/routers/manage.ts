import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

export const manageRouter = createTRPCRouter({
  isManager: privateProcedure
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
  getAllManagers: privateProcedure.query(({ ctx }) =>
    ctx.db.manager.findMany(),
  ),
});
