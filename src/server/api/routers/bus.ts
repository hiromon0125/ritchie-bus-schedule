import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const busRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.bus.findMany()),
});
