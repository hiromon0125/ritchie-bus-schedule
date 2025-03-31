import { api } from "t/server";
import { z } from "zod";
import { env } from "../../../env";

const SERVICE_INFO_SCHEMA = z.object({
  targetUrl: z.string(),
  data: z.array(
    z.object({
      title: z.string(),
      buses: z.array(z.string()),
      content: z.string(),
      hash: z.string(),
      timestamp: z.number(), // Unix timestamp
      isNew: z.boolean(),
    }),
  ),
});

export async function updateServiceInfo() {
  if (env.SERVICE_INFO_LINK === undefined) {
    return new Response("Service info link not set", { status: 500 });
  } else if (env.SERVICE_INFO_SECRET_KEY === undefined) {
    return new Response("Service info secret key not set", { status: 500 });
  }
  const url = new URL(env.SERVICE_INFO_LINK);
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "X-Secret-Key": env.SERVICE_INFO_SECRET_KEY,
    },
  });
  if (!data.ok) {
    return new Response(
      `Failed to fetch service info: ${await (await data.blob()).text()}`,
      {
        status: 500,
      },
    );
  }
  const json = (await data.json()) as object;
  const parsed = SERVICE_INFO_SCHEMA.safeParse(json);
  if (!parsed.success) {
    return new Response("Invalid service info", { status: 500 });
  }
  try {
    const res = await api.serviceinfo.createServiceInfo(parsed.data.data);
    const rejectedItems = res.filter((r) => r.status === "rejected");
    if (rejectedItems.length > 0) {
      return new Response(
        `Failed to create service info: ${rejectedItems.map((r) => r.reason as unknown).join(", ")}`,
        {
          status: 500,
        },
      );
    }
    return new Response(`Service info successfully updated: ${res.length}`, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(`Failed to update service info: ${e as Error}`, {
      status: 500,
    });
  }
}
