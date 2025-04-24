import type { NextRequest } from "next/server";
import { env } from "../../../env";
import { updateServiceInfo } from "./_util";

export const dynamic = "force-dynamic";

/**
 * This function is for vercel cron job. It is also protected by a secret key.
 * See https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  if (!env.CRON_SECRET) {
    return new Response("Environmental variable not set.", {
      status: 500,
    });
  }
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  return updateServiceInfo();
}
