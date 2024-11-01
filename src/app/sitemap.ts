import type { MetadataRoute } from "next";
import { api } from "t/server";

const URL = "https://rit-bus.app";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const busIDs = await api.bus.getAllID.query();
  const stops = await api.stops.getAllID.query();
  return [
    {
      url: `${URL}/about`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...busIDs.map(
      (busID) =>
        ({
          url: `${URL}/bus/${busID}`,
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
