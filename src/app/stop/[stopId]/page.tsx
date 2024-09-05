import Header from "@/header";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { StopList } from "~/app/_components/stopList";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { stopId: string } }) {
  const stopId = parseInt(params.stopId);
  if (Number.isNaN(stopId)) {
    throw TRPCClientError.from(Error(`Invalid ID (stop id: ${params.stopId})`));
  }
  const currentStop = await api.stops.getOneByID.query({ id: stopId });
  if (!currentStop) {
    throw TRPCClientError.from(Error(`Stop not found (stop id: ${stopId})`));
  }

  return (
    <div>
      <Header />
      <div>
        <h1 className="flex justify-center text-2xl font-bold sm:mb-2 sm:text-4xl">
          Stop {stopId} | {currentStop?.name}
        </h1>
        <StopList stopId={stopId} />
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}
