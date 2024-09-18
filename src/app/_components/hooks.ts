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
  const fetchCount = useRef(0);
  const { data: nextRoute } = api.routes.getCurrentRouteOfBus.useQuery(
    {
      busId,
    },
    {
      refetchInterval(_, query) {
        const data = query.state.data;
        if (busId === -1) return false;
        if (data == undefined || data == null) {
          fetchCount.current = 0;
          return 1000 * 60;
        }
        const { deptTime } = data;
        const now = getCurrentTime().date;
        const diff = deptTime.getTime() - now.getTime();
        if (diff < 0 && fetchCount.current < 5) {
          fetchCount.current++;
          return 100;
        } else if (diff < 0) {
          return 1000 * 60;
        }
        fetchCount.current = 0;
        return diff;
      },
    },
  );
  return useBusStatusPerf(bus, nextRoute);
}

export function useBusStatusPerf(
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
