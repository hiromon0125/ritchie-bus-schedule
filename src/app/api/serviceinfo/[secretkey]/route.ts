import { env } from "process";
import { updateServiceInfo } from "../route";

async function handler({ params }: { params: Promise<{ secretkey: string }> }) {
  const { secretkey } = await params;
  if (secretkey !== env.NEXT_SERVICE_INFO_SECRET_KEY) {
    return new Response("Invalid secret key", { status: 401 });
  }
  return updateServiceInfo();
}

export { handler as GET, handler as POST };
