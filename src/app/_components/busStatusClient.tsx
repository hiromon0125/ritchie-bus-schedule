"use client";

import { api } from "../../trpc/react";
import BusStatusString, { BusStatusStringBig } from "./busStatusString";

export function BusStatusBig({ busId }: { busId: number }) {
  const { data: currentRoute, isLoading } =
    api.routes.getCurrentRouteOfBus.useQuery({
      busId,
    });
  if (isLoading) {
    return <SkeletonBusStatusString />;
  }
  return (
    <BusStatusStringBig busId={busId} fetchedRoute={currentRoute ?? null} />
  );
}

export function SkeletonBusStatusString() {
  return (
    <div className=" flex h-12 flex-row items-center">
      <div className=" relative ml-5 h-3 w-3">
        <div className=" absolute left-0 top-0 h-3 w-3 rounded-full bg-[--bus-color] animation-delay-100" />
      </div>
      <div className=" relative flex h-full w-full flex-col justify-center pl-4">
        <div className=" h-5 w-9/12 animate-pulse rounded-sm bg-slate-300 animation-delay-100" />
      </div>
    </div>
  );
}

export function BusStatus({
  busId,
  stopId,
  hideStopName = false,
}: {
  busId: number;
  stopId?: number;
  hideStopName?: boolean;
}) {
  const { data: currentRoute, isLoading } =
    api.routes.getCurrentRouteOfBus.useQuery({
      stopId,
      busId,
    });
  if (isLoading) {
    return <SkeletonBusStatusString />;
  }
  return (
    <BusStatusString
      busId={busId}
      fetchedRoute={currentRoute ?? null}
      stopId={stopId}
      hideStopName={hideStopName}
    />
  );
}
