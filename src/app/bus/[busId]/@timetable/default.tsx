import { currentUser } from "@clerk/nextjs/server";

import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { MdDirectionsBus } from "react-icons/md";
import { api } from "../../../../trpc/server";
import { TimeTableSkeleton } from "../../../_components/busPageLoaders";
import { StopTag } from "../../../_components/tags";
import TimeTable from "../../../_components/timeTable";

type Props = {
  params: Promise<{ busId: string }>;
  searchParams: Promise<{ stopId?: string | string[] | undefined }>;
};

export default async function TimeTableWidget(props: Props) {
  const [{ stopId: rawStopID }, params, user] = await Promise.all([
    props.searchParams,
    props.params,
    currentUser(),
  ]);
  const bus = await api.bus.getByID({
    id: parseInt(params.busId),
    includeStops: true,
  });

  if (!bus) {
    throw TRPCClientError.from(
      Error(`Bus not found (bus id: ${params.busId})`),
    );
  }

  let favoriteStops: number[] = [];
  if (user) {
    const stopIds = bus.stops.map((b) => b.id);
    const allStop = await api.favorite.getAllStop();
    favoriteStops = allStop
      .map((stop) => stop.stopId)
      .filter((bid) => stopIds.includes(bid))
      .filter(Boolean);
  }
  if (Array.isArray(rawStopID)) {
    permanentRedirect(`/bus/${params.busId}?stopId=${rawStopID[0]}`);
  }
  const stopId =
    favoriteStops.length > 0
      ? favoriteStops[0]
      : bus.stops.map((e) => e.id).sort()[0];
  const selectedStopId = rawStopID ? Number(rawStopID) : NaN;
  const selectedStop = !isNaN(selectedStopId)
    ? bus.stops.find((stop) => stop.id === selectedStopId)
    : bus.stops.find((stop) => stop.id === stopId);

  if (!selectedStop) {
    permanentRedirect(`/bus/${params.busId}?stopId=${stopId}`);
  }
  const currentRoute = await api.routes.getCurrentRouteOfBus({
    busId: bus.id,
    stopId: selectedStop.id,
  });
  return (
    <div className=" bg-border-background flex flex-1 flex-row flex-wrap gap-2 rounded-[20px] p-2 xs:gap-3 xs:rounded-3xl xs:p-3 md:max-w-screen-lg">
      <div className=" flex w-full flex-row justify-between rounded-xl bg-white p-3 py-2">
        <div className=" flex flex-col gap-2">
          <h2 className=" m-0 pl-2 font-bold text-gray-700 xs:text-lg">
            Timetable
          </h2>
          <Link
            href={`/stop/${selectedStop.id}`}
            className=" flex flex-row items-center gap-2"
          >
            <StopTag stop={selectedStop} size="lg" />
            <p className=" font-semibold xs:text-2xl">{selectedStop.name}</p>
          </Link>
        </div>
        <Link
          href={`/stop/${selectedStop.id}`}
          className=" mr-2 flex flex-col items-center justify-center"
        >
          <MdDirectionsBus size={24} color="gray" />
          <p className=" text-sm text-[gray]">View</p>
        </Link>
      </div>
      <div className=" flex w-full flex-col justify-between rounded-xl bg-white p-3 py-2">
        <Suspense fallback={<TimeTableSkeleton />}>
          <TimeTable
            busId={bus.id}
            stopId={selectedStop.id}
            fetchedRoute={currentRoute}
          />
        </Suspense>
      </div>
    </div>
  );
}
