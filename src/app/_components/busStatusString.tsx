"use client";
import Image from "next/image";
import iconStyles from "~/styles/animated-icon.module.css";
import { api } from "../../trpc/react";
import { useBusStatus } from "./hooks";
import { type Bus, type BusRoute, type BusStop } from "./types";

export default function BusStatusString({
  routes,
  bus,
}: {
  routes: BusRoute[];
  bus: Bus;
}) {
  const { isMoving, statusMessage, location } = useBusStatus(routes, bus);
  const { data: stop } = api.stops.getOneByID.useQuery({
    id: location?.stopId ?? 0,
  });
  const level = isMoving ? 1 : !!location ? 2 : 3;
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
          alt={"Bus " + (isMoving ? "moving" : "stopped")}
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
  routes,
  stops,
  bus,
}: {
  routes: BusRoute[];
  stops: BusStop[];
  bus: Bus;
}) {
  const { isMoving, statusMessage, location } = useBusStatus(routes, bus);
  return (
    <>
      <h2 className=" text-2xl font-bold sm:text-4xl">Status</h2>
      {!!location && (
        <p className=" text-xl">
          {(isMoving &&
            `Next stop: ${
              stops.find((stop) => stop?.id === location?.stopId)?.name ??
              "Unknown"
            }`) ||
            (isMoving === false &&
              `Currently at ${
                stops.find((stop) => stop?.id === location?.stopId)?.name ??
                "Unknown"
              }`)}
        </p>
      )}
      <p className=" mb-4 text-lg sm:mb-8 sm:text-xl">{statusMessage}</p>
    </>
  );
}
