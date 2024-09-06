import type { MetadataRoute } from "next";
import { api } from "t/server";

const URL = "https://rit-bus.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buses = await api.bus.getAllID.query();
  const stops = await api.stops.getAllID.query();
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
  ];
}
