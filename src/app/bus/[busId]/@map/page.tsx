import StopMap from "@/Map";
import { TRPCClientError } from "@trpc/client";
import { api } from "t/server";

export default async function Map(props: {
  params: Promise<{ busId: string }>;
}) {
  const params = await props.params;
  const bus = await api.bus.getByID({ id: parseInt(params.busId) });

  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  return <StopMap stops={bus.stops} />;
}
