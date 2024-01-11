import { TRPCClientError } from "@trpc/client";
import { api } from "../../../trpc/server";
import { BusStatusBig } from "../../_components/bus-status-string";
import ScrollToTopButton from "../../_components/scrollToTopBtn";
import StopInfo from "../../_components/stop-info";

export default async function Page({ params }: { params: { busId: string } }) {
  const busId = parseInt(params.busId);
  if (Number.isNaN(busId)) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  const bus = await api.bus.getByID.query({ id: busId });
  if (!bus) {
    throw TRPCClientError.from(Error(`Bus not found (bus id: ${busId})`));
  }
  const routes = await api.routes.getAllByBusId.query({ busId });
  const stops = await api.stops.getStopsByBusID.query({ busId });
  return (
    <>
      <BusStatusBig routes={routes} stops={stops} />
      <h2 className=" mb-2 text-4xl font-bold">Description</h2>
      <p className=" mb-8 text-xl">{bus.description}</p>
      <StopInfo routes={routes} stops={stops} bus={bus} />
      <ScrollToTopButton color={bus.color} />
    </>
  );
}