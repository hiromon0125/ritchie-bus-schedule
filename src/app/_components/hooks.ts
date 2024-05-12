"use client";

import { useEffect, useState } from "react";
import type { Bus, BusRoute } from "./types";
import { getStopStatus } from "./util";

export function useBusStatus(routes: BusRoute[], bus: Bus) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const status = getStopStatus(routes, currentTime, bus?.isWeekend ?? false);
  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentTime(new Date());
    }, status.nextUpdate);
    return () => clearTimeout(interval);
  }, [routes, status]);
  return status;
}
