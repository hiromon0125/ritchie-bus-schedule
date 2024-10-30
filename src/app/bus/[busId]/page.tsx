import { BusStatusBig } from "@/busStatusString";
import ScrollToTopButton from "@/scrollToTopBtn";
import StopInfo from "@/stopInfo";
import type { Bus, Stops } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { track } from "@vercel/analytics/server";
import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { api } from "t/server";

type Props = { params: { busId: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
  await track("Bus Page Viewed", { busId: bus.id });
  return {
    title: `Ritche's Bus Schedule | ${bus.id} ${bus.name}`,
    description: bus.description,
  };
}

export default async function Page({ params }: Props) {
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
  const stops = (await api.stops.getStopsByBusID.query({ busId })) ?? [];
  return (
    <>
      <ScrollToTopButton color={bus.color} />
      <Suspense fallback={<p>Loading...</p>}>
        <BusStatus bus={bus} stops={stops} />
      </Suspense>
      <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-4xl">
        Description
      </h2>
      <p className=" mb-4 xs:text-lg sm:mb-8 sm:text-xl">{bus.description}</p>
      <StopInfo stops={stops} bus={bus} />
      <div className=" rounded-lg border-2 border-gray-600 p-3">
        <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-3xl">
          Rate Page
        </h2>
        <p>Rate this bus!</p>
        <div className=" flex w-full flex-row justify-end">
          <Link
            href="https://forms.gle/7ooRfsDzmKvHnnZ76"
            className=" rounded-md bg-blue-600 p-3 text-white"
          >
            Yes
          </Link>
        </div>
      </div>
    </>
  );
}

async function BusStatus({ bus, stops }: { bus: Bus; stops: Stops[] }) {
  const currentRoute = await api.routes.getCurrentRouteOfBus.query({
    busId: bus.id,
  });
  const lastRoute = await api.routes.getLastRouteOfBuses
    .query({ busId: bus.id })
    .then((data) => data[0]?.lastRoute ?? null);
  return (
    <BusStatusBig
      stops={stops}
      bus={bus}
      fetchedRoute={{ serverGuess: currentRoute, lastRoute }}
    />
  );
}
