import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const stopsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.stops.findMany()),
});
