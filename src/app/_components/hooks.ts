"use client";

import type { Bus } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "t/react";
import type { BusRoute } from "./types";
import { getCurrentTime, getStopStatusPerf } from "./util";

const OUT_OF_SERVICE_STATUS = {
  statusMessage: "Out of service",
  location: undefined,
  isMoving: "out-of-service",
  index: -2,
  nextUpdate: 5 * 60 * 1000,
} as const;
const LOADING_STATUS = {
  statusMessage: "Loading...",
  location: undefined,
  isMoving: "loading",
  index: -1,
  nextUpdate: 2000,
} as const;

export function useBusStatus(
  bus: Bus,
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null },
) {
  const busId = bus?.id ?? -1;
  const [index, setIndex] = useState(fetchedRoute?.serverGuess?.index ?? 0);
  const offset = Math.max(Math.floor((index - 1) / 5) * 5, 0);
  const { data } = api.routes.getAllByBusId.useQuery({
    busId,
    offset: offset,
    windowsize: 10,
  });
  const nextRoute =
    index === fetchedRoute?.serverGuess?.index
      ? fetchedRoute?.serverGuess
      : data?.[index - offset];
  const check = () => {
    console.log("checking");

    const { date, isWeekend } = getCurrentTime();
    if (bus.isWeekend != isWeekend || nextRoute == undefined) {
      return false;
    }
    const prevRoute = index > 0 ? data?.[index - 1 - offset] : undefined;
    const deptTime = nextRoute?.deptTime;
    if (prevRoute?.deptTime && prevRoute.deptTime.getTime() > date.getTime()) {
      setIndex(index - 1);
      console.log(
        "decreasing index",
        index - 1,
        fetchedRoute?.serverGuess?.index,
        bus.id,
      );
      return true;
    }
    if (
      deptTime.getTime() < date.getTime() &&
      (!fetchedRoute?.lastRoute ||
        fetchedRoute.lastRoute.deptTime.getTime() > date.getTime())
    ) {
      setIndex(index + 1);
      console.log(
        "increasing index",
        index + 1,
        fetchedRoute?.serverGuess?.index,
        bus.id,
      );
      return true;
    }
    return false;
  };
  const status = useBusStatusClocked(bus, nextRoute);
  return status ?? (check() ? LOADING_STATUS : OUT_OF_SERVICE_STATUS);
}

export function useBusStatusClocked(
  bus: Bus,
  nextRoute: BusRoute | null | undefined,
) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const status = getStopStatusPerf(
    nextRoute,
    bus?.isWeekend ?? false,
    currentTime,
  );
  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentTime(getCurrentTime());
    }, status?.nextUpdate ?? 2000);
    return () => clearTimeout(interval);
  }, [status]);
  return status;
}
