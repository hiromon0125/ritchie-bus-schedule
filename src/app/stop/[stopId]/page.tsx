import Header from "@/header";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { StopList } from "~/app/_components/stopList";
import { api } from "~/trpc/server";

export default async function Page({ params }: { params: { stopId: string } }) {
  const stopId = parseInt(params.stopId);
  const currentStop = await api.stops.getOneByID.query({ id: stopId });

  if (Number.isNaN(stopId)) {
    throw TRPCClientError.from(
      Error(`Stop not found (stop id: ${params.stopId})`),
    );
  }

  return (
    <div>
      <Header />
      <div>
        <h1 className="text-2xl font-bold sm:mb-2 sm:text-4xl flex justify-center">Stop {stopId} | {currentStop?.name}</h1>
        <StopList stopId={stopId} />
        <Link href="/">Back to home</Link>
      </div>
    </div>
  );
}