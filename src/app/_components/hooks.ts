"use client";

import { useEffect, useState } from "react";
import type { BusRoute } from "./types";
import { getNowInUTC, getStopStatus, getTimeToUpdateNext } from "./util";

export function useBusStatus(routes: BusRoute[]) {
  const [currentTime, setCurrentTime] = useState<Date>(getNowInUTC());
  const status = getStopStatus(routes, currentTime);
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentTime(getNowInUTC());
      },
      getTimeToUpdateNext(status?.statusMessage),
    );
    return () => clearInterval(interval);
  }, [routes, status]);
  return status;
}
