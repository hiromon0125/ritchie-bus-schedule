"use client";
import type { Bus, Stops } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { api } from "t/react";
import { useBusStatus } from "./hooks";
import { StopTag } from "./tags";
import type { BusMovingStatus, BusRoute } from "./types";

const ACTIVITY_COLOR: Record<BusMovingStatus, string> = {
  moving: "#77fe5c",
  stopped: "#ff564f",
  starting: "#ffae49",
  "out-of-service": "gray",
  departed: "gray",
  loading: "gray",
};
const ACTIVE_STATUS = ["moving", "stopped", "starting"];

export default function BusStatusString({
  busId,
  fetchedRoute,
  stopId,
  hideStopName = false,
}: {
  busId: Bus["id"];
  fetchedRoute?: BusRoute | null;
  stopId?: Stops["id"];
  hideStopName?: boolean;
}) {
  const status = useBusStatus(busId, fetchedRoute, stopId);
  const { isMoving, statusMessage, location } = status;
  const { data: stopObj } = api.stops.getOneByID.useQuery({
    id: location?.stopId ?? -1,
  });
  return (
    <div className="relative flex h-8 min-h-max flex-row items-center overflow-hidden">
      <div className="ml-2 flex items-center justify-center sm:ml-4">
        <StatusBlob status={isMoving} />
      </div>
      <div className="flex h-full w-full flex-col justify-center pl-4">
        {isMoving === "loading" ? (
          <div className="animation-delay-100 h-4 w-9/12 animate-pulse rounded-sm bg-slate-300" />
        ) : (
          <p className="text-left text-sm">{statusMessage}</p>
        )}
        {!hideStopName &&
          ACTIVE_STATUS.includes(isMoving) &&
          (stopObj ? (
            <p className="m-0 text-left text-sm">{stopObj?.name}</p>
          ) : (
            <div className="animation-delay-150 mt-1 h-4 w-3/6 animate-pulse rounded-sm bg-slate-300" />
          ))}
      </div>
    </div>
  );
}

const STOP_LOCATION_MESSAGE: Record<BusMovingStatus, string | undefined> = {
  moving: "Next stop:",
  stopped: "Currently at",
  starting: "Starting at",
  "out-of-service": undefined,
  departed: undefined,
  loading: undefined,
};

export function BusStatusStringBig({
  busId,
  fetchedRoute,
}: {
  busId: Bus["id"];
  fetchedRoute: BusRoute | null;
}) {
  const status = useBusStatus(busId, fetchedRoute);
  const { data: stop } = api.stops.getOneByID.useQuery({
    id: status?.location?.stopId ?? -1,
  });
  const stopLocationMessage = STOP_LOCATION_MESSAGE[status?.isMoving];
  return (
    <>
      {stopLocationMessage && stop && (
        <Link
          className="flex flex-row items-center gap-2"
          href={`/stop/${stop.id}?busId=${busId}`}
        >
          <StopTag stop={stop} />
          <p className="text-xl font-bold">{stop.name ?? "Unknown"}</p>
        </Link>
      )}
      <div className="flex flex-row items-center gap-3">
        <div className="flex items-center justify-center">
          <StatusBlob status={status?.isMoving} />
        </div>
        <p>{status?.statusMessage}</p>
      </div>
    </>
  );
}

export function StatusBlob({ status }: { status?: BusMovingStatus }) {
  const activityColor = ACTIVITY_COLOR[status ?? "out-of-service"];
  return (
    <div
      className="relative ml-2 h-3 w-3"
      style={{ "--status-color": activityColor } as React.CSSProperties}
    >
      {status && ACTIVE_STATUS.includes(status) ? (
        <>
          <div className="h-3 w-3 animate-ping rounded-full bg-(--status-color)" />
          <div className="animation-delay-100 absolute top-0 left-0 h-3 w-3 animate-pulse rounded-full bg-(--status-color)" />
        </>
      ) : (
        <div className="animation-delay-100 h-3 w-3 rounded-full bg-(--status-color)" />
      )}
    </div>
  );
}
