import { BusStatusBig } from "@/busStatusString";
import ScrollToTopButton from "@/scrollToTopBtn";
import StopInfo from "@/stopInfo";
import { TRPCClientError } from "@trpc/client";
import { api } from "t/server";

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
      <ScrollToTopButton color={bus.color} />
      <BusStatusBig routes={routes} stops={stops} bus={bus} />
      <h2 className=" text-2xl font-bold sm:mb-2 sm:text-4xl">Description</h2>
      <p className=" mb-4 text-lg sm:mb-8 sm:text-xl">{bus.description}</p>
      <StopInfo routes={routes} stops={stops} bus={bus} />
    </>
  );
}
