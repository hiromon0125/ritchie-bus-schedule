import { MapSkeleton } from "@/busPageLoaders";
import StopMap from "@/Map";
import { TRPCClientError } from "@trpc/client";
import { Suspense } from "react";
import { api } from "t/server";

export default async function Map(props: {
  params: Promise<{ busId: string }>;
}) {
  const params = await props.params;
  const bus = await api.bus.getByID.query({ id: parseInt(params.busId) });

  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }
  return (
    <div className=" relative flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] bg-slate-200 p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:min-h-0 md:max-w-screen-lg">
      <div className=" h-[50vh] w-full flex-1 overflow-clip rounded-xl md:h-full">
        <Suspense fallback={<MapSkeleton />}>
          <StopMap stops={bus.stops} />
        </Suspense>
      </div>
      <div className=" absolute left-0 top-0 flex w-full flex-row justify-between p-4 xs:p-5">
        <div className=" w-full rounded-md bg-white p-2">
          <h2 className=" m-0 text-xl font-bold xs:text-2xl">
            Bus Stop Location
          </h2>
        </div>
      </div>
    </div>
  );
}
