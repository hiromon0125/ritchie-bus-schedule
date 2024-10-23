"use client";

import type { Bus } from "@prisma/client";
import _ from "lodash";
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

const QUERY_SIZE = 30;

export function useBusStatus(
  bus: Bus,
  fetchedRoute?: { serverGuess: BusRoute | null; lastRoute: BusRoute | null },
) {
  const busId = bus?.id ?? -1;
  const [index, setIndex] = useState(fetchedRoute?.serverGuess?.index ?? 0);
  const offset = Math.max(
    Math.floor((index - 1) / (QUERY_SIZE / 2)) * (QUERY_SIZE / 2),
    0,
  );
  const { data } = api.routes.getAllByBusId.useQuery({
    busId,
    offset: offset,
    windowsize: QUERY_SIZE,
  });
  const nextRoute =
    index === fetchedRoute?.serverGuess?.index
      ? fetchedRoute?.serverGuess
      : data?.[index - offset];
  const check = () => {
    const { date, isWeekend } = getCurrentTime();
    if (
      bus.isWeekend != isWeekend ||
      nextRoute == undefined ||
      data == undefined
    )
      return false;
    const prevRoute =
      index - 1 - offset > 0 ? data?.[index - 1 - offset] : undefined;
    const deptTime = nextRoute?.deptTime;
    if (prevRoute?.deptTime && prevRoute.deptTime.getTime() > date.getTime()) {
      return index - 1;
    }
    if (
      deptTime.getTime() < date.getTime() &&
      (!fetchedRoute?.lastRoute ||
        fetchedRoute.lastRoute.deptTime.getTime() > date.getTime())
    ) {
      let newIndex;
      if (
        fetchedRoute?.lastRoute &&
        (fetchedRoute.lastRoute.deptTime.getTime() - date.getTime()) * 2 <
          nextRoute.deptTime.getTime() - date.getTime()
      ) {
        newIndex =
          index + Math.floor((fetchedRoute.lastRoute.index - index) / 2);
      } else {
        const searchedIndex = _.findIndex(
          data,
          (route) => route?.deptTime > date,
        );
        newIndex = (searchedIndex ?? QUERY_SIZE) + offset;
      }
      return newIndex;
    }
  };
  const status = useBusStatusClocked(bus, nextRoute);
  useEffect(() => {
    const newIndex = check();
    if (newIndex) {
      console.log(`bus: ${bus.id} from ${index} to ${newIndex}`);
      setIndex(newIndex);
    }
    if (nextRoute) {
      const updateTime =
        nextRoute.deptTime.getTime() - getCurrentTime().date.getTime();
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, updateTime);
      return () => clearTimeout(timeout);
    }
  });
  const res = data ? (status ?? OUT_OF_SERVICE_STATUS) : LOADING_STATUS;
  return res;
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
