"use client";
import type { Bus, Stops } from "@prisma/client";
import { useBusStatus } from "./hooks";
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
  bus,
  fetchedRoute,
  stop,
  hideStopName = false,
}: {
  bus: Bus;
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null };
  stop?: Stops;
  hideStopName?: boolean;
}) {
  const status = useBusStatus(bus, fetchedRoute, stop?.id);
  const { isMoving, statusMessage } = status ?? {};
  const activityColor = ACTIVITY_COLOR[isMoving ?? "out-of-service"];
  return (
    <div
      className=" relative flex h-12 min-h-max flex-row items-center overflow-hidden"
      style={{ "--status-color": activityColor } as React.CSSProperties}
    >
      <div className=" relative ml-5 h-3 w-3">
        {ACTIVE_STATUS.includes(isMoving) ? (
          <>
            <div className=" absolute left-0 top-0 h-3 w-3 animate-ping rounded-full bg-[--status-color]" />
            <div className=" absolute left-0 top-0 h-3 w-3 animate-pulse rounded-full bg-[--status-color] animation-delay-100" />
          </>
        ) : (
          <div className=" absolute left-0 top-0 h-3 w-3 rounded-full bg-[--status-color] animation-delay-100" />
        )}
      </div>
      <div className=" flex h-full w-full flex-col justify-center pl-4">
        {isMoving === "loading" ? (
          <div className=" h-4 w-9/12 animate-pulse rounded-sm bg-slate-300 animation-delay-100" />
        ) : (
          <h3 className=" text-left text-sm">{statusMessage}</h3>
        )}
        {!hideStopName &&
          ACTIVE_STATUS.includes(isMoving) &&
          (stop ? (
            <p className=" m-0 text-left text-sm">{stop?.name}</p>
          ) : (
            <div className="mt-1 h-4 w-3/6 animate-pulse rounded-sm bg-slate-300 animation-delay-150" />
          ))}
      </div>
    </div>
  );
}

export function BusStatusBig({
  stops,
  bus,
  fetchedRoute,
}: {
  stops: Stops[];
  bus: Bus;
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null };
}) {
  const status = useBusStatus(bus, fetchedRoute);
  const stop = stops.find((stop) => stop.id === status?.location?.stopId);
  let stopLocationMessage;
  if (status.isMoving === "moving") {
    stopLocationMessage = `Next stop: ${stop?.name ?? "Unknown"}`;
  } else if (status.isMoving === "stopped") {
    stopLocationMessage = `Currently at ${stop?.name ?? "Unknown"}`;
  } else if (status.isMoving === "starting") {
    stopLocationMessage = `Bus is starting at ${stop?.name ?? "Unknown"}`;
  }
  return (
    <>
      <h2 className=" text-lg font-bold xs:text-xl sm:mb-2 sm:text-4xl">
        Status
      </h2>
      {<p className=" text-xl">{stopLocationMessage}</p>}
      <p className=" mb-4 text-lg sm:mb-8 sm:text-xl">
        {status?.statusMessage}
      </p>
    </>
  );
}
