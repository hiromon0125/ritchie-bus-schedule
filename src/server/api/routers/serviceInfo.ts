import { type Bus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const serviceInfoRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          includeRelatedBus: z.boolean().optional(),
          busId: z.number().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      ctx.db.serviceInformation
        .findMany({
          where: {
            busId: input?.busId,
          },
          include: { bus: input?.includeRelatedBus ?? false },
          orderBy: {
            createdAt: "desc",
          },
        })
        .then((serviceInfo) => {
          return serviceInfo.reduce(
            (acc, info) => {
              const ind = acc.findIndex((i) => i.hash === info.hash);
              if (ind != -1) {
                if (input?.includeRelatedBus) acc[ind]!.buses!.push(info.bus);
                acc[ind]!.busIds.push(info.busId);
                return acc;
              }
              acc.push({
                title: info.title,
                content: info.content,
                hash: info.hash,
                busIds: [info.busId],
                ...(input?.includeRelatedBus ? { buses: [info.bus] } : {}),
                createdAt: info.createdAt,
                updatedAt: info.updatedAt,
              });
              return acc;
            },
            [] as {
              title: string;
              content: string;
              hash: string;
              busIds: number[];
              buses?: Bus[];
              createdAt: Date;
              updatedAt: Date;
            }[],
          );
        }),
    ),
  getCount: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.serviceInformation
      .findMany({
        distinct: "hash",
      })
      .then((l) => l.length);
  }),
  createServiceInfo: publicProcedure
    .input(
      z.array(
        z.object({
          title: z.string(),
          buses: z.array(z.string()),
          content: z.string(),
          hash: z.string(),
          timestamp: z.number(), // Unix timestamp
          isNew: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const busNames = input.map((i) => i.buses).flat();
      const busIds = await ctx.db.bus
        .findMany({
          where: {
            name: {
              in: busNames.map((name) => name.replace(/^\d+\s+/, "")),
            },
          },
          select: {
            name: true,
            id: true,
          },
        })
        .then((buses) =>
          buses.reduce(
            (acc, bus) => {
              acc[bus.name] = bus.id;
              return acc;
            },
            {} as Record<string, number>,
          ),
        );
      const mut = await Promise.allSettled(
        input
          .map((serviceInfo) =>
            serviceInfo.buses.map(async (busName) => {
              const busId = busIds[busName.replace(/^\d+\s+/, "")];
              if (busId === undefined) {
                console.error(
                  `Bus ${busName.replace(/^\d+\s+/, "")} not found for service info with hash ${serviceInfo.hash}`,
                );
                return;
              }
              const newInfo = {
                title: serviceInfo.title,
                content: serviceInfo.content,
                hash: serviceInfo.hash,
                createdAt: new Date(serviceInfo.timestamp),
                busId,
              };
              return await ctx.db.serviceInformation.upsert({
                where: {
                  hash_busId: {
                    hash: serviceInfo.hash,
                    busId: busId,
                  },
                },
                create: newInfo,
                update: newInfo,
              });
            }),
          )
          .flat(),
      );
      const errors = mut.filter((i) => i.status === "rejected");
      if (errors.length > 0) {
        throw new Error(
          "Failed to create service info: " +
            errors.reduce((acc, err) => acc + "\n" + err.reason, ""),
        );
      }
      // Remove any old service info that is not in the new data
      await ctx.db.serviceInformation.deleteMany({
        where: {
          hash: {
            notIn: input.map((i) => i.hash),
          },
        },
      });

      return mut;
    }),
});
