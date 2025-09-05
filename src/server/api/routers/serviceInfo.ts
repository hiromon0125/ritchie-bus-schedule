import type { Bus, ServiceInformation } from "@prisma/client";
import _ from "lodash";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type MergedServiceInfo = Omit<ServiceInformation, "busId"> & {
  buses?: Bus[];
  busIds: Bus["id"][];
};

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
    .query(async ({ ctx, input }) => {
      const savedServiceInfo = await ctx.db.serviceInformation
        .findMany({
          where: {
            busId: input?.busId,
          },
          include: { bus: input?.includeRelatedBus ?? false },
          orderBy: {
            createdAt: "desc",
          },
        })
        .then((serviceInfo) => _.groupBy(serviceInfo, "hash"));
      const serviceInfos = Object.entries(savedServiceInfo).map(([_, info]) => {
        const buses = info
          .map((i) => ({ bus: i.bus, id: i.busId }))
          .reduce(
            (acc, bus) => {
              acc.buses.push(bus.bus);
              acc.busIds.push(bus.id);
              return acc;
            },
            { buses: [], busIds: [] } as {
              buses: (Bus | null)[];
              busIds: (Bus["id"] | null)[];
            },
          );
        const fin: Partial<(typeof info)[0]> & MergedServiceInfo = {
          ...info[0]!,
          busIds: buses.busIds.filter((i) => i != null),
          buses: buses.buses.filter((i) => i != null),
        };
        delete fin.bus;
        if (!input?.includeRelatedBus) delete fin.buses;
        return fin as MergedServiceInfo;
      });
      return serviceInfos;
    }),
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
      if (input.every((i) => !i.isNew)) {
        return await Promise.allSettled([
          ctx.db.serviceInformation
            .updateMany({
              data: {
                isNew: false,
              },
            })
            .then((res) => res.count),
        ]);
      }
      const busNames = input.map((i) => i.buses).flat();
      const busNamesToSearch = [
        ...busNames.map((name) => name.replace(/^\d+\s+/, "")),
        ...busNames.map((name) => `${name.replace(/^\d+\s+/, "")} Shuttle`), // Campus Connection Shuttle can be mentioned as Campus Connection
      ];
      // New service info reference the bus id directly
      const rawBusNumber = _.uniq(
        input
          .map((i) => i.buses.map((b) => z.number().safeParse(b.trim())))
          .flat()
          .filter((b) => b.success)
          .map((b) => b.data),
      );
      const busIds = await ctx.db.bus
        .findMany({
          where: {
            OR: [
              {
                name: {
                  in: busNamesToSearch,
                },
              },
              {
                id: {
                  in: rawBusNumber,
                },
              },
            ],
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
              acc[bus.id.toString()] = bus.id; // Add the raw number as a string
              if (bus.name.endsWith(" Shuttle"))
                acc[bus.name.replace(" Shuttle", "")] = bus.id; // Add the name without Shuttle
              return acc;
            },
            {} as Record<string, number>,
          ),
        );

      const mut = await Promise.allSettled([
        ctx.db.serviceInformation.createManyAndReturn({
          data: input.map((serviceInfo) => ({
            ...serviceInfo,
            buses: undefined,
            busIds: serviceInfo.buses.map((busName) => {
              let busId = busIds[busName.trim()];
              if (busId == undefined) {
                let sanitizedBusName = busName.replace(/^\d+\s+/, "").trim();
                if (sanitizedBusName.endsWith("shuttle"))
                  sanitizedBusName = sanitizedBusName.replace("shuttle", "");
                busId = busIds[busName.replace(/^\d+\s+/, "")];
              }
              return busId;
            }),
          })),
        }),
        ctx.db.serviceInformation
          .deleteMany({
            where: {
              hash: {
                notIn: input.map((i) => i.hash),
              },
            },
          })
          .then((res) => res.count),
      ]);

      return mut;
    }),
});
