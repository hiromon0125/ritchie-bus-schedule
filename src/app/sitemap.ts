import type { MetadataRoute } from "next";
import { db } from "../server/db";

const URL = "https://rit-bus.app";
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buses = await db.bus.findMany({
    where: { isVisible: true },
    select: { id: true },
  });
  const stops = await db.stops.findMany({
    where: { buses: { some: { isVisible: true } } },
    select: { id: true },
  });

  return [
    {
      url: `${URL}/about`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...buses.map(
      (bus) =>
        ({
          url: `${URL}/bus/${bus.id}`,
          changeFrequency: "monthly",
          priority: 0.5,
        }) as const,
    ),
    ...stops.map(
      (stop) =>
        ({
          url: `${URL}/stop/${stop.id}`,
          changeFrequency: "monthly",
          priority: 0.5,
        }) as const,
    ),
    {
      url: `${URL}/buses`,
      changeFrequency: "monthly",
      priority: 1.0,
    } as const,
    {
      url: `${URL}/stops`,
      changeFrequency: "monthly",
      priority: 1.0,
    } as const,
    {
      url: `${URL}/pp`,
      changeFrequency: "monthly",
      priority: 1.0,
    } as const,
    {
      url: `${URL}/`,
      changeFrequency: "daily",
      priority: 1.0,
    } as const,
  ];
}
