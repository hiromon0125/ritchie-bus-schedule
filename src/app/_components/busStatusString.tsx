"use client";
import type { Bus, Stops } from "@prisma/client";
import { api } from "t/react";
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
}: {
  bus: Bus;
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null };
}) {
  const status = useBusStatus(bus, fetchedRoute);
  const { isMoving, statusMessage, location } = status ?? {};
  const { data: stop } = api.stops.getOneByID.useQuery({
    id: location?.stopId ?? 0,
  });
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
      <div className=" flex h-full flex-col justify-center pl-4">
        <h3 className=" text-sm">{statusMessage}</h3>
        {ACTIVE_STATUS.includes(isMoving) &&
          (!!stop ? (
            <p className=" m-0 text-sm">{stop?.name}</p>
          ) : (
            <div className="h-5 w-[100px]" />
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
      <h2 className=" text-2xl font-bold sm:text-4xl">Status</h2>
      {<p className=" text-xl">{stopLocationMessage}</p>}
      <p className=" mb-4 text-lg sm:mb-8 sm:text-xl">
        {status?.statusMessage}
      </p>
    </>
  );
}
