import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const routesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.db.routes.findMany()),
  getAllByBusId: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          busId: input.busId,
        },
      }),
    ),
  getAllByStopId: publicProcedure
    .input(
      z.object({
        stopId: z.number(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.routes.findMany({
        where: {
          stopId: input.stopId,
        },
      }),
    ),
  addRoutes: privateProcedure
    .input(
      z.array(
        z.object({
          busId: z.number(),
          stopId: z.number(),
          index: z.number(),
          deptTime: z.date(),
          arriTime: z.date().optional(),
        }),
      ),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.routes.createMany({
        data: input,
      });
    }),
});
