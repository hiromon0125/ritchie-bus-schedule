"use client";

import type { Bus } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { api } from "t/react";
import type { BusRoute } from "./types";
import { getCurrentTime, getStopStatusPerf } from "./util";

/**
 * The status of a bus at a given time.
 * @typedef {"starting" | "moving" | "stopped" | "out-of-service"} BusMovingStatus
 * - "starting": The bus is starting its route on this route.
 * - "moving": The bus is moving to this route.
 * - "stopped": The bus is stopped at this route.
 * - "out-of-service": The bus is out of service. (eod)
 * - "departed": The bus has departed from this route. This is not a valid status and should be treated as an error or trigger a refetching of the data.
 */
export type BusMovingStatus =
  | "starting"
  | "moving"
  | "stopped"
  | "out-of-service"
  | "departed";

export function useBusStatus(bus: Bus) {
  const busId = bus?.id ?? -1;
  const { data: nextRoute, refetch: requeryData } =
    api.routes.getCurrentRouteOfBus.useQuery({
      busId,
    });
  const fetchCount = useRef(0);
  const refetch = async () => {
    if (fetchCount.current++ < 5) await requeryData();
  };
  const resetFetchCount = () => {
    fetchCount.current = 0;
  };
  return useBusStatusPerf(bus, nextRoute, refetch, resetFetchCount);
}

export function useBusStatusPerf(
  bus: Bus,
  nextRoute: BusRoute | null | undefined,
  refetchDataCallback: () => Promise<void>,
  resetFetchCount: () => void,
) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const status = getStopStatusPerf(
    nextRoute,
    bus?.isWeekend ?? false,
    currentTime,
  );

  useEffect(() => {
    if (status == undefined) {
      setCurrentTime(getCurrentTime());
      (async function refetch() {
        await refetchDataCallback();
      })().catch(console.error);
      return;
    }
    resetFetchCount();
    const interval = setTimeout(() => {
      setCurrentTime(getCurrentTime());
    }, status?.nextUpdate ?? 1000);
    return () => clearTimeout(interval);
  }, [nextRoute, status]);
  return status;
}
