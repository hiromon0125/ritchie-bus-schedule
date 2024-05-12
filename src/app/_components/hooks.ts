"use client";

import { useEffect, useState } from "react";
import type { BusRoute } from "./types";
import { getStopStatus } from "./util";

export function useBusStatus(routes: BusRoute[]) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const status = getStopStatus(routes, currentTime);
  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentTime(new Date());
    }, status.nextUpdate);
    return () => clearTimeout(interval);
  }, [routes, status]);
  return status;
}
