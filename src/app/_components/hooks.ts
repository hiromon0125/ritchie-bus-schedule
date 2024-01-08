"use client";

import { useEffect, useState } from "react";
import type { BusRoute } from "./types";
import { getNowInUTC, getStopStatus } from "./util";

export function useBusStatus(routes: BusRoute[]) {
  const [currentTime, setCurrentTime] = useState<Date>(getNowInUTC());
  const status = getStopStatus(routes, currentTime);
  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentTime(getNowInUTC());
    }, status.nextUpdate);
    return () => clearTimeout(interval);
  }, [routes, status]);
  return status;
}
