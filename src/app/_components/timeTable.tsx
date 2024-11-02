"use client";

import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { api } from "../../trpc/react";
import { TimeTableSkeleton } from "./busPageLoaders";
import { getArriTime } from "./util";

export default function TimeTable({
  stopId,
  busId,
}: {
  stopId?: number;
  busId?: number;
}) {
  const searchParams = useSearchParams();
  const bus = busId ?? Number(searchParams.get("busId"));
  const stop = stopId ?? Number(searchParams.get("stopId"));
  const { data: route, isLoading } = api.routes.getAllByStopAndBus.useQuery({
    stopId: stop,
    busId: bus,
  });

  if (isLoading) return <TimeTableSkeleton />;

  if (!route)
    return (
      <div className=" max-h-[500px] rounded-md bg-white">
        <h3 className=" text-2xl font-bold">
          {busId ? "Bus route" : stopId ? "Stop" : "Times"} not found
        </h3>
      </div>
    );

  return (
    <div className=" max-h-[50vh] w-full overflow-scroll bg-white">
      <div className=" flex flex-row items-stretch border-b">
        <div className="relative flex h-auto flex-col pt-2">
          <div className=" h-1 w-5 bg-[--bus-color]" />
          <div className=" mx-[6px] w-2 flex-1 bg-[--bus-color]" />
        </div>
        <div className=" flex flex-row gap-1">
          <p className=" mr-1 w-[74px] pt-2 text-center font-bold">Arrival</p>
          <p className=" py-2 pr-2">-</p>
          <p className=" w-[74px] pt-2 font-bold">Departure</p>
        </div>
      </div>
      {route.map((r, i) => {
        const arriTime = getArriTime(r, i > 0 ? route[i - 1] : undefined);
        return (
          <div
            key={r.id}
            className="flex flex-row items-stretch gap-1 border-b"
          >
            <div className=" relative h-auto">
              <div className=" mx-[6px] h-full w-2 bg-[--bus-color]" />
              <div className=" absolute left-1/2 top-1/2 aspect-square w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-slate-700 bg-white" />
            </div>
            <p className=" w-[74px] py-2">
              {formatToLocalTimeString(arriTime)}
            </p>
            <p className=" py-2 pr-2">-</p>
            <p className=" w-[74px] py-2">
              {formatToLocalTimeString(r.deptTime)}
            </p>
          </div>
        );
      })}
      <div className="relative flex h-4 flex-col pb-2">
        <div className=" mx-[6px] w-2 flex-1 bg-[--bus-color]" />
        <div className=" h-1 w-5 bg-[--bus-color]" />
      </div>
    </div>
  );
}

function formatToLocalTimeString(date: Date) {
  return DateTime.fromJSDate(date).toLocal().toFormat("h:mm a");
}
