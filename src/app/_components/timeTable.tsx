"use client";

import { TimeTableSkeleton } from "@/busPageLoaders";
import { useBusStatus } from "@/hooks";
import type { BusRoute } from "@/types";
import { getArriTime } from "@/util";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { api } from "t/react";

export default function TimeTable({
  stopId,
  busId,
  fetchedRoute,
}: {
  stopId?: number;
  busId?: number;
  fetchedRoute?: BusRoute | null;
}) {
  const searchParams = useSearchParams();
  const bus =
    (searchParams.get("busId") ? Number(searchParams.get("busId")) : busId) ??
    -1;
  const stop = searchParams.get("stopId")
    ? Number(searchParams.get("stopId"))
    : stopId;
  const status = useBusStatus(bus ?? -1, fetchedRoute, stop);
  const { data: route, isLoading } = api.routes.getAllByBusId.useQuery({
    stopId: stop ?? -1,
    busId: bus ?? -1,
  });

  if (bus === undefined || stop === undefined) return <ErrorTimeTable />;
  if (isLoading) return <TimeTableSkeleton />;
  if (!route) return <ErrorTimeTable />;

  return (
    <div className="bg-item-background max-h-[50vh] w-full overflow-x-visible overflow-y-scroll">
      <div className="flex flex-row items-stretch border-b">
        <div className="relative flex h-auto flex-col pt-2">
          <div className="h-1 w-5 bg-(--bus-color)" />
          <div className="mx-[6px] w-2 flex-1 bg-(--bus-color)" />
        </div>
        <div className="flex flex-row gap-1">
          <p className="mr-1 w-[74px] pt-2 text-center font-bold">Arrival</p>
          <p className="py-2 pr-2">-</p>
          <p className="w-[74px] pt-2 font-bold">Departure</p>
        </div>
      </div>
      {route.map((r, i) => {
        const arriTime = getArriTime(r, i > 0 ? route[i - 1] : undefined);
        const currentStatus = status?.location?.id === r.id ? status : null;
        return (
          <div
            key={r.id}
            className={`relative ${currentStatus && status.isMoving === "stopped" && "rounded-lg border-4 border-blue-600"}`}
          >
            {currentStatus &&
              (status.isMoving === "starting" ||
                status.isMoving === "moving") && (
                <div
                  className={`absolute top-[-2px] left-0 z-10 h-1 w-full rounded-full ${status.isMoving === "moving" ? "bg-blue-600" : "bg-gray-600"}`}
                />
              )}
            <div className="flex flex-row items-stretch gap-1 border-b">
              <div className="relative h-auto">
                {currentStatus &&
                  (status.isMoving === "starting" ||
                    status.isMoving === "moving") && (
                    <div
                      className={`absolute top-[-6px] left-1/2 aspect-square w-3 -translate-x-1/2 rounded-full border-[3px] ${status.isMoving === "moving" ? "border-blue-600 bg-blue-600" : "border-gray-600 bg-gray-600"} `}
                    />
                  )}
                <div className="mx-[6px] h-full w-2 bg-(--bus-color)" />
                {!(currentStatus && status.isMoving === "stopped") && (
                  <div className="bg-item-background absolute top-1/2 left-1/2 aspect-square w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-slate-700" />
                )}
              </div>
              <p className="w-[74px] py-2">
                {formatToLocalTimeString(arriTime)}
              </p>
              <p className="py-2 pr-2">-</p>
              <p className="w-[74px] py-2">
                {formatToLocalTimeString(r.deptTime)}
              </p>
            </div>
          </div>
        );
      })}
      <div className="relative flex h-4 flex-col pb-2">
        <div className="mx-[6px] w-2 flex-1 bg-(--bus-color)" />
        <div className="h-1 w-5 bg-(--bus-color)" />
      </div>
    </div>
  );
}

function formatToLocalTimeString(date: Date) {
  const timezoneOffset = DateTime.local().offset / 60;
  return DateTime.fromJSDate(date, { zone: "utc" })
    .plus({ hours: timezoneOffset })
    .toFormat("h:mm a");
}

function ErrorTimeTable() {
  return (
    <div className="bg-item-background max-h-[500px] rounded-md">
      <h3 className="text-2xl font-bold">Times not found</h3>
    </div>
  );
}
