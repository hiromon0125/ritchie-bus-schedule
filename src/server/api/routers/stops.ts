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
  getStopsByBusID: publicProcedure
    .input(
      z.object({
        busId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const routes = await ctx.db.routes.findMany({
        where: {
          busId: input.busId,
        },
        distinct: ["stopId"],
        select: {
          stopId: true,
        },
      });
      return ctx.db.stops
        .findMany({
          where: {
            id: {
              in: routes.map((route) => route.stopId),
            },
          },
        })
        .then((stops) => {
          return routes.map((route) => {
            const stop = stops.find((stop) => stop.id === route.stopId);
            if (!stop) {
              throw new Error("Stop not found");
            }
            return stop;
          });
        });
    }),
});
