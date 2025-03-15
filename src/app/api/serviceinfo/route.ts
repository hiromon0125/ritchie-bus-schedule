import { updateServiceInfo } from "./_util";

/**
 * This function is for vercel cron job. It is also protected by a secret key.
 * See https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
 * @param request
 * @returns
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  return updateServiceInfo();
}
