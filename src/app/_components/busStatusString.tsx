"use client";
import type { Bus, Stops } from "@prisma/client";
import Image from "next/image";
import { api } from "t/react";
import iconStyles from "~/styles/animated-icon.module.css";
import { useBusStatus } from "./hooks";
import type { BusRoute } from "./types";

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
  const level = isMoving === "moving" ? 1 : isMoving === "stopped" ? 2 : 3;
  return (
    <div className=" relative flex h-20 min-h-max flex-row items-center overflow-hidden pr-3">
      <div className=" relative flex h-24 w-24 justify-center">
        <Image
          src={
            level === 1
              ? "/icons/Moving-icon.png"
              : level === 2
                ? "/icons/Stopped-icon.png"
                : "/icons/Out-of-service-icon.png"
          }
          alt={`Bus ${isMoving}`}
          width={96}
          height={96}
          priority
          className={
            level === 1
              ? iconStyles.moving
              : level === 2
                ? iconStyles.stopped
                : iconStyles.out
          }
        />
        {level === 3 && <div className={iconStyles.outAfter} />}
      </div>
      <div className=" flex h-full flex-col justify-center">
        <h3 className=" my-1 text-lg font-medium">{statusMessage}</h3>
        {!!stop?.name && <p>{stop?.name}</p>}
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
