import { type NextRequest } from "next/server";
import { env } from "process";
import { updateServiceInfo } from "../_util";

async function handler(
  _: NextRequest,
  { params }: { params: Promise<{ secretkey: string }> },
) {
  const { secretkey } = await params;
  if (secretkey !== env.NEXT_SERVICE_INFO_SECRET_KEY) {
    return new Response("Invalid secret key", { status: 401 });
  }
  return updateServiceInfo();
}

export { handler as GET, handler as POST };
